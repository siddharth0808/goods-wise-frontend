import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchProducts } from '../../inventory/store/inventorySlice';
import {
  analyzeInvoice,

  clearFile,
  confirmImport,
  fileRejected,
  fileSelected,
  getInvoiceReview,
  getInvoiceStatus,
  removeProduct,
  resetImportWorkflow,
  updateDetectedProduct,
} from '../store/importSlice';
import { validateInvoiceFile } from '../utils/fileValidation';
import { getSelectedInvoiceFile, setSelectedInvoiceFile } from '../utils/fileHolder';
import { InvoiceUploadZone } from '../components/InvoiceUploadZone';
import { InvoicePreview } from '../components/InvoicePreview';
import { InvoiceFileCard } from '../components/InvoiceFileCard';
import { InvoiceSummaryCard } from '../components/InvoiceSummaryCard';
import { InvoiceReviewTable } from '../components/InvoiceReviewTable';
import { ImportSummary } from '../components/ImportSummary';
import { ImportProgress } from '../components/ImportProgress';
import { ImportConfirmationDialog } from '../components/ImportConfirmationDialog';
import { ImportSuccess } from '../components/ImportSuccess';
import { ImportFailure } from '../components/ImportFailure';
import { EditDetectedProductPanel } from '../components/EditDetectedProductPanel';
import { FormError } from '../../auth/components/AuthCard.styles';
import type { ProcessingStep } from '../types/import.types';
import { media } from '../../../styles/breakpoints';
import { InvoiceReviewCardList } from '../components/InvoiceReviewCardList';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  min-height: calc(100vh - 160px);
`;

const CenteredArea = styled.div`
  flex: 1;
  display: flex;
  min-height: 480px;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: ${({ theme }) => theme.spacing(6)};
  align-items: start;

  ${() => media.tabletDown`
    grid-template-columns: 1fr;
  `}
`;

const MetaBlock = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(10)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};

  ${() => media.tabletDown`
    grid-template-columns: repeat(2, 1fr);
  `}
`;

const ANALYSIS_STEP_LABELS = [
  'Upload invoice',
  'Read invoice',
  'Extract product information',
  'Match existing products',
  'Prepare import',
];

const IMPORTING_STEP_LABELS = [
  'Validating products',
  'Creating new products',
  'Updating inventory',
  'Creating inventory transactions',
];

function buildSteps(labels: string[], progress: number): ProcessingStep[] {
  return labels.map((label, index) => ({
    label,
    state: index < progress ? 'done' : index === progress ? 'active' : 'pending',
  }));
}

