import { forwardRef } from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.subtle};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
`;

const SearchIcon = styled.svg`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

interface PosProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// forwardRef so CreateSalePage can autofocus this on mount (per spec:
// "Focus search automatically" for a fast, repeated-use POS).
export const PosProductSearchBar = forwardRef<HTMLInputElement, PosProductSearchBarProps>(
  function PosProductSearchBar({ value, onChange }, ref) {
    return (
      <Bar>
        <SearchIcon width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
        </SearchIcon>
        <SearchInput
          ref={ref}
          type="text"
          placeholder="Search products by name or HSN..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Search products"
        />
      </Bar>
    );
  }
);
