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