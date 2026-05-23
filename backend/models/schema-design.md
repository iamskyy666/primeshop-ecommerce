# High-Level Database Design

Our application contains three main collections:

```text
Users
Products
Orders
```

Relationship-wise:

```text
User
 │
 ├─────────────┐
 │             │
 ▼             ▼
Product      Order
                │
                ▼
           OrderItems
```

In plain English:

* A user can create products (admin functionality)
* A user can place orders
* An order contains products
* Products contain reviews written by users

Everything in the store revolves around these three collections.

---

# User Schema Design

```js
{
  name,
  email,
  password,
  isAdmin
}
```

This collection represents everyone who can log into the store.

Example document:

```json
{
  "_id": "123",
  "name": "Skyy",
  "email": "skyy@gmail.com",
  "password": "$2b$10...",
  "isAdmin": false
}
```

---

## Why do we store name?

```js
name: {
  type: String,
  required: true
}
```

This is the display name shown throughout the application.

Examples:

```text
Welcome back, Skyy
Order placed by Skyy
Review written by Skyy
```

Without storing the name we'd only have an email address.

---

## Why is email unique?

```js
email: {
  type: String,
  required: true,
  unique: true
}
```

Every account must have a unique email.

Without this constraint:

```json
{
  "email": "test@gmail.com"
}
```

could exist multiple times.

Then during login MongoDB would find several matching accounts.

The unique index prevents this situation.

---

## Password Design

```js
password: {
  type: String,
  required: true
}
```

We never store the actual password.

Instead:

```text
password123
```

becomes:

```text
$2b$10$hJ7A9....
```

using bcrypt.

Flow:

```text
User enters password
        ↓
bcrypt hashes password
        ↓
Hash stored in MongoDB
```

Later:

```text
Login password
        ↓
bcrypt.compare()
        ↓
Match or reject
```

Even if somebody steals the database, the original password isn't directly visible.

---

## Authorization Through isAdmin

```js
isAdmin: {
  type: Boolean,
  default: false
}
```

This field controls permissions.

Normal user:

```json
{
  "isAdmin": false
}
```

Administrator:

```json
{
  "isAdmin": true
}
```

This allows us to protect routes:

```js
if (!user.isAdmin) {
  throw new Error("Not authorized");
}
```

Admin users can:

```text
Create products
Update products
Delete products
Manage orders
Manage users
```

Regular users can:

```text
Browse products
Write reviews
Place orders
```

---

# Product Schema Design

Products are the heart of the store.

```js
{
  user,
  name,
  image,
  brand,
  category,
  description,
  reviews,
  rating,
  numReviews,
  price,
  countInStock
}
```

Each document represents a product we can purchase.

Example:

```json
{
  "name": "AirPods",
  "brand": "Apple",
  "price": 99,
  "countInStock": 20
}
```

---

# Product → User Relationship

```js
user: {
  type: Schema.Types.ObjectId,
  ref: "User"
}
```

This creates a reference to a user.

Usually this is the admin who created the product.

Example:

```json
{
  "name": "AirPods",
  "user": "adminUserId"
}
```

Relationship:

```text
Product ─────► User
```

Later we can populate:

```js
Product.find().populate("user")
```

and retrieve the creator's information automatically.

---

# Product Information Fields

These fields describe the item:

```js
name
image
brand
category
description
```

Example:

```json
{
  "name": "AirPods",
  "image": "/images/airpods.jpg",
  "brand": "Apple",
  "category": "Electronics",
  "description": "Wireless earbuds"
}
```

These are the fields displayed on product pages.

---

# Inventory Management

```js
countInStock
```

Tracks available inventory.

Example:

```json
{
  "countInStock": 15
}
```

Meaning:

```text
15 units available
```

After a purchase:

```text
15 → 14
```

When it reaches:

```text
0
```

the product becomes out of stock.

---

# Review Schema Design

Inside Product we have:

```js
reviews: [reviewSchema]
```

This means reviews are embedded directly inside the product document.

Example:

```json
{
  "reviews": [
    {
      "name": "Skyy",
      "rating": 5,
      "comment": "Excellent",
      "user": "123"
    }
  ]
}
```

---

## Why embed reviews?

Because reviews belong exclusively to a product.

Whenever we view:

```http
GET /api/products/:id
```

we usually need:

```text
Product details
Reviews
Average rating
```

all at the same time.

Embedding allows MongoDB to return everything in one document.

This is a common MongoDB design pattern.

---

## Review → User Relationship

Inside each review:

```js
user: {
  ref: "User"
}
```

This tells us who wrote the review.

Relationship:

```text
Review ─────► User
```

Useful for:

```text
Prevent duplicate reviews
Show reviewer information
Edit or remove reviews
```

---

# Why Store rating and numReviews?

We already have reviews.

