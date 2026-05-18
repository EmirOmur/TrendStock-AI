# TrendStock AI — Setup Guide

## Prerequisites

Make sure the following are installed on your machine:

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | >= 18.x | `node --version` |
| npm | >= 9.x | `npm --version` |
| Git | any | `git --version` |
| Gemini API Key | — | [Get one at Google AI Studio](https://aistudio.google.com/app/apikey) |

---

## Step 1 — Get a Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in Step 3

---

## Step 2 — Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

Start the backend in development mode:

```bash
npm run dev
```

You should see:
```
🚀 TrendStock AI backend running on http://localhost:5000
📊 Mock data loaded: 6 products
🤖 Gemini model: gemini-2.0-flash
```

Test the API is working:
```bash
# In a new terminal
curl http://localhost:5000/api/products
curl http://localhost:5000/api/alerts
```

---

## Step 3 — Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

The default `frontend/.env` should contain:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Step 4 — Verify Everything Works

1. Backend is running at `http://localhost:5000`
2. Frontend is running at `http://localhost:5173`
3. You can see the dashboard with 6 products
4. Metric cards show correct counts
5. Clicking a product opens the analysis panel on the right
6. Clicking "Analyze with Gemini" returns a response (requires valid API key)

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start in production mode |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run preview` | Preview production build locally |

---

## Local Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Products endpoint | http://localhost:5000/api/products |
| Alerts endpoint | http://localhost:5000/api/alerts |
| AI endpoint | POST http://localhost:5000/api/ai/analyze-product |

---

## Common Issues

### `GEMINI_API_KEY` not set
```
Error: GEMINI_API_KEY is not set in environment variables
```
Solution: Make sure `backend/.env` exists and contains a valid key.

### CORS error in browser console
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS
```
Solution: Backend must be running before the frontend. Restart the backend.

### Port already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### Gemini returns non-JSON response
The `geminiService.js` includes a JSON cleanup step. If issues persist, check the Gemini API status or try a simpler prompt.

---

## Environment Variables Reference

### Backend (`backend/.env`)

```env
# Required: Your Google Gemini API key
GEMINI_API_KEY=AIza...

# Optional: Port for the Express server (default: 5000)
PORT=5000

# Optional: Node environment
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
# Required: Base URL for the backend API
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.
