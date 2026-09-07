import styled from 'styled-components';

export const Panel = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
export const PanelHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
export const PanelTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const PanelBody = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

export const PanelFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(6)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CartItemRowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const ItemDetails = styled.div<{ $readonly?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$readonly ? "row" : "column")};
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`;

export const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-shrink: 0;
`;
export const LineItem = styled.span`
  min-width: 48px;
  text-align: right;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ItemName = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;