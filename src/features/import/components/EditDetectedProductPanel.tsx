import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import type { DetectedProduct, InvoiceProducts } from '../types/import.types';
import type { Product } from '../../inventory/types/product.types';
import { NewProductForm, type DetectedProductFormValues } from './NewProductForm';
import { isNonNegativeNumber, isRequired, validateFields } from '../../../utils/validation';
import { formatCurrency } from '../../../utils/formatters';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 40;
  display: flex;
  justify-content: flex-end;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Body = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const CurrentProductCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const CurrentProductLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CurrentProductName = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CurrentProductMeta = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(6)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

function toFormValues(product: InvoiceProducts): any {
 
  return {
    name: product.name,
    quantity: String(product.quantity),
    rate: String(product.rate),
    mrp: String(product.mrp),
    amount: String(product.amount),
    expiryDate: product?.expiryDate ? new Date(product?.expiryDate || '').toISOString().split('T')[0] : '',
    batchNumber: product?.batchNumber || '',
    manufacturer: product?.manufacturer || '',
  };
}

interface EditDetectedProductPanelProps {
  product: InvoiceProducts;
  matchedProduct?: Product;
  onClose: () => void;
  onSave: (changes: Partial<DetectedProduct>) => void;
}

export function EditDetectedProductPanel({
  product,
  matchedProduct,
  onClose,
  onSave,
}: EditDetectedProductPanelProps) {
  const [values, setValues] = useState<DetectedProductFormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<Partial<Record<keyof DetectedProductFormValues, string>>>({});

  const handleChange = (field: keyof DetectedProductFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const isExisting =  product.status  === 'EXISTING';
  const handleSave = () => {
    const validationErrors = validateFields(values, {
      name: (value) => (!isRequired(value) ? 'Product Name is required.' : undefined),
      quantity: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid quantity.' : undefined),
      rate: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid rate.' : undefined),
      mrp: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid MRP.' : undefined),
      amount: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid amount.' : undefined),
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      name: values.name,
      quantity: Number(values.quantity),
      rate: Number(values.rate),
      mrp: Number(values.mrp),
      amount: Number(values.amount),
      expiryDate: new Date(values.expiryDate).valueOf(),
      batchNumber: values.batchNumber,
      manufacturer: values.manufacturer,
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>Edit Imported Product</Title>
        </Header>
        <Body>
          {/* {product.warnings.length > 0 && <ImportWarning warnings={product.warnings} />} */}

          {matchedProduct && (
            <CurrentProductCard>
              <CurrentProductLabel>Current Inventory Product</CurrentProductLabel>
              <CurrentProductName>{matchedProduct.name}</CurrentProductName>
              <CurrentProductMeta>
                Current stock: {matchedProduct.currentStock} · {formatCurrency(matchedProduct.mrp)}
              </CurrentProductMeta>
            </CurrentProductCard>
          )}

          <NewProductForm
            values={values}
            errors={errors}
            onChange={handleChange}
            disableQuantity={isExisting}
          />
        </Body>
        <Footer>
          <Button type="button" $variant="secondary" $fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" $fullWidth onClick={handleSave}>
            Save
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  );
}
