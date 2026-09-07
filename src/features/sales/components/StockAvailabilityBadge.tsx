import styled from 'styled-components';

const Text = styled.span<{ $muted?: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme, $muted }) => ($muted ? theme.colors.danger : theme.colors.textMuted)};
  font-weight: ${({ theme, $muted }) => ($muted ? theme.font.weight.medium : theme.font.weight.regular)};
`;

interface StockAvailabilityBadgeProps {
  availableStock: number;
}

export function StockAvailabilityBadge({ availableStock }: StockAvailabilityBadgeProps) {
  if (availableStock <= 0) {
    return <Text $muted>Out of Stock</Text>;
  }
  return <Text>{availableStock} available</Text>;
}
