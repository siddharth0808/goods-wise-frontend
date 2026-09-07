# Figma UI/UX Prompt — Sprint 4: Sales / POS

Design the UI/UX for Sprint 4 of an existing inventory management application called **InventoryFlow**.

IMPORTANT:
This is an extension of an existing product.

DO NOT redesign or change the existing:

* Login
* Signup
* Email verification
* Business setup
* Inventory
* Product details
* Stock adjustment
* Inventory history
* Invoice import
* Profile
* Authentication
* Navigation
* Existing design system

Reuse the existing:

* Color palette
* Typography
* Spacing
* Border radius
* Buttons
* Form inputs
* Cards
* Tables
* Icons
* Status badges
* Navigation
* Overall visual language

The product is built for business owners and will eventually run on:

* Web
* Android
* iOS
* Windows
* macOS

Sprint 4 is primarily a **Sales / POS workflow**.

==================================================
SPRINT 4 GOAL
=============

Allow a business owner to quickly create and manage a sale.

The core workflow:

Inventory / Sales
↓
Create Sale
↓
Search Products
↓
Add Products
↓
Set Quantity
↓
Review Cart
↓
Calculate Total
↓
Select Payment Method
↓
Confirm Sale
↓
Inventory Reduced
↓
Sale Completed

The POS experience should be fast, simple, and suitable for repeated daily use.

Do NOT design:

* Purchases
* Supplier management
* AI
* RAG
* Advanced analytics
* Customer loyalty
* Tax reporting
* Refund workflow
  unless required visually for the basic sale flow.

==================================================
SCREEN 1 — SALES LIST
=====================

Create a Sales page.

Header:

Sales

Subtitle:

"View and manage your sales"

Primary action:

[ + New Sale ]

Search:

"Search by sale number or product"

Filters:

[ All ]
[ Today ]
[ This Week ]
[ This Month ]

Optional date range filter.

Desktop table:

Columns:

Sale ID
Date & Time
Items
Total
Payment Method
Status
Actions

Example:

## Sale ID       Date          Items   Total   Payment      Status

SALE-1001     03 Sep 10:20    3     ₹520   UPI          Completed
SALE-1002     03 Sep 11:10    1     ₹120   Cash         Completed
SALE-1003     03 Sep 12:25    5     ₹850   Card         Completed

Actions:

View Details

Mobile:

Use sale cards rather than a desktop table.

==================================================
SCREEN 2 — CREATE SALE / POS
============================

This is the MOST IMPORTANT SCREEN of Sprint 4.

Create a fast desktop POS experience.

Desktop layout:

LEFT / CENTER:
Product search and product selection

RIGHT:
Current sale/cart

Recommended layout:

┌───────────────────────────────────────────────────────────┐
│ New Sale                                                  │
├─────────────────────────────────────┬─────────────────────┤
│                                     │ Current Sale        │
│ Search Products                     │                     │
│ [ Search product... ]               │ Maggi 70g    ×2    │
│                                     │ ₹30                 │
│ ┌────────┐ ┌────────┐ ┌────────┐   │                     │
│ │ Maggi  │ │ Coke   │ │ Rice   │   │ Coke 500ml   ×1    │
│ │ ₹15    │ │ ₹40    │ │ ₹450   │   │ ₹40                 │
│ │ Stock  │ │ Stock  │ │ Stock  │   │                     │
│ └────────┘ └────────┘ └────────┘   │                     │
│                                     │ Subtotal     ₹70    │
│                                     │ Discount       ₹0   │
│                                     │ ----------------   │
│                                     │ Total         ₹70   │
│                                     │                     │
│                                     │ [ Proceed ]         │
└─────────────────────────────────────┴─────────────────────┘

The cart should remain visible while adding products.

==================================================
PRODUCT SEARCH
==============

Search by:

* Product name
* HSN if applicable
* Other currently supported product identifiers

Since SKU/barcode are NOT required in the current product model, do not make SKU or barcode the primary interaction.

Search results should show:

Product Name
Brand
Selling Price
Available Stock

Example:

Maggi Noodles 70g
Nestle

