# Ai_portfolio

Personal portfolio (Vite + React). App code lives in **`developer-portfolio/`**.

## Local run

```bash
cd developer-portfolio
npm install
npm run dev
```

Chat on `/play` needs **`GROQ_API_KEY`** in `.env` (see `developer-portfolio/.env.example`).  
Do **not** commit `.env` — it is gitignored.

## Deploy (go live) — Vercel

1. Push this repo to GitHub (see git commands below).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import **`lokVignesh14/Ai_portfolio`**.
3. **Root Directory**: set to **`developer-portfolio`** (important).
4. **Environment Variables**: add **`GROQ_API_KEY`** = your Groq key (same as local `.env`).
5. Deploy. Your site will get a URL like `https://ai-portfolio-xxx.vercel.app`.

## Build

```bash
cd developer-portfolio
npm run build
```

Output is in `developer-portfolio/dist/`.
