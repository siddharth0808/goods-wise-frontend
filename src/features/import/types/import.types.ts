export type MatchType = 'EXISTING' | 'NEW' | 'NEEDS_REVIEW' | 'CANNOT_MATCH';
export type ReviewStatus = 'ready' | 'needs_info' | 'warning';

export interface InvoiceFileMeta {
  name: string;
  /** Bytes. */
  size: number;
  type: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  distributor: string;
}

export interface ImportSummary {
  productsDetected: number;
  existingProducts: number;
  newProducts: number;
  warnings: number;
}

export interface DetectedProduct {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  mrp: number;
  amount: number;
  expiryDate:any;
  batchNumber: string;
  manufacturer: string;
}

export interface AnalyzeInvoiceResult {
  importId: string;
  invoice: InvoiceMeta;
  summary: ImportSummary;
  products: DetectedProduct[];
}

export interface ConfirmImportRequest {
  products: InvoiceProducts[];
}

export interface ImportFailedItem {
  id: string;
  name: string;
  reason: string;
}

export interface ImportResultData {
  status: 'ideal' |'success' | 'partial';
  productsProcessed: number;
  existingProductsUpdated: number;
  newProductsCreated: number;
  totalUnitsAdded: number;
  failedItems?:any;
}

export type ImportRecordStatus = 'successful' | 'needs_review' | 'failed';

export interface ImportRecord {
  id: string;
  importedAt: string;
  invoiceNumber: string;
  distributor: string;
  productsTotal: number;
  productsImported: number;
  unitsAdded: number;
  status: ImportRecordStatus;
  importedBy?: string;
}

export type StepState = 'done' | 'active' | 'pending';

export interface ProcessingStep {
  label: string;
  state: StepState;
}

export interface UploadInvoice {
  invoiceId:string;
  status:string;
  uploadUrl:string;
  expiredIn:number;
}

export interface InvoiceProducts {
  id:string
  name: string;

  manufacturer?: string;

  batchNumber?: string;
  expiryDate: string;

  hsn?: string;

  quantity: number;
  currentQuantity: number;

  mrp?: number;
  rate: number;
  discount?: number;

  sgst: number;
  cgst: number;

  amount: number;
  status:MatchType
}

export interface Invoice {
  invoiceNumber?: string;
  invoiceDate?: string;

  supplier: InvoiceSupplier;

  products: InvoiceProducts[];

  total?: number;
}

export interface InvoiceSupplier {
  name?: string;
  address?: string;
  gstin?: string;
  contact?:string;
}