Backend - Website Builder 
📁 Structure
backend/
├── app/
│   ├── middlewares/      # Middlewares (auth, validation)
│   ├── models/           # Database queries (Prisma)
│   ├── prisma/           # Prisma schema & config
│   ├── routers/          # API routes
│   ├── schemas/          # Validation schemas (TypeBox)
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── main.ts           # Entry point
│ 
├── script.bat            # Windows setup script
├── scrit.sh              # Linux/Mac setup script
└── .env                  # Environment variables
🚀 Quick Start
bashnpm run dev
🔧 Full Setup
Windows
bash.\start.bat
Linux/Mac
bashchmod +x scripts/start.sh
./start.sh
This script will:

Pull latest git changes
Install dependencies
Sync database schema
Generate Prisma client
Start dev server

