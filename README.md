# Mohamed Nour Cherif — Portfolio

A premium personal portfolio with AI chat, WebGL visuals, admin analytics, and multilingual support.

## Stack

**Frontend:** React + Vite, Tailwind CSS v4, Framer Motion, Three.js, Recharts, i18next  
**Backend:** Vercel Serverless Functions, MongoDB, Resend, OpenAI/Claude  
**Auth:** JWT + bcrypt

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:
- `MONGODB_URI` — MongoDB connection string (free at [MongoDB Atlas](https://cloud.mongodb.com))
- `RESEND_API_KEY` — From [Resend](https://resend.com)
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` — For AI chatbot
- `JWT_SECRET` — Random string (64+ chars)
- `ADMIN_PASSWORD_HASH` — Generate with:
  ```bash
  node -e "require('bcryptjs').hash('your-password', 12).then(h => console.log(h))"
  ```

### 3. Run locally

```bash
npm run dev
```

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── _lib/               # Shared utilities
│   │   ├── auth.js         # JWT helpers
│   │   ├── mongodb.js      # Database connection
│   │   └── utils.js        # Rate limit, sanitization
│   ├── admin/              # Protected admin endpoints
│   │   ├── analytics.js    # Visitor analytics
│   │   ├── chat-logs.js    # Chat history
│   │   └── messages.js     # Contact messages
│   ├── auth/
│   │   └── login.js        # Admin login
│   ├── chat.js             # AI chatbot (streaming)
│   ├── send-email.js       # Contact form handler
│   └── track.js            # Visitor tracking
├── src/
│   ├── components/
│   │   ├── sections/       # Page sections
│   │   ├── ChatWidget.jsx  # Floating AI chat
│   │   ├── HeroGeometry.jsx# Three.js glass icosahedron
│   │   ├── IntroAnimation.jsx # Terminal boot sequence
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── WebGLBackground.jsx # GLSL gradient mesh
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── locales/            # EN + FR translations
│   ├── i18n.js
│   ├── index.css           # Tailwind + custom theme
│   ├── main.jsx
│   └── App.jsx
└── vercel.json
```

## Database Collections

- **visits** — Page views with hashed IP, device, country, referrer
- **messages** — Contact form submissions
- **chatLogs** — AI chat conversation logs

## Admin

Navigate to `/admin` and log in with your configured password.

Features: visitor analytics charts, contact messages, chat logs, JSON export.
