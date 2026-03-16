const express = require("express");
const path = require("path");
const pool = require("./config/db");
require("dotenv").config();

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("PORT value:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// helper to send an html file
function sendView(res, fileName) {
  res.sendFile(path.join(__dirname, "views", fileName));
}

// LIST PAGE
app.get("/", (req, res) => sendView(res, "bosses.html"));
app.get("/bosses", (req, res) => sendView(res, "bosses.html"));

// DETAIL PAGE
app.get("/bosses/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query("SELECT * FROM bosses WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return next();
    }

    sendView(res, "boss.html");
  } catch (error) {
    console.error("Error loading boss page:", error);
    res.status(500).send("Server error");
  }
});

// API: list
app.get("/api/bosses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bosses ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bosses:", error);
    res.status(500).json({ error: "Failed to fetch bosses" });
  }
});

// API: detail
app.get("/api/bosses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query("SELECT * FROM bosses WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Boss not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching boss:", error);
    res.status(500).json({ error: "Failed to fetch boss" });
  }
});

// 404 PAGE
app.use((req, res) => {
  res.status(404);
  sendView(res, "404.html");
});

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Database connected successfully:", result.rows[0]);
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
