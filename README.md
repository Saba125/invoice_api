📌 Project Overview: E-Commerce API (Without Payments & Notifications)
Tech Stack
Backend: Node.js (Express.js)
Database: PostgreSQL
Authentication: JWT, bcrypt
Email Sending: Nodemailer
📌 User Roles & Permissions
Role	Permissions
Buyer	Register, login, browse products, add to cart, place orders, view order history.
Admin	Manage products, categories, orders, and users.
📌 API Endpoints
1️⃣ Authentication (/auth)
✅ POST /register – Register a new user & send welcome email
✅ POST /login – Login & get JWT token

2️⃣ Products (/products)
✅ GET /products – Get all products
✅ POST /products – Add a new product (Admin only)
✅ PUT /products/:id – Update product (Admin only)
✅ DELETE /products/:id – Delete product (Admin only)

3️⃣ Categories (/categories)
✅ GET /categories – Get all categories
✅ POST /categories – Add a category (Admin only)

4️⃣ Cart (/cart)
✅ POST /cart – Add item to cart
✅ GET /cart – View cart items
✅ DELETE /cart/:id – Remove item from cart

5️⃣ Orders (/orders)
✅ POST /orders – Place an order & send order confirmation email
✅ GET /orders – View order history
