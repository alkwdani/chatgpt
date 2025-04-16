# ChatGPT Web App with SQLite History (Deployable on Render)

This project is a simple web app that allows users to chat with ChatGPT and stores the chat history using SQLite.

## 🛠 Features

- Ask questions to ChatGPT (OpenAI API)
- Conversation history stored in SQLite
- Clear conversation history
- Fully deployable on [Render.com](https://render.com)

## 🚀 Deploy on Render

1. **Push this repo to GitHub** (do not commit `.env`)
2. Go to [Render.com](https://render.com)
3. Click **New > Web Service**
4. Connect your GitHub repo
5. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`
6. **Add environment variable**:
   - `OPENAI_API_KEY`: your OpenAI API key
7. Click **Deploy**

## 🧪 Local Development

```bash
npm install
node server.js
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧠 Tech Stack

- Node.js
- Express
- SQLite
- OpenAI API

---
⚠️ Do not commit `.env` with your API key to public repositories.
