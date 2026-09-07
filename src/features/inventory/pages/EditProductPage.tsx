import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { FormField } from "../../../components/common/FormField";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Loader } from "../../../components/common/Loader";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  clearUpdateError,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "../store/inventorySlice";
import {
  isNonNegativeNumber,
  isRequired,
  validateFields,
} from "../../../utils/validation";
import { FormError } from "../../auth/components/AuthCard.styles";
import {
  Divider,
  FieldRow,
  FieldStack,
  FormActions,
  FormCard,
} from "../../business/components/FormLayout.styles";
import type { Product } from "../types/product.types";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const ReadOnlyHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function EditProductPage() {
 const { productId = "" } = useParams<{ productId: string}>();
  const [searchParams] = useSearchParams();
  const isFromRow = searchParams.get("fromRow");  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = useAppSelector((state) =>
    state.inventory.products.find((item) => item.id === productId),
  );
  const listStatus = useAppSelector((state) => state.inventory.status);
  const isUpdating = useAppSelector((state) => state.inventory.isUpdating);
  const updateError = useAppSelector((state) => state.inventory.updateError);

  useEffect(() => {
    if (!product && listStatus === "idle") {
      dispatch(fetchProducts());
    } else if (!product && listStatus !== "loading") {
      dispatch(fetchProductById(productId));
    }
  }, [product, listStatus, productId, dispatch]);

  const [values, setValues] = useState<Product>({
    name: product?.name ?? "",
    mrp: Number(product?.mrp),
    rate: Number(product?.rate),
    currentStock: Number(product?.currentStock),
    minimumStock: Number(product?.minimumStock),
    expiryDate: product?.expiryDate ? new Date(product?.expiryDate).toISOString().split('T')[0] : '',
    manufacturer: product?.manufacturer || "",
    batchNumber: product?.batchNumber || "",
    hsn: Number(product?.hsn) || 0,
    amount: Number(product?.amount) || 0,
    discount: Number(product?.discount) || 0,
    sgst: Number(product?.sgst) || 0,
    cgst: Number(product?.cgst) || 0,
    status: "NEW",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Product, string>>
  >({});

  // Hydrate once the product is available (e.g. after a fetch on refresh).
  const hasHydrated = product !== undefined;
  useEffect(() => {
    if (product) {
      setValues({
        name: product?.name ?? "",
        mrp: Number(product?.mrp),
        rate: Number(product?.rate),
        currentStock: Number(product?.currentStock),
        minimumStock: Number(product?.minimumStock),
        expiryDate: product?.expiryDate ? new Date(product?.expiryDate || '').toISOString().split('T')[0] : product?.expiryDate,
        manufacturer: product?.manufacturer || "",
        batchNumber: product?.batchNumber || "",
        hsn: Number(product?.hsn) || 0,
        amount: Number(product?.amount) || 0,
        discount: Number(product?.discount) || 0,
        sgst: Number(product?.sgst) || 0,
        cgst: Number(product?.cgst) || 0,
        status: "NEW",
      });
    }
    // Only re-hydrate when the product transitions from unloaded to loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const handleChange =
    (field: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (updateError) dispatch(clearUpdateError());
    };

  if (!product) {
    return <Loader label="Loading product…" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) =>
        !isRequired(value) ? "Product Name is required." : undefined,
      mrp: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid selling price."
          : undefined,
      rate: (value) =>
        !isNonNegativeNumber(value) ? "Enter a valid cost price." : undefined,
      minimumStock: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid minimum stock."
          : undefined,
      expiryDate: (value) =>
        !isRequired(value) ? "Expiry date is required." : undefined,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isUpdating) return;

    const result = await dispatch(
      updateProduct({
        productId: product.id ?? "",
        payload: {
          name: values.name,
          manufacturer: values.manufacturer || '',
          mrp: Number(values.mrp),
          rate: Number(values.rate),
          currentStock: Number(values.currentStock),
          minimumStock: Number(values.minimumStock),
          amount: Number(values.amount) || 0,
          discount: Number(values.discount) || 0,
          expiryDate: values.expiryDate,
        },
      }),
    );
    if (updateProduct.fulfilled.match(result)) {
       const route =  isFromRow === 'true' ? `/inventory` : `/products/${product.id}`
      navigate(route, { replace: true });
    }
  };

  const onBack = (route:string) =>{
    if(isFromRow === 'true') return navigate(`/inventory`)
    return navigate(route)
  }

  return (
    <Content>
      <PageHeader
        title="Edit Product"
        subtitle={`Modify details of ${product.name}`}
        onBack={() => onBack(`/products/${product.id}`)}
      />

      <FormCard onSubmit={handleSubmit} noValidate>
        {updateError && <FormError role="alert">{updateError}</FormError>}

        <FieldStack>
          <FormField
            label="Product Name"
            htmlFor="name"
            error={fieldErrors.name}
          >
            <Input
              id="name"
              value={values.name}
              onChange={handleChange("name")}
              $hasError={!!fieldErrors.name}
            />
          </FormField>

          <FieldRow>
            <FormField label="MRP." htmlFor="mrp" error={fieldErrors.mrp}>
              <Input
                id="mrp"
                type="number"
                min="0"
                step="0.01"
                value={values.mrp}
                onChange={handleChange("mrp")}
                $hasError={!!fieldErrors.mrp}
              />
            </FormField>
            <FormField label="Rate" htmlFor="rate" error={fieldErrors.rate}>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={values.rate}
                onChange={handleChange("rate")}
                $hasError={!!fieldErrors.rate}
              />
            </FormField>
          </FieldRow>

          <FieldRow>
            <FormField label="Current Stock (Read Only)" htmlFor="currentStock">
              <Input
                id="currentStock"
                value={product.currentStock}
                disabled
                readOnly
              />
              <ReadOnlyHint>
                Stock can only be changed via Adjust Stock.
              </ReadOnlyHint>
            </FormField>
            <FormField
              label="Minimum Stock Level"
              htmlFor="minimumStock"
              error={fieldErrors.minimumStock}
            >
              <Input
                id="minimumStock"
                type="number"
                min="0"
                step="1"
                value={values.minimumStock}
                onChange={handleChange("minimumStock")}
                $hasError={!!fieldErrors.minimumStock}
              />
            </FormField>
          </FieldRow>
          <FormField
            label="Expriy Date"
            htmlFor="expiryDate"
            error={fieldErrors.expiryDate}
          >
            <Input
              id="expiryDate"
              type="date"
              value={values.expiryDate}
              onChange={handleChange("expiryDate")}
              $hasError={!!fieldErrors.expiryDate}
            />
          </FormField>
        </FieldStack>

        <Divider>Optional Details</Divider>

        <FieldStack>
          <FormField label="Manufacturer" htmlFor="manufacturer">
            <Input
              id="manufacturer"
              placeholder="ABC Pvt. Ltd."
              value={values.manufacturer}
              onChange={handleChange("manufacturer")}
            />
          </FormField>
          <FieldRow>
            <FormField label="Total Amt." htmlFor="amount">
              <Input
                id="amount"
                value={values.amount}
                onChange={handleChange("amount")}
              />
            </FormField>
            <FormField label="Discount" htmlFor="discount">
              <Input
                id="discount"
                value={values.discount}
                onChange={handleChange("discount")}
              />
            </FormField>
          </FieldRow>
        </FieldStack>

        <FormActions>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="button"
            $variant="ghost"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            Cancel
          </Button>
        </FormActions>
      </FormCard>
    </Content>
  );
}
