# Backend - Website Builder

## 📁 Structure

```
backend/
├── app/
│   ├── middlewares/      # Middlewares (auth, validation)
│   ├── models/           # Database queries (Prisma)
│   ├── prisma/           # Prisma schema & config
│   ├── routers/          # API routes
│   ├── schemas/          # Validation schemas (TypeBox)
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── main.ts               # Entry point
├── start.bat             # Windows setup script
├── start.sh              # Linux/Mac setup script
└── .env                  # Environment variables
```

## 🚀 Quick Start

```bash
npm run dev
```

## 🔧 Full Setup

### Windows

```bash
.\start.bat
```

### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

**This script will:**

- Pull latest git changes
- Install dependencies
- Sync database schema
- Generate Prisma client
- Start dev server

