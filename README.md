# 🎁 Perx – Smart Coupon & Loyalty Platform for SMEs

Perx is a web-based platform that empowers small and medium-sized enterprises (SMEs) to create, distribute, and manage digital coupons. It offers consumers a seamless way to discover deals, earn loyalty points, and get rewarded for shopping at their favorite local stores.

🌐 **Live Site:**

* **Consumers:** [perx.vercel.app](https://perx.vercel.app/explore)
* **Merchants:** [perx.vercel.app/merchant](https://perx.vercel.app/merchant)

## 🚀 Features

### 🛒 For Consumers

* Browse coupons from verified partner merchants
* Purchase and redeem digital coupons
* Earn loyalty points by:

  * Purchasing coupons
  * Scanning receipts from partner stores
  * Referring new users
* Track your rank and rewards (e.g., Bronze I, Silver II, etc.)

### 🏪 For Merchants

* Register and manage business profiles
* Create and publish coupons
* Monitor coupon purchases and redemptions
* View analytics on consumer engagement

## 📐 Architecture

### Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Frontend         | Next.js (App Router)     |
| Backend          | Server Actions (Next.js) |
| Database         | Supabase (PostgreSQL)    |
| Auth             | Supabase Auth            |
| State Management | React + Context API      |
| Styling          | Tailwind CSS             |
| Image Handling   | Next.js Image            |
| Deployment       | Vercel                   |

### Folder Structure (Key)

```bash
/
├── public/              # Static assets
├── src/                 # Source code root
│   ├── app/             # App Router pages and layouts
│   │   ├── (consumer)/  # Consumer-facing routes
│   │   ├── merchant/    # Merchant dashboard routes
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   └── ...          # Other app-level files (layout, icons, etc.)
│   ├── actions/         # Server-side actions (form handlers, DB ops)
│   ├── components/      # Shared and modular UI components
│   │   ├── consumer/    # Consumer-specific components
│   │   ├── merchant/    # Merchant-specific components
│   │   ├── custom/      # Custom shared components
│   │   └── ui/          # Generic UI elements
│   ├── lib/             # External service clients, schemas, types
│   │   ├── hooks/       # Custom React hooks
│   ├── utils/           # Utility functions
│   │   └── supabase/    # Supabase client config
├── .env.local           # Environment variables (not committed)
├── tailwind.config.ts   # Tailwind CSS config
├── next.config.ts       # Next.js config
└── tsconfig.json        # TypeScript config
```

## 📦 Project Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/jrmellpaz/Perx.git
   cd Perx
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env.local` file** and set up environment variables (see `.env.example` if available)

4. **Run the development server**

   ```bash
   npm run dev
   ```

## 📌 Notes

* **Authentication:** Separate login flows for consumers and merchants via Supabase Auth.
* **Coupon Lifecycle:** Merchants create coupons → Consumers purchase → Redemption tracked via database.
* **Points & Ranks:** Earned through actions and tied to user progression.
* **Scalable Architecture:** Modular folder structure makes it easy to maintain and scale.

## 👥 Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/feature-name`)
5. Open a Pull Request

---

Crafted with ❤️ to support local businesses and make shopping more rewarding!