₹15

Stock: 100

[ + Add ]

If the product is out of stock:

Stock: 0

[ Out of Stock ]

Do not allow adding an unavailable product.

==================================================
ADD PRODUCT TO CART
===================

Clicking Add:

Product is added to cart with:

Default quantity = 1

If already added:

Do not create a duplicate cart row.

Instead:

Increase quantity or focus the existing cart item.

Example:

Maggi 70g × 2

Provide quantity controls:

[ − ]  2  [ + ]

Also allow direct quantity entry.

==================================================
CART
====

Each cart item should show:

Product Name
Unit Price
Quantity
Line Total
Remove action

Example:

Maggi 70g
₹15 × 2

₹30

[ − ] 2 [ + ]      Remove

Use a clean compact layout.

The cart should always show the current total.

==================================================
STOCK VALIDATION
================

The UI must clearly indicate when requested quantity exceeds available stock.

Example:

Available Stock: 5

Requested Quantity: 8

Show:

⚠ Insufficient Stock

"Only 5 units are available."

Do not allow checkout until the problem is resolved.

If stock changes while the sale is being completed, the backend is the final authority.

==================================================
SALE SUMMARY
============

Show:

Subtotal
Discount
Total

For Sprint 4, keep discount functionality simple.

If discount is included, support:

* Fixed amount
* Percentage

Example:

Subtotal        ₹520
Discount         -₹20
────────────────────
Total            ₹500

Do not introduce complex promotion/coupon systems.

==================================================
SCREEN 3 — CHECKOUT
===================

After clicking:

[ Proceed ]

show Checkout.

Display:

Sale Items
Subtotal
Discount
Final Total

Payment Method:

○ Cash
○ UPI
○ Card
○ Other

Primary action:

[ Complete Sale ]

Secondary:

[ Back to Cart ]

Keep the payment selection extremely simple.

==================================================
SCREEN 4 — CONFIRM SALE
=======================

Before completing the transaction, show a confirmation state.

Example:

Confirm Sale

3 products
4 total units

Subtotal: ₹520
Discount: ₹20
Total: ₹500

Payment:
UPI

Question:

"Complete this sale?"

Actions:

[ Cancel ]
[ Confirm Sale ]

The confirmation action must be visually clear.

==================================================
SCREEN 5 — PROCESSING SALE
==========================

After confirmation, show a short processing state.

Example:

Processing Sale

✓ Validating products
✓ Checking stock
● Completing sale

Do not show fake percentage progress.

Prevent duplicate submission.

The user should not be able to accidentally submit the same sale twice.

==================================================
SCREEN 6 — SALE SUCCESS
=======================

After successful sale:

✓ Sale Completed

Sale ID:
SALE-1004

Items:
3

Total:
₹500

Payment:
UPI

Actions:

[ View Sale ]
[ New Sale ]

Optional:

[ Print Receipt ]

Keep print functionality visually prepared but do not design advanced receipt management.

==================================================
SCREEN 7 — SALE DETAILS
=======================

Create Sale Details screen.

Header:

Sale #SALE-1004

Status:

Completed

Show:

Date & Time
Payment Method

Items:

Product
Quantity
Unit Price
Total

Example:

Maggi 70g
2 × ₹15
₹30

Coke 500ml
1 × ₹40
₹40

Summary:

Subtotal
Discount
Total

Actions:

[ New Sale ]

If cancellation/void is part of the implementation, visually prepare:

[ Void Sale ]

but keep it secondary and clearly separated from normal actions.

==================================================
SCREEN 8 — SALE HISTORY
=======================

Sales list should support pagination.

Desktop:

Use a table.

Mobile:

Use sale cards.

Allow:

* Search
* Date filtering
* Basic status filtering

Do not add complex reporting dashboards in this sprint.

==================================================
EMPTY STATES
============

Sales page with no sales:

"No sales yet"

"Completed sales will appear here."

[ + New Sale ]

Empty cart:

"Your cart is empty"

"Search and add products to start a sale."

==================================================
ERROR STATES
============

Design:

