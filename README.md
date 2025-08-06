# Full-Stack Product Listing App

## 🚀 Project Overview

This project is a basic full-stack product listing application designed to allow users to sign up, log in, and manage their own products. The application also provides a public interface where all products added by any user can be viewed without requiring authentication. It's built with a strong focus on user authentication (JWT-based), product CRUD operations, and profile-based product management.

---

## ✨ Features

* **User Authentication:**
    * User signup with email and password.
    * User login with JWT tokens for secure session management.
    * User logout functionality.
    * Users can update their name and password (requires current password for verification).
* **Product Management (Authenticated Users):**
    * Users can add new products with title, description, price, and image upload.
    * Users can edit their existing products (including updating the image).
    * Users can delete their own products.
    * Product images are stored and served locally by the backend.
* **Public Product Listing:**
    * A dedicated page to view all products added by all users without requiring login.
    * Displays product image, title, price, and owner's name/email.
    * Clicking on a product navigates to a detailed product page.
* **Protected Routes:**
    * Ensures that only authenticated users can access profile and product management features.
* **Responsive UI:** Designed to be usable across various devices.

---

## 🛠️ Technology Stack

* **Frontend:** Next.js (TypeScript)
* **Backend:** FastAPI (Python)
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Styling:** Tailwind CSS (for Frontend)

---

## ⚙️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

### **1. Backend Setup**

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/product-listing-backend.git](https://github.com/SonalWelisara/E-Product.git)
    cd backend
    ```
2.  **Create a Python Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **PostgreSQL Database Setup:**
    * Ensure PostgreSQL is installed and running on your system.
    * Create a new database for this application (e.g., `ProductListingApp`).
    * Update the `SQLALCHEMY_DATABASE_URL` in `app/database.py` with your PostgreSQL credentials:
        ```python
        SQLALCHEMY_DATABASE_URL = "postgresql://user:password@host:port/ProductListingApp"
        ```
5.  **Run the Backend Server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend API will be accessible at `http://127.0.0.1:8000`.

### **2. Frontend Setup**

1.  **Clone the Repository:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install # or yarn install or pnpm install
    ```
3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev # or yarn dev or pnpm dev
    ```
    The frontend application will be accessible at `http://localhost:3000`.

---

## 📄 Brief API Documentation (Backend)

The API is built using FastAPI, which automatically generates interactive documentation available at `http://127.0.0.1:8000/docs` when the server is running.

### **Authentication Endpoints (`/auth`)**

* **`POST /auth/signup`**
    * **Description:** Registers a new user with a name, email, and password.
    * **Request Body:** `{"name": "string", "email": "user@example.com", "password": "securepassword"}`
    * **Response:** User details (id, name, email).
* **`POST /auth/login`**
    * **Description:** Authenticates a user and returns a JWT access token.
    * **Request Body:** `{"email": "user@example.com", "password": "securepassword"}`
    * **Response:** `{"access_token": "jwt_token_string", "token_type": "bearer"}`
* **`GET /auth/me`**
    * **Description:** Returns the current authenticated user's information.
    * **Authentication:** Requires a valid JWT in the `Authorization: Bearer <token>` header.
    * **Response:** User details (id, name, email).
* **`PUT /auth/me`**
    * **Description:** Updates the current authenticated user's name and/or password. Requires the current password for verification.
    * **Authentication:** Requires a valid JWT.
    * **Request Body:** `{"name": "New Name", "current_password": "old_password", "new_password": "new_secure_password"}` (all fields optional except `current_password`)
    * **Response:** Updated user details.

### **Product Endpoints (`/products`)**

* **`POST /products/`**
    * **Description:** Adds a new product.
    * **Authentication:** Requires a valid JWT.
    * **Request Body:** `multipart/form-data` containing `title`, `description`, `price`, and `image` (file).
    * **Response:** Created product details.
* **`GET /products/`**
    * **Description:** Retrieves a list of all products from all users.
    * **Authentication:** None (Public access).
    * **Response:** Array of product objects.
* **`GET /products/{id}`**
    * **Description:** Retrieves details for a single product by its ID.
    * **Authentication:** None (Public access).
    * **Response:** Single product object.
* **`PUT /products/{id}`**
    * **Description:** Updates an existing product. Only the product owner can update it.
    * **Authentication:** Requires a valid JWT.
    * **Request Body:** `multipart/form-data` containing `title`, `description`, `price`, and optionally `image` (file).
    * **Response:** Success message.
* **`DELETE /products/{id}`**
    * **Description:** Deletes a product. Only the product owner can delete it.
    * **Authentication:** Requires a valid JWT.
    * **Response:** Success message.

---

## 📦 Third-Party Packages (Frontend)

Here's a list of the main npm packages used in the frontend and why:

* **`react`**, **`react-dom`**: Core React libraries for building user interfaces.
* **`next`**: The React framework for production, enabling server-side rendering, static site generation, and routing.
* **`typescript`**: Adds static type checking to JavaScript, improving code quality and maintainability.
* **`tailwindcss`**: A utility-first CSS framework for rapidly building custom designs.
* **`lucide-react`**: A collection of beautiful, pixel-perfect icons for React applications.
* **`@radix-ui/react-dialog`**, **`@radix-ui/react-alert-dialog`**: Unstyled, accessible components for building dialogs and alerts, used for modals.
* **`@radix-ui/react-label`**: Accessible label primitive.
* **`@radix-ui/react-slot`**: Utility for composing components.
* **`class-variance-authority`**: Helps manage Tailwind CSS class variations for components (e.g., button styles).
* **`clsx`**: A tiny utility for constructing `className` strings conditionally.
* **`tailwind-merge`**: Merges Tailwind CSS classes without style conflicts.
* **`next-themes`**: For managing dark/light themes.
* **`use-debounce`**: A hook for debouncing values, useful for search inputs.
* **`zustand`**: A small, fast, and scalable bear-bones state-management solution. (Often used for global state like authentication context).

---

## 📦 Third-Party Packages (Backend)

Here's a list of the main Python packages used in the backend and why:

* **`fastapi`**: The web framework for building the API. Chosen for its high performance, ease of use, and automatic interactive API documentation.
* **`uvicorn[standard]`**: An ASGI server to run the FastAPI application. It's fast and supports asynchronous operations.
* **`SQLAlchemy`**: An Object Relational Mapper (ORM) for interacting with the PostgreSQL database. It allows defining database models as Python classes.
* **`psycopg2-binary`**: The PostgreSQL adapter for Python, enabling SQLAlchemy to connect to PostgreSQL.
* **`python-jose[cryptography]`**: Used for handling JWT (JSON Web Tokens) for user authentication, including encoding and decoding tokens.
* **`passlib[bcrypt]`**: Provides secure password hashing and verification functionalities using the bcrypt algorithm.
* **`python-multipart`**: Required by FastAPI to handle form data, especially for file uploads (e.g., product images).
* **`python-dotenv`**: (Often included with uvicorn standard) For loading environment variables from a `.env` file.
* **`starlette`**: FastAPI is built on Starlette, an ASGI framework.
* **`pydantic`**: Used for data validation and serialization/deserialization with type hints. It ensures that incoming request data conforms to defined schemas.
