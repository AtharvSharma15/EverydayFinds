# EverydayFinds — Full-Stack E-Commerce Store

A modern, warm & earthy D2C storefront for **EverydayFinds** — gadgets, home essentials
and jewellery for modern Indian homes. Built with **React + Tailwind**, **FastAPI**, and
**MongoDB**. Prices in ₹ (INR), with **UPI QR** and **WhatsApp** ordering.

## ✨ Features
- Editorial hero, trust badges, bestsellers, testimonials, newsletter
- 24-product catalog with category filters, sorting & live search
- Product quick-view with PIN delivery estimate & quantity selector
- Slide-over cart drawer with free-shipping progress bar & coupons (`EVERYDAY10`, `WELCOME50`)
- Checkout with **dynamic UPI QR code** (`9650858890@ybl`), UTR reference, **WhatsApp order**
  (`+91 9650858890`) and Cash on Delivery
- Order tracker with live status stepper (demo order `EF-89421`)
- MongoDB-backed products, cart, newsletter signups and orders

## 🧱 Tech Stack
- **Frontend:** React 18, Tailwind CSS, Framer Motion, lucide-react, qrcode.react
- **Backend:** FastAPI, Motor (async MongoDB), Pydantic
- **Database:** MongoDB

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
# edit .env → set MONGO_URL and DB_NAME
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
Products auto-seed on first startup.

### 2. Frontend
```bash
cd frontend
yarn install
# edit .env → REACT_APP_BACKEND_URL should point to your backend origin
yarn start
```
App runs on http://localhost:3000

## 🔧 Configuration
Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=everydayfinds
UPI_ID=9650858890@ybl
UPI_PAYEE_NAME=EverydayFinds
WHATSAPP_NUMBER=919650858890
```
Frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```
> All backend routes are prefixed with `/api`.

## 📡 Key API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/config` | Store config (UPI, WhatsApp, categories) |
| GET | `/api/products` | List products (`category`, `search`, `sort`) |
| GET | `/api/products/{id}` | Product detail |
| GET/POST/PUT/DELETE | `/api/cart/{cart_id}...` | Cart operations |
| POST | `/api/newsletter` | Newsletter signup |
| POST | `/api/orders` | Place order (upi / whatsapp / cod) |
| GET | `/api/orders/track?q=` | Track by order ID or phone |

Made with care in India. 🇮🇳
