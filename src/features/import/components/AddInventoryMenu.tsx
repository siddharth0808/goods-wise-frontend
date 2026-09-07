import styled from "styled-components";
import { Button } from "../../../components/common/Button";
import {
  AddIcon,
  FileTextIcon,
} from "../../../components/common/Icons/Icons";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
`;

const ItemIcon = styled.span<{ $highlight?: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: #ffff; //${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.textSecondary};
`;

interface AddInventoryMenuProps {
  onAddProductManually: () => void;
  onImportFromInvoice: () => void;
}

export function AddInventoryMenu({
  onAddProductManually,
  onImportFromInvoice,
}: AddInventoryMenuProps) {
  return (
    <Wrapper>
      <Button type="button" onClick={() => onAddProductManually()}>
        <ItemIcon>
          <AddIcon />
        </ItemIcon>
        Add Product Manually
      </Button>
      <Button type="button" onClick={() => onImportFromInvoice()}>
        <ItemIcon $highlight>
              <FileTextIcon />
            </ItemIcon>
        Import from Invoice
      </Button>
    </Wrapper>
  );
}
