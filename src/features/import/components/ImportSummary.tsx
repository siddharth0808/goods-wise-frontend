import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { media } from '../../../styles/breakpoints';

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  flex-wrap: wrap;

  ${() => media.mobile`
    flex-direction: column;
    align-items: flex-start;
    bottom: 67px;
  `}

  ${() => media.tabletDown`
    bottom: 67px;
  `}

`;

const TotalsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
`;

const Divider = styled.span`
  width: 1px;
  height: 16px;
  background: ${({ theme }) => theme.colors.border};
`;

const Strong = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface ImportSummaryProps {
  existingCount: number;
  newCount: number;
  totalCount: number;
  estimatedUnits: number;
  onBack: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export function ImportSummary({
  existingCount,
  newCount,
  totalCount,
  estimatedUnits,
  onBack,
  onConfirm,
  confirmDisabled,
}: ImportSummaryProps) {
  return (
    <Bar>
      <TotalsRow>
        <span>
          <Strong>{existingCount}</Strong> existing matched
        </span>
        <span>•</span>
        <span>
          <Strong>{newCount}</Strong> new products
        </span>
        <span>•</span>
        <span>
          <Strong>{totalCount}</Strong> total items
        </span>
        <Divider />
        <span>
          Estimated inventory units: <Strong>{estimatedUnits.toLocaleString()}</Strong>
        </span>
      </TotalsRow>
      <Actions>
        <Button type="button" $variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={confirmDisabled}>
          Confirm Import
        </Button>
      </Actions>
    </Bar>
  );
}
