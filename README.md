# 🛒 E-Commerce Demo (React + TypeScript)

This is a demo e-commerce web app built with React + TypeScript + React Query + Redux Toolkit using the DummyJSON fake API. [DummyJSON](https://dummyjson.com/).

## 🚀 Key Features

- 🔑 Login / Logout (auth/login from DummyJSON)
- 🧑‍💻 Store user info (Redux + localStorage)
- 🛍️ Shopping cart: add / remove / update quantity
- ✅ Select products for checkout
- 📦 Checkout Page:
  - Enter shipping info
  - Choose payment method (Credit Card / COD)
  - Form validation (zod + react-hook-form)
  - Simulate order → clear cart + update user info
- 🎉 Order Confirmation Page

## 🛠️ Technologies Used

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (validation)
- [TailwindCSS](https://tailwindcss.com/) (UI)
- [DummyJSON API](https://dummyjson.com/) (fake API)

## 📂 Project Structure

src/
├── components/ # Project components
├── hooks/ # Custom hooks (React Query)
│ └── actions/ # API hooks
├── interfaces/ # TypeScript interfaces
├── pages/ # Main pages (Cart, Checkout, Login, etc.)
├── features/ # Redux slices
├── redux/ # Redux store
├── utils/ # Utilities (token decoding)
├── App.tsx # App root
└── main.tsx # Entry point

## ⚡ Installation & Running

```bash
# 1. Clone project
git clone https://github.com/trungtin0175/ecommerce_test.git
cd ecommerce_test

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

Visit: http://localhost:5173

🔐 Login Demo

DummyJSON provides test login credentials:

Username: michaelw

Password: michaelwpass

Live Demo: https://ecommerce-test-kohl-six.vercel.app/

## ⚠️ Challenges and Considerations

### State Management & Cart Persistence
Keep cart state synchronized across Redux, React state, and sessionStorage to ensure a smooth user experience, even after page reloads.
Debounce cart quantity updates to avoid excessive API calls.

### API Error Handling
Handle API errors such as failures when adding/removing/updating cart items or updating user info.
Use react-hot-toast for real-time success/error notifications.

### Form Validation & Checkout Flow
Use zod + react-hook-form to validate input data, especially phone numbers, emails, and payment card info.
Consider optional fields like notes, city, or card details to avoid disrupting the checkout flow.

### Authentication & Token Management
Store userId and accessToken in localStorage to maintain session across page reloads.
Check token expiration to automatically logout or refresh data.

### Responsive Design
Ensure UI works well on both desktop and mobile, including forms, cart, and checkout components.

### Performance Considerations
Use React Query to cache API data and reduce unnecessary requests.
Debounce cart quantity changes to prevent spamming API calls.
```