Why not calculate everything every request?

Because it's expensive.

Suppose we have:

```text
10,000 reviews
```

To calculate the average rating:

```text
Load reviews
Sum ratings
Divide by count
```

every request.

Instead we store:

```js
rating
numReviews
```

Example:

```json
{
  "rating": 4.8,
  "numReviews": 327
}
```

Now MongoDB simply returns the values directly.

This is called **precomputed data** and is a common optimization.

---

# Order Schema Design

The Order schema represents a completed purchase.

It answers:

```text
Who bought?
What was bought?
How much was paid?
Where was it shipped?
Was it delivered?
```

---

# Order → User Relationship

```js
user: {
  ref: "User"
}
```

Example:

```json
{
  "user": "user123"
}
```

Meaning:

```text
This order belongs to user123
```

Relationship:

```text
Order ─────► User
```

One user can have many orders.

---

# Order Items Design

```js
orderItems: [
  {
    name,
    qty,
    image,
    price,
    product
  }
]
```

Each item represents a purchased product.

Example:

```json
{
  "orderItems": [
    {
      "name": "AirPods",
      "qty": 2,
      "price": 99
    }
  ]
}
```

---

# Why duplicate product information?

This is one of the most important design decisions.

Notice:

```js
name
image
price
```

are copied into the order.

Even though:

```js
product
```

already references Product.

Why?

Because orders are historical records.

Imagine:

Today:

```text
AirPods = $99
```

Customer purchases.

Next month:

```text
AirPods = $149
```

If the order stored only Product ID:

```text
Old order suddenly shows $149
```

which is incorrect.

Instead:

```json
{
  "price": 99
}
```

is permanently preserved.

This technique is called **denormalization**.

Real e-commerce systems use it extensively.

---

# Shipping Address Design

```js
shippingAddress
```

Example:

```json
{
  "address": "123 Main Street",
  "city": "Kolkata",
  "postalCode": "700001",
  "country": "India"
}
```

---

## Why not store only User address?

Because users move.

Suppose:

```text
Order placed in 2026
```

Address:

```text
Kolkata
```

Later:

```text
User moves to Berlin
```

We still need to know where the original package was shipped.

Therefore shipping information is copied into the order itself.

The order becomes a historical snapshot.

---

# Payment Information

```js
paymentMethod
```

Examples:

```text
PayPal
Stripe
UPI
Cash On Delivery
```

This allows reporting and analytics.

For example:

```text
60% UPI
25% Cards
15% COD
```

---

# Payment Result

```js
paymentResult
```

Stores information returned by the payment provider.

Example:

```json
{
  "id": "PAY123",
  "status": "COMPLETED"
}
```

Useful for:

```text
Refunds
Disputes
Support requests
Payment verification
Auditing
```

---

# Price Breakdown Design

Instead of only:

```js
totalPrice
```

we store:

```js
itemsPrice
taxPrice
shippingPrice
totalPrice
```

Example:

```json
{
  "itemsPrice": 100,
  "taxPrice": 18,
  "shippingPrice": 20,
  "totalPrice": 138
}
```

This makes invoices straightforward:

```text
Products  ₹100
Tax       ₹18
Shipping  ₹20
----------------
Total     ₹138
```

---

# Order Lifecycle

Initially:

```json
{
  "isPaid": false,
  "isDelivered": false
}
```

After payment:

```json
{
  "isPaid": true,
  "paidAt": "2026-05-23"
}
```

After delivery:

```json
{
  "isDelivered": true,
  "deliveredAt": "2026-05-27"
}
```

Lifecycle:

```text
Order Created
      ↓
Paid
      ↓
Processed
      ↓
Shipped
      ↓
Delivered
```

The schema tracks the most important stages.

---

# MongoDB Design Patterns Used

Our schemas demonstrate two major MongoDB strategies.

## Referencing

Used when documents are independent entities:

```text
Product ─► User
Review ─► User
Order ─► User
OrderItem ─► Product
```

Implemented using:

```js
ObjectId + ref
```

---

## Embedding

Used when data belongs entirely to a parent document:

```text
reviews
orderItems
shippingAddress
paymentResult
```

These are embedded directly inside the parent document.

Benefits:

```text
Single query
Fast reads
Simpler retrieval
```

---

# The REST API That Naturally Emerges

These schemas almost dictate the API structure.

### Users

```http
POST   /api/users
POST   /api/users/login
GET    /api/users/profile
PUT    /api/users/profile
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/reviews
```

### Orders

```http
POST   /api/orders
GET    /api/orders/:id
GET    /api/orders/myorders
PUT    /api/orders/:id/pay
PUT    /api/orders/:id/deliver
```

Notice that the API structure directly mirrors the database design. The schemas define not only how data is stored, but also what operations our application can perform and how the different parts of the e-commerce system interact.
