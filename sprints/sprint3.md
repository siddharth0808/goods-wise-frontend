

Design the DESKTOP UI for Sprint 3 of an existing inventory management application called "InventorySatck".

IMPORTANT:
This is an extension of an existing application.

DO NOT redesign the existing:
- Login
- Signup
- Email verification
- Business setup
- Inventory list
- Product details
- Profile
- Navigation
- Existing design system

Reuse the existing visual identity, colors, typography, spacing, buttons, inputs, cards, tables, icons, and navigation.

Sprint 3 is a DESKTOP-FIRST feature.

The target desktop platforms are:
- Windows
- macOS
- Web desktop

The application is built with react and must eventually support responsive layouts, but this sprint should prioritize large-screen desktop UX.

==================================================
PRODUCT CONTEXT
==================================================

GoodsWise helps business owners manage their inventory.

The user already has:

- Authentication
- Business setup
- Product management
- Inventory list
- Stock adjustment
- Inventory transactions

Sprint 3 introduces:

"Import Inventory from Distributor Invoice"

The goal is to allow a business owner to upload a distributor invoice containing multiple products and quickly add the products and stock to inventory.

The user should NOT have to manually enter every product.

==================================================
CORE USER FLOW
==================================================

Inventory
   ↓
Add Inventory
   ↓
Import from Invoice
   ↓
Upload Invoice
   ↓
Invoice Processing
   ↓
Review Extracted Products
   ↓
Resolve Existing / New Products
   ↓
Edit Product Information
   ↓
Confirm Import
   ↓
Import Complete
   ↓
Inventory Updated

==================================================
DESKTOP NAVIGATION
==================================================

Keep the existing desktop navigation.

Recommended:

Dashboard
Inventory
Profile

Inventory remains the active section.

Inside Inventory:

Inventory List
Product Details
Inventory History
Import Invoice

Do NOT add:
- Sales
- POS
- Purchases
- Suppliers
- AI
- RAG

==================================================
SCREEN 1 — INVENTORY LIST
==================================================

Extend the existing Inventory page.

Header:

Inventory

Subtitle:

"Manage your products and stock"

Primary button:

[ + Add Inventory ]

Clicking "+ Add Inventory" opens a menu:

┌─────────────────────────────────────┐
│ Add Inventory                       │
│                                     │
│ + Add Product Manually              │
│                                     │
│ Import from Distributor Invoice     │
└─────────────────────────────────────┘

The invoice option should be visually emphasized as a faster way to add multiple products.

==================================================
SCREEN 2 — IMPORT INVOICE
==================================================

Page title:

Import Inventory

Subtitle:

"Upload a distributor invoice to quickly add products and stock."

Desktop layout should use a centered content area with a large upload panel.

Upload area:

┌────────────────────────────────────────────────────┐
│                                                    │
│                     📄                             │
│                                                    │
│             Upload Distributor Invoice             │
│                                                    │
│       Drag and drop your invoice here              │
│                     or                             │
│                                                    │
│                [ Choose File ]                     │
│                                                    │
│       Supported formats: PDF, JPG, PNG             │
│       Maximum file size: 10 MB                     │
│                                                    │
└────────────────────────────────────────────────────┘

Below the upload area:

"Your invoice will be analyzed to detect products,
quantities and prices."

Add a privacy/security message:

"Your document is securely processed and associated
only with your business."

Do not make the screen visually complicated.

==================================================
SCREEN 3 — FILE SELECTED
==================================================

After selecting an invoice, show the uploaded document.

Desktop layout:

LEFT:
Invoice preview

RIGHT:
File information

Example:

┌──────────────────────────────┬───────────────────────────┐
│                              │ Invoice                   │
│                              │                           │
│      PDF PREVIEW             │ distributor_invoice.pdf   │
│                              │                           │
│                              │ 2.4 MB                    │
│                              │ PDF                       │
│                              │                           │
│                              │ ✓ Ready to process        │
│                              │                           │
│                              │ [ Analyze Invoice ]       │
│                              │                           │
└──────────────────────────────┴───────────────────────────┘

Actions:

[ Cancel ]
[ Analyze Invoice ]

If the uploaded file is an image, show the image preview.

==================================================
SCREEN 4 — PROCESSING
==================================================

After clicking "Analyze Invoice", show a clear processing state.

Title:

Analyzing Invoice

Message:

"We're extracting products and inventory information
from your invoice."

Show a progress indicator.

Suggested stages:

✓ Upload invoice
✓ Read invoice
● Extract product information
○ Match existing products
○ Prepare import

