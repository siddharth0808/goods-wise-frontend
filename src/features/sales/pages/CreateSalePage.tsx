import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/common/Button";
import { Loader } from "../../../components/common/Loader";
import { ErrorState } from "../../../components/common/ErrorState";
import { EmptyState } from "../../../components/common/EmptyState";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { fetchProducts } from "../../inventory/store/inventorySlice";
import {
  addToCart,
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
  setCartItemQuantity,
} from "../store/posSlice";
import { PosProductSearchBar } from "../components/PosProductSearchBar";
import { ProductGridCard } from "../components/ProductGridCard";
import { CartItemRow } from "../components/CartItemRow";
import { SaleSummary } from "../components/SaleSummary";
import {
  calculateDiscountAmount,
  calculateSubtotal,
  calculateTotal,
  isCartValid,
} from "../utils/saleMath";
import { media } from "../../../styles/breakpoints";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../../../styles/common";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  height: 100%;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: ${({ theme }) => theme.spacing(6)};
  align-items: start;
  flex: 1;
  min-height: 0;

  ${() => media.tabletDown`
    grid-template-columns: 1fr;
  `}
`;

const SearchColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  min-width: 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

// Sticky so the cart totals and Checkout button stay reachable without
// scrolling, no matter how many products are on screen (per spec: "Sticky
// cart totals").
const CartColumn = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  max-height: calc(100vh - 140px);

  ${() => media.tabletDown`
    position: static;
    max-height: none;
  `}
`;

const CartTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CartItemsList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const SummaryBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ValidationNotice = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

export default function CreateSalePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useAppSelector(
    (state) => state.inventory,
  );
  const cart = useAppSelector((state) => state.pos.cart);
  const discount = useAppSelector((state) => state.pos.discount);

  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Focus search automatically - the POS should be ready to type into the
  // moment it opens, for fast, repeated daily use.
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;
    return products.filter((product) =>
      [product.name, product.manufacturer, product.category]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(trimmed)),
    );
  }, [products, query]);

  const subtotal = calculateSubtotal(cart);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  const total = calculateTotal(subtotal, discountAmount);
  const cartValid = isCartValid(cart);
  const hasStockIssue = cart.length > 0 && !cartValid;

  const renderProductGrid = () => {
    if (status === "loading" || status === "idle") {
      return <Loader label="Loading products…" />;
    }
    if (status === "failed") {
      return (
        <ErrorState
          message={error ?? "Product search failed."}
          onRetry={() => dispatch(fetchProducts())}
        />
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <EmptyState
          title="No products found"
          description="Try a different search term, or add products from the Inventory page."
        />
      );
    }
    return (
      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductGridCard
            key={product.id}
            name={product.name}
            brand={product.manufacturer}
            sellingPrice={product.mrp}
            availableStock={product.currentStock}
            onAdd={() => dispatch(addToCart({ product }))}
          />
        ))}
      </ProductGrid>
    );
  };

  return (
    <Content>
      <PageHeader
        title="New Sale"
        subtitle="Search products and build the cart"
        onBack={() => navigate("/sales")}
      />

      <SplitLayout>
        <SearchColumn>
          <PosProductSearchBar
            ref={searchInputRef}
            value={query}
            onChange={setQuery}
          />
          {renderProductGrid()}
        </SearchColumn>

        <CartColumn>

          {cart.length && (
            <Panel onClick={(event) => event.stopPropagation()}>
              <PanelHeader>
                <PanelTitle>Current Sale</PanelTitle>
              </PanelHeader>
              <PanelBody>
                {/* {product.warnings.length > 0 && <ImportWarning warnings={product.warnings} />} */}

                <CartItemsList>
                  {cart.map((item) => (
                    <CartItemRow
                      key={item.productId}
                      item={item}
                      onIncrement={() =>
                        dispatch(incrementCartItem(item.productId))
                      }
                      onDecrement={() =>
                        dispatch(decrementCartItem(item.productId))
                      }
                      onChangeQuantity={(quantity) =>
                        dispatch(
                          setCartItemQuantity({
                            productId: item.productId,
                            quantity,
                          }),
                        )
                      }
                      onRemove={() => dispatch(removeCartItem(item.productId))}
                    />
                  ))}
                </CartItemsList>
              </PanelBody>
              <PanelFooter>
                <SaleSummary
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  total={total}
                />
                {hasStockIssue && (
                  <ValidationNotice role="alert">
                    ⚠ Resolve insufficient stock before proceeding to checkout.
                  </ValidationNotice>
                )}
                <Button
                  type="button"
                  $fullWidth
                  disabled={!cartValid}
                  onClick={() => navigate("/sales/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </PanelFooter>
            </Panel>
          )}
        </CartColumn>
      </SplitLayout>
    </Content>
  );
}
