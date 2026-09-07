import { Input } from "../../../components/common/Input";
import { FormField } from "../../../components/common/FormField";
import {
  FieldRow,
  FieldStack,
} from "../../business/components/FormLayout.styles";

export interface DetectedProductFormValues {
  name: string;
  quantity: string;
  rate: string;
  mrp: string;
  amount: string;
  expiryDate: any;
  batchNumber: string;
  manufacturer: string;
}

interface NewProductFormProps {
  values: DetectedProductFormValues;
  errors: Partial<Record<keyof DetectedProductFormValues, string>>;
  onChange: (field: keyof DetectedProductFormValues, value: string) => void;
  /** Current Stock can't be edited here - it only changes via the invoice quantity being added. */
  disableQuantity?: boolean;
}

export function NewProductForm({
  values,
  errors,
  onChange,
  disableQuantity,
}: NewProductFormProps) {
  const handleChange =
    (field: keyof DetectedProductFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value);

  const handleAmount =
    (field: keyof DetectedProductFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount =
        field === "rate"
          ? Number(event.target.value) * Number(values.quantity)
          : Number(event.target.value) * Number(values.rate);
      onChange("amount", newAmount.toString());
      return onChange(field, event.target.value);
    };

  return (
    <FieldStack>
      <FormField
        label="Product Name"
        htmlFor="detected-name"
        error={errors.name}
      >
        <Input
          id="detected-name"
          value={values.name}
          disabled={disableQuantity}
          onChange={handleChange("name")}
          $hasError={!!errors.name}
        />
      </FormField>

      <FieldRow>
        <FormField
          label="Quantity (from invoice)"
          htmlFor="detected-quantity"
          error={errors.quantity}
        >
          <Input
            id="detected-quantity"
            type="number"
            min="0"
            step="1"
            value={values.quantity}
            onChange={handleAmount("quantity")}
            $hasError={!!errors.quantity}
          />
        </FormField>
        <FormField label="MRP." htmlFor="detected-mrp">
          <Input
            id="detected-mrp"
            type="number"
            min="0"
            step="1"
            value={values.mrp}
            onChange={handleChange("mrp")}
          />
        </FormField>
      </FieldRow>

      <FieldRow>
        <FormField
          label="Rate"
          htmlFor="detected-cost-price"
          error={errors.rate}
        >
          <Input
            id="detected-cost-price"
            type="number"
            min="0"
            step="0.01"
            value={values.rate}
            onChange={handleAmount("rate")}
            $hasError={!!errors.rate}
          />
        </FormField>
        <FormField
          label="Amount"
          htmlFor="detected-selling-price"
          error={errors.amount}
        >
          <Input
            id="detected-selling-price"
            type="number"
            min="0"
            step="0.01"
            disabled
            value={values.amount}
            onChange={handleChange("amount")}
            $hasError={!!errors.amount}
          />
        </FormField>
        <FormField label="Expriy Date" htmlFor="expiryDate">
          <Input
            id="expiryDate"
            type="date"
            value={values.expiryDate}
            onChange={handleChange("expiryDate")}
          />
        </FormField>

        <FormField label="Batch Number" htmlFor="batchNumber">
          <Input
            id="batchNumber"
            type="text"
            value={values.batchNumber}
            onChange={handleChange("batchNumber")}
          />
        </FormField>
      </FieldRow>
      <FormField label="Manufacturer" htmlFor="manufacturer">
        <Input
          id="manufacturer"
          type="text"
          value={values.manufacturer}
          onChange={handleChange("manufacturer")}
        />
      </FormField>
    </FieldStack>
  );
}
