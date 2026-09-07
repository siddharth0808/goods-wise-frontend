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
  gap: ${({ theme }) => theme.spacing(5)};
  width: 100%;
`;

const SplitLayout = styled.div`
  display: grid;
  gap: 0;
  align-items: stretch;
  flex: 1;
  min-height: 0;

  ${() => media.tabletDown`
    grid-template-columns: 1fr;
  `}
`;

const SearchColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-right: ${({ theme }) => theme.spacing(6)};
  min-width: 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`;

const CartColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: sticky;
  top: 40px;

  ${() => media.tabletDown`
    border-left: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    top: auto;
  `}
`;

const CartItemsList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const ValidationNotice = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;
const PanelFooterContainer = styled(PanelFooter)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const PanelBodyContainer = styled(PanelBody)`
  min-height: 460px;
  overflow-y: auto;
`;

const PanelContainer = styled(Panel)`
    height: auto;
    max-height: 90vh;
    min-width: 468px;
  position: sticky;
  top: 40px;
  ${() => media.tabletDown`
    position: static;
  `}
`;

const CreateSalePageContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(5)};
  width: 100%;
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
    <CreateSalePageContainer>
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
        </SplitLayout>
      </Content>
      {cart.length > 0 && (
        <CartColumn>
          <PanelContainer onClick={(event) => event.stopPropagation()}>
            <PanelHeader>
              <PanelTitle>Current Sale</PanelTitle>
            </PanelHeader>
            <PanelBodyContainer>
              {/* {product.warnings.length > 0 && <ImportWarning warnings={product.warnings} />} */}

              <CartItemsList>
                {cart.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    readonly={false}
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
            </PanelBodyContainer>
            <PanelFooterContainer>
              {/* <SummaryBlock> */}
              <SaleSummary
                subtotal={subtotal}
                discount={discount}
                showDiscount={true}
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
              {/* </SummaryBlock> */}
            </PanelFooterContainer>
          </PanelContainer>
        </CartColumn>
      )}
    </CreateSalePageContainer>
  );
}
