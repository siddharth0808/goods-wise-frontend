import styled from 'styled-components';
import { Button } from '../../../components/common/Button';

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(10)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  text-align: center;
`;

const Badge = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const ErrorDetails = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const DetailLabel = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 90px;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface SaleErrorScreenProps {
  message: string;
  errorCode?: string;
  onBackToCart: () => void;
  onTryAgain: () => void;
}

export function SaleErrorScreen({ message, errorCode, onBackToCart, onTryAgain }: SaleErrorScreenProps) {
  return (
    <Card>
      <Badge>
        <AlertCircleIcon />
      </Badge>
      <TextGroup>
        <Title>Unable to complete sale</Title>
        <Subtitle>Your inventory was not changed. Please try again.</Subtitle>
      </TextGroup>
      <Divider />
      <ErrorDetails>
        {errorCode && (
          <DetailRow>
            <DetailLabel>Error Code</DetailLabel>
            <DetailValue>{errorCode}</DetailValue>
          </DetailRow>
        )}
        <DetailRow>
          <DetailLabel>Reason</DetailLabel>
          <DetailValue>{message}</DetailValue>
        </DetailRow>
      </ErrorDetails>
      <Divider />
      <Actions>
        <Button type="button" $variant="secondary" $fullWidth onClick={onBackToCart}>
          Back to Cart
        </Button>
        <Button type="button" $fullWidth onClick={onTryAgain}>
          Try Again
        </Button>
      </Actions>
    </Card>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