Do NOT show fake percentage progress if the backend does not provide real progress.

Use a step-based processing indicator instead.

The user should understand that they can wait and that the system is working.

==================================================
SCREEN 5 — REVIEW INVOICE
==================================================

This is the MOST IMPORTANT SCREEN of Sprint 3.

After processing, display:

Review Invoice

Subtitle:

"Review the detected products before adding them to inventory."

Top summary:

Invoice Number: INV-10293
Invoice Date: 25 Aug 2026
Distributor: ABC Distributors

Summary cards:

Products Detected     24
Existing Products     18
New Products           6
Warnings               2

==================================================
PRODUCT REVIEW TABLE
==================================================

Use a large desktop data table.

Columns:

Select
Product
Detected Name
SKU
Quantity
Cost Price
Selling Price
Existing Product
Status
Actions

Example:

┌────┬──────────────┬────────┬─────┬──────┬────────┬──────────────┬────────────┐
│ ✓  │ Maggi 70g    │ MAG001 │ 100 │ ₹12  │ ₹15    │ ✓ Existing   │ Ready      │
│ ✓  │ Coke 500ml   │ COKE01 │  50 │ ₹32  │ ₹40    │ ✓ Existing   │ Ready      │
│ ✓  │ Pepsi 500ml  │ —      │  30 │ ₹30  │ —      │ + New         │ Needs Info │
│ ✓  │ Rice 5kg     │ RICE01 │  20 │ ₹420 │ ₹450    │ ✓ Existing   │ Ready      │
└────┴──────────────┴────────┴─────┴──────┴────────┴──────────────┴────────────┘

Allow users to:

- Select/unselect rows
- Edit extracted values
- Change matched product
- Create a new product
- Remove an item from import

==================================================
PRODUCT MATCHING
==================================================

The system should automatically try to match invoice products with existing inventory products.

Show clear states:

✓ Existing Product
+ New Product
⚠ Needs Review
✕ Cannot Match

Example:

Maggi 70g
✓ Matched with existing product

Pepsi 500ml
+ New product

The user must be able to manually change the match.

For example:

Invoice Product:
"Pepsi 500 ML Bottle"

Matched Product:
"Pepsi 500ml"

[ Change ]

==================================================
NEW PRODUCT RESOLUTION
==================================================

When a detected invoice item is not found in inventory:

Show:

New Product

Product Name
SKU
Category
Brand
Cost Price
Selling Price
Minimum Stock

Pre-fill:
- Product name from invoice
- Cost price from invoice
- Quantity from invoice

Require the user to provide any missing required information.

Do not automatically import incomplete products.

Status:

⚠ Needs Information

Once complete:

✓ Ready

==================================================
EDIT DETECTED PRODUCT
==================================================

Clicking a row's Edit action opens a side panel or modal.

Title:

Edit Imported Product

Fields:

Product Name
SKU
Category
Brand
Quantity
Cost Price
Selling Price
Minimum Stock

Show:

Current Inventory Product

if the item has been matched to an existing product.

Actions:

[ Cancel ]
[ Save ]

Do NOT allow the user to directly edit current stock.

The invoice quantity is the stock being added.

==================================================
WARNINGS
==================================================

The review screen should clearly display warnings.

Examples:

⚠ Product name could not be matched

⚠ Selling price is missing

⚠ Duplicate product detected

⚠ Quantity is invalid

⚠ Product already exists in inventory

Do not block the entire invoice because one item has an issue.

Allow the user to resolve or exclude problematic rows.

==================================================
BULK ACTIONS
==================================================

Because invoices may contain many products, provide bulk actions.

Above the table:

24 products detected

[ Select All ]

When rows are selected:

[ Remove Selected ]
[ Mark as New Product ]
[ Change Match ]

Keep bulk actions simple.

Do not overwhelm the user.

==================================================
CONFIRM IMPORT
==================================================

At the bottom of the review screen, provide a sticky footer.

Example:

18 existing products
6 new products
24 total items

Estimated inventory units:
1,245

[ Back ]

[ Confirm Import ]

The Confirm Import button should be disabled while unresolved required errors exist.

Before final submission, optionally show a confirmation dialog:

Confirm Inventory Import?

"This will add 1,245 units across 24 products."

Existing products will have their stock increased.

New products will be created and added to inventory.

[ Cancel ]
[ Confirm Import ]

==================================================
SCREEN 6 — IMPORTING
==================================================

After confirmation:

Title:

Importing Inventory

Show:

