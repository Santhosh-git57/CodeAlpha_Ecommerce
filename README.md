# CodeAlpha Ecommerce (Task 1)

A beginner-friendly full-stack e-commerce project built with **Express.js + MongoDB** and vanilla **HTML/CSS/JavaScript**.

## Features
- Product listings page
- Product details page
- Shopping cart
- User registration and login (JWT auth)
- Checkout and order processing
- Customer order history
- Admin dashboard
  - Manage products (add/update/delete)
  - View customers
  - View active carts
  - View and update order status

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT + bcryptjs

## Project Structure
- `server.js` - Express server entry point
- `config/` - DB connection
- `models/` - User, Product, Order, Cart schemas
- `routes/` - Auth, products, cart, orders, admin APIs
- `middleware/` - Auth and admin guards
- `public/` - Frontend pages and scripts
- `scripts/` - Seed scripts

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   copy .env.example .env
   ```
3. Update `.env`:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Seed data:
   ```bash
   npm run seed
   npm run seed:admin
   ```
5. Run project:
   ```bash
   npm run dev
   ```

## Default URLs
- App: `http://localhost:5000`
- Login: `http://localhost:5000/login.html`
- Admin: `http://localhost:5000/admin.html`

## Test Accounts
- Admin:
  - Email: `admin@yashcart.com`
  - Password: `admin123`
- Customer:
  - Create from Register page (`/register.html`)

## API Endpoints
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Products
  - `GET /api/products`
  - `GET /api/products/:id`
- Cart
  - `GET /api/cart`
  - `PUT /api/cart/sync`
  - `DELETE /api/cart/clear`
- Orders
  - `POST /api/orders`
  - `GET /api/orders/my`
- Admin
  - `GET /api/admin/users`
  - `GET /api/admin/carts`
  - `GET /api/admin/orders`
  - `PATCH /api/admin/orders/:id/status`
  - `GET /api/admin/products`
  - `POST /api/admin/products`
  - `PUT /api/admin/products/:id`
  - `DELETE /api/admin/products/:id`

## CodeAlpha Task Mapping
This project covers Task 1 requirements:
- Basic e-commerce site with product listings
- Shopping cart
- Product details page
- Order processing
- User registration/login
- Database storage for products, users, and orders
