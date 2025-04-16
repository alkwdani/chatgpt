require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Setup SQLite database
const db = new sqlite3.Database('./chat_history.db');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, content TEXT)");
});

app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    db.run("INSERT INTO messages (role, content) VALUES (?, ?)", ['user', message]);

    db.all("SELECT role, content FROM messages ORDER BY id ASC", async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const chatHistory = rows.map(row => ({ role: row.role, content: row.content }));

      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatHistory
      });

      const reply = chatCompletion.choices[0].message.content;

      db.run("INSERT INTO messages (role, content) VALUES (?, ?)", ['assistant', reply]);

      chatHistory.push({ role: 'assistant', content: reply });
      res.json({ reply, history: chatHistory });
    });

  } catch (error) {
    console.error(error);
    if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please check your OpenAI billing or usage limits.' });
    } else {
      res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
  }
});

app.post('/clear', (req, res) => {
  db.run("DELETE FROM messages", (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to clear history' });
    }
    res.json({ message: 'History cleared' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