✓ Validating products
✓ Creating new products
● Updating inventory
○ Creating inventory transactions

Do not show fake percentages.

Prevent duplicate submission.

Disable navigation actions that could cause accidental duplicate imports.

==================================================
SCREEN 7 — IMPORT SUCCESS
==================================================

After successful import:

Success state:

✓ Inventory Imported Successfully

Summary:

24 products processed
18 existing products updated
6 new products created

1,245 units added to inventory

Invoice:
INV-10293

Distributor:
ABC Distributors

Actions:

[ View Inventory ]

[ View Import Details ]

==================================================
SCREEN 8 — PARTIAL SUCCESS
==================================================

Design a partial failure state.

Example:

Inventory Import Completed

22 products imported successfully

2 products need attention

Show:

✓ 22 imported
⚠ 2 failed

[ Review Failed Items ]

[ View Inventory ]

The system should not silently fail.

==================================================
SCREEN 9 — IMPORT HISTORY
==================================================

Add an optional Import History section to Inventory.

Display previous invoice imports.

Table:

Date
Invoice Number
Distributor
Products
Units
Status
Imported By

Example:

25 Aug 2026
INV-10293
ABC Distributors
24 products
1,245 units
✓ Imported

This screen should be simple and secondary to the main import flow.

==================================================
IMPORTANT DATA BEHAVIOR
==================================================

Existing product:

Current Stock = 20

Invoice quantity = 100

After import:

Current Stock = 120

Create inventory transaction:

Type:
STOCK_IN

Quantity:
100

Do NOT create a duplicate product.

For a new product:

Invoice quantity = 100

Create product:

Current Stock = 100

Also create:

Inventory Transaction
Type = STOCK_IN
Quantity = 100

==================================================
DESKTOP UX REQUIREMENTS
==================================================

This is a desktop-first workflow.

Use the available screen width effectively.

Recommended desktop layout:

Left:
Navigation

Center:
Main workflow

Right:
Contextual information or editing panel when appropriate

Use:
- Tables
- Side panels
- Sticky action bars
- Tooltips
- Keyboard-friendly interactions
- Clear hierarchy

Avoid:
- Mobile-style cards everywhere
- Excessive whitespace
- Huge buttons
- Excessive animations

The review table should be the primary focus.

==================================================
RESPONSIVE BEHAVIOR
==================================================

Although desktop is the priority, the design should eventually support tablet/mobile.

Desktop:
- Full invoice preview
- Large review table
- Side panels
- Bulk actions

Tablet:
- Reduced table columns
- Expandable row details

Mobile:
- Step-based workflow
- Product cards instead of table
- One product editing at a time
- Sticky bottom confirmation button

Do not force the desktop table onto mobile.

==================================================
COMPONENTS TO DESIGN
==================================================

Create reusable components:

InvoiceUploadZone
InvoicePreview
InvoiceFileCard
InvoiceProcessingSteps
InvoiceSummaryCard
InvoiceReviewTable
InvoiceReviewRow
ProductMatchBadge
ProductStatusBadge
ProductEditPanel
NewProductForm
ImportWarning
BulkActionBar
ImportSummary
ImportConfirmationDialog
ImportProgress
ImportSuccess
ImportFailure
ImportHistoryTable

==================================================
VISUAL STATES
==================================================

Design all important states:

1. Empty upload
2. File selected
3. Invalid file
4. Processing
5. Processing failed
6. Invoice successfully analyzed
7. Review ready
8. Product matched
9. New product
10. Product needs information
11. Product warning
12. Importing
13. Import success
14. Partial success
15. Import failure

==================================================
OVERALL UX PRINCIPLE
==================================================

The main objective is:

"Upload invoice → Review → Confirm → Inventory updated"

The workflow should feel fast and trustworthy.

The user must always understand:

- What the system detected
- Which products already exist
- Which products are new
- What stock will be added
- Which items require attention
- What will happen after confirmation

AI/OCR extraction should assist the user, NOT silently make irreversible inventory changes.

The user must always review and confirm before inventory is modified.

Do not design AI chat interfaces for this feature.

This is an inventory import workflow, not an AI chatbot.

==================================================
FINAL DESIGN FLOW
==================================================

Inventory
    ↓
+ Add Inventory
    ↓
Import from Invoice
    ↓
Upload Invoice
    ↓
Preview Invoice
    ↓
Analyze
    ↓
Processing
    ↓
Review Products
    ↓
Resolve Matches / New Products
    ↓
Confirm Import
    ↓
Importing
    ↓
Success
    ↓
Inventory Updated