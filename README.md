# Intelligent Bistro

Intelligent Bistro is an AI-powered fine-dining ordering experience: browse a curated menu, chat with a personal concierge that understands your tastes, and build your table in real time. The concierge recommends dishes, adds items to your cart from natural language, and remembers the conversation — all wrapped in a premium dark UI built for mobile and web.

## Setup

```bash
cd backend && npm install && cp .env.example .env
```

Add your OpenAI API key to `backend/.env`.

```bash
cd frontend && npm install
```

## Run

**Terminal 1** — API server:

```bash
cd backend && npm start
```

**Terminal 2** — Expo app:

```bash
cd frontend && npx expo start
```

## Stack

React Native, Expo Router, NativeWind, TypeScript, Node.js, Express, OpenAI