export default function ImportWizardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const importState = useAppSelector((state) => state.import);
  const existingProducts = useAppSelector((state) => state.inventory.products);
  const inventoryStatus = useAppSelector((state) => state.inventory.status);

  const [localFile, setLocalFile] = useState<File | null>(null);
  const file = localFile ?? getSelectedInvoiceFile();

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [importingProgress, setImportingProgress] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const analysisTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const importingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (inventoryStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [inventoryStatus, dispatch]);

  // Advance a client-side, step-based indicator while the analyze request is
  // in flight. This never claims a fake percentage - it only reveals the
  // next conceptual stage every so often, and the final step only turns
  // "done" once the request actually succeeds. The counter itself is reset
  // from the event that starts the request (handleAnalyze), not from here.
  useEffect(() => {
    if (importState.analyzeStatus === 'UPLOADED' || importState.analyzeStatus === 'PROCESSING') {
      analysisTimer.current = setInterval(() => {
        setAnalysisProgress((prev) => Math.min(prev + 1, ANALYSIS_STEP_LABELS.length - 1));
        dispatch(getInvoiceStatus(importState.invoiceId))
      }, 900);
    }
    return () => {
      if (analysisTimer.current) clearInterval(analysisTimer.current);
    };
  }, [importState.analyzeStatus]);

  useEffect(() => {
    if (importState.confirmStatus === 'loading') {
      importingTimer.current = setInterval(() => {
        setImportingProgress((prev) => Math.min(prev + 1, IMPORTING_STEP_LABELS.length - 1));
      }, 800);
    }
    return () => {
      if (importingTimer.current) clearInterval(importingTimer.current);
    };
  }, [importState.confirmStatus]);

   useEffect(() => {
    if (importState.analyzeStatus === 'REVIEW') {
      dispatch(getInvoiceReview(importState.invoiceId))

    }
  }, [importState.analyzeStatus]);

  const step = useMemo(() => {
    if (importState.confirmStatus === 'succeeded' && importState.result) {
      return importState.result.status === 'success' ? 'success' : 'partial';
    }
    if (importState.confirmStatus === 'loading') return 'importing';
    if (importState.analyzeStatus === 'UPLOADED' || importState.analyzeStatus === 'PROCESSING') return 'processing';
    if (importState.analyzeStatus === 'REVIEW') return 'review';

    // if (importState.invoiceId) return 'review';
    if (importState.fileMeta) return 'selected';
    return 'upload';
  }, [importState]);

  const handleFileSelected = (selected: File) => {
    const error = validateInvoiceFile(selected);
    if (error) {
      dispatch(fileRejected(error));
      return;
    }
    setLocalFile(selected);
    setSelectedInvoiceFile(selected);
    dispatch(fileSelected({ name: selected.name, size: selected.size, type: selected.type }));
  };

  const handleCancelSelection = () => {
    setLocalFile(null);
    setSelectedInvoiceFile(null);
    dispatch(clearFile());
  };

  const handleAnalyze = () => {
    if (!file) return;
    setAnalysisProgress(0);
    dispatch(analyzeInvoice(file));
  };

  const handleStartOver = () => {
    setLocalFile(null);
    setSelectedInvoiceFile(null);
    dispatch(resetImportWorkflow());
  };

  const editingProduct = importState?.invoice.products.find((product) => product.id === editingProductId) ?? null;

  const totals = useMemo(() => {
    const existing = importState?.invoice.products.filter((product) => product.status === 'EXISTING').length;
    const newCount = importState?.invoice.products.filter((product) => product.status === 'NEW').length;
    const warnings = importState?.invoice.products.filter(
      (product) => product.status === 'CANNOT_MATCH'
    ).length;
    const estimatedUnits = importState?.invoice.products.reduce((sum, product) => sum + (product.quantity || 0), 0);
    return { existing, newCount, warnings, estimatedUnits };
  }, [importState?.invoice.products]);

  // const hasUnresolvedIssues = importState?.invoice.products.some((product) => product.status !== 'ready');
  const confirmDisabled = importState?.invoice.products.length === 0;

  const handleConfirmImport = async () => {
    setShowConfirmDialog(false);
    setImportingProgress(0);
    const result = await dispatch(confirmImport());
    if (confirmImport.fulfilled.match(result)) {
      setLocalFile(null);
      setSelectedInvoiceFile(null);
    }
  };

  if (step === 'upload') {
    return (
      <Content>
        <PageHeader
          title="Import Inventory"
          subtitle="Upload a distributor invoice to quickly add products and stock."
          onBack={() => navigate('/inventory')}
        />
        <CenteredArea style={{ alignItems: 'center', justifyContent: 'center' }}>
          <InvoiceUploadZone onFileSelected={handleFileSelected} error={importState.fileError} />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'selected' && importState.fileMeta) {
    return (
      <Content>
        <PageHeader
          title="Import Inventory"
          subtitle="Confirm file details and begin intelligence analysis."
          onBack={handleCancelSelection}
        />
        <SplitLayout>
          {file ? (
            <InvoicePreview file={file} />
          ) : (
            <InvoiceFileCard
              fileMeta={importState.fileMeta}
              onAnalyze={handleAnalyze}
              onCancel={handleCancelSelection}
            />
          )}
          {file && (
            <InvoiceFileCard
              fileMeta={importState.fileMeta}
              onAnalyze={handleAnalyze}
              onCancel={handleCancelSelection}
              isAnalyzing={importState.analyzeStatus === 'loading'}
            />
          )}
        </SplitLayout>
        {importState.analyzeError && <FormError role="alert">{importState.analyzeError}</FormError>}
      </Content>
    );
  }

  if (step === 'processing') {
    return (
      <Content>
        <CenteredArea>
          <ImportProgress
            title="Analyzing Invoice"
            message="We're extracting products and inventory information from your invoice."
            steps={buildSteps(ANALYSIS_STEP_LABELS, analysisProgress)}
          />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'review') {
    return (
      <Content>
        <PageHeader
          title="Review Invoice"
          subtitle="Review the detected products before adding them to inventory."
          onBack={handleStartOver}
        />

        {importState.invoice && (
          <MetaBlock>
            <MetaItem>
              <MetaLabel>Invoice Number</MetaLabel>
              <MetaValue>{importState.invoice.invoiceNumber}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Invoice Date</MetaLabel>
              <MetaValue>{importState.invoice.invoiceDate}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Distributor</MetaLabel>
              <MetaValue>{importState.invoice.supplier?.name}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Distributor Address</MetaLabel>
              <MetaValue>{importState.invoice.supplier?.address}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Distributor Contact</MetaLabel>
              <MetaValue>{importState.invoice.supplier?.contact}</MetaValue>
            </MetaItem>
          </MetaBlock>
        )}

        <SummaryGrid>
          <InvoiceSummaryCard label="Products Detected" value={importState?.invoice.products.length} />
          <InvoiceSummaryCard label="Existing Products" value={totals.existing} />
          <InvoiceSummaryCard label="New Products" value={totals.newCount} />
          <InvoiceSummaryCard
            label="Warnings"
            value={totals.warnings}
            tone={totals.warnings > 0 ? 'warning' : 'default'}
          />
        </SummaryGrid>

        <InvoiceReviewTable
          products={importState?.invoice.products}
          onEdit={setEditingProductId}
          onRemove={(id) => dispatch(removeProduct(id))}
        />
        <InvoiceReviewCardList
        products={importState?.invoice.products}
          onEdit={setEditingProductId}
          onRemove={(id) => dispatch(removeProduct(id))}
        />

        {importState.confirmError && <FormError role="alert">{importState.confirmError}</FormError>}

        <ImportSummary
          existingCount={totals.existing}
          newCount={totals.newCount}
          totalCount={importState?.invoice.products.length}
          estimatedUnits={totals.estimatedUnits}
          onBack={handleStartOver}
          onConfirm={() => setShowConfirmDialog(true)}
          confirmDisabled={confirmDisabled}
        />

        {editingProduct && (
          <EditDetectedProductPanel
            key={editingProduct.id}
            product={editingProduct}
            matchedProduct={existingProducts.find((product) => product.id === editingProduct.id)}
            onClose={() => setEditingProductId(null)}
            onSave={(changes) => {
              dispatch(updateDetectedProduct({ id: editingProduct.id, changes }));
              setEditingProductId(null);
            }}
          />
        )}

        {showConfirmDialog && (
          <ImportConfirmationDialog
            totalUnits={totals.estimatedUnits}
            totalProducts={importState?.invoice.products.length}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirmImport}
          />
        )}
      </Content>
    );
  }

  if (step === 'importing') {
    return (
      <Content>
        <CenteredArea>
          <ImportProgress
            title="Importing Inventory"
            message="Processing distributor invoice and compiling inventory updates. This won't take long."
            steps={buildSteps(IMPORTING_STEP_LABELS, importingProgress)}
          />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'success' && importState.result) {
    return (
      <Content>
        <CenteredArea>
          <ImportSuccess
            result={importState.result}
            invoice={importState.invoice}
            onViewInventory={() => {
              dispatch(resetImportWorkflow());
              navigate('/inventory', {replace: true});
            }}
            onViewImportDetails={() => {
              dispatch(resetImportWorkflow());
              navigate('/import/history');
            }}
          />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'partial' && importState.result) {
    return (
      <Content>
        <CenteredArea>
          <ImportFailure
            result={importState.result}
            onViewInventory={() => {
              dispatch(resetImportWorkflow());
              navigate('/inventory');
            }}
          />
        </CenteredArea>
      </Content>
    );
  }

  return null;
}