1. Unable to load sales
2. Product search failed
3. Product unavailable
4. Insufficient stock
5. Sale creation failed
6. Payment selection missing
7. Duplicate sale submission
8. Network failure

Example:

"Unable to complete sale"

"Your inventory was not changed. Please try again."

==================================================
IMPORTANT INVENTORY BEHAVIOR
============================

When a sale is successfully completed:

Product stock must decrease.

Example:

Before:

Maggi = 100

Sale:

Maggi × 2

After:

Maggi = 98

Create an inventory transaction:

Type:
SALE / STOCK_OUT

Quantity:
2

The UI should not directly modify stock.

The backend is responsible for the actual atomic operation.

==================================================
ATOMIC SALE EXPERIENCE
======================

From the user's perspective:

Confirm Sale
↓
Sale Created
+
Sale Items Created
+
Inventory Deducted
+
Inventory Transaction Created
↓
Success

If the operation fails:

No partial sale should appear as completed.

==================================================
RESPONSIVE DESIGN
=================

Desktop:

* POS split layout
* Product search on left
* Cart on right
* Sticky cart totals
* Keyboard-friendly interactions

Tablet:

* Responsive two-column layout
* Reduce unnecessary columns

Mobile:

* Product search at top
* Cart accessible as a dedicated section/sheet
* Large quantity controls
* Sticky checkout button

Do NOT simply shrink the desktop POS onto mobile.

==================================================
DESKTOP POS UX
==============

Optimize for speed.

Useful interactions:

* Focus search automatically
* Keyboard navigation
* Enter to add/select
* Arrow keys where appropriate
* Quick quantity adjustment
* Sticky checkout area

Avoid unnecessary animations.

The POS should feel usable repeatedly throughout a business day.

==================================================
REUSABLE COMPONENTS
===================

Create reusable components:

SalesTable
SaleCard
ProductSearch
ProductSearchResult
Cart
CartItem
QuantitySelector
StockAvailabilityBadge
SaleSummary
DiscountInput
PaymentMethodSelector
CheckoutSummary
SaleConfirmationDialog
SaleSuccess
SaleDetails
SalesFilter
EmptyState
ErrorState
LoadingSkeleton

==================================================
VISUAL STATES
=============

Design all important states:

1. Empty sales list
2. Sales list
3. Searching products
4. Product search results
5. Empty cart
6. Product added
7. Multiple products in cart
8. Quantity changed
9. Insufficient stock
10. Checkout
11. Confirmation
12. Processing
13. Sale success
14. Sale failure
15. Sale details

==================================================
UX PRINCIPLES
=============

The primary goal is:

"Find products → Add to cart → Confirm payment → Complete sale"

The POS must be:

* Fast
* Clear
* Low-friction
* Easy for non-technical business owners
* Reliable
* Desktop-friendly
* Mobile-friendly

Avoid excessive information during checkout.

Show only what the user needs at each stage.

==================================================
FINAL USER JOURNEY
==================

Sales
↓

* New Sale
  ↓
  Search Product
  ↓
  Add Product
  ↓
  Adjust Quantity
  ↓
  Review Cart
  ↓
  Checkout
  ↓
  Select Payment
  ↓
  Confirm Sale
  ↓
  Complete Sale
  ↓
  Inventory Deducted
  ↓
  Success
  ↓
  Sale Details

````

### Design priority

For this sprint, I'd prioritize the **New Sale/POS screen** above everything else.

The ideal desktop experience is:

```text
┌─────────────────────────────────────────────────────┐
│  Product Search                 │ Current Sale      │
│                                 │                  │
│  Search...                      │ Product × Qty    │
│                                 │ Product × Qty    │
│  Product   Product   Product    │ Product × Qty    │
│                                 │                  │
│  Product   Product   Product    │                  │
│                                 │ Subtotal         │
│                                 │ Discount         │
│                                 │ TOTAL            │
│                                 │                  │
│                                 │ [ Checkout ]     │
└─────────────────────────────────────────────────────┘
````

That layout gives the cashier/business owner **product selection and cart visibility at the same time**, which is the main UX requirement for a fast POS workflow.
