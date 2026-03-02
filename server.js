const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// Part 1 "database" (in-memory array) — at least 5 items
const bosses = [
  {
    id: 1,
    name: "Broken Vessel",
    title: "Tragic Warrior",
    image: "https://picsum.photos/400/250?random=1",
    location: "Ancient Basin",
    difficulty: "Hard",
    description: "A fallen vessel consumed by infection.",
  },

  {
    id: 2,
    name: "Crystal Guardian",
    title: "Living Crystal",
    image: "https://picsum.photos/400/250?random=2",
    location: "Crystal Peak",
    difficulty: "Medium",
    description: "A protective figure formed from living crystal.",
  },

  {
    id: 3,
    name: "Mantis Lords",
    title: "Tribal Leaders",
    image: "https://picsum.photos/400/250?random=3",
    location: "Mantis Village",
    difficulty: "Hard",
    description: "Swift, disciplined leaders of the Mantis Tribe.",
  },

  {
    id: 4,
    name: "False Knight",
    title: "Armored Trick",
    image: "https://picsum.photos/400/250?random=4",
    location: "Forgotten Crossroads",
    difficulty: "Easy",
    description: "A heavy suit of armor controlled by a small creature.",
  },

  {
    id: 5,
    name: "Hornet",
    title: "Protector",
    image: "https://picsum.photos/400/250?random=5",
    location: "Greenpath",
    difficulty: "Medium",
    description: "Fast and clever protector of Hallownest.",
  },
];

// helper to send an html file
function sendView(res, fileName) {
  res.sendFile(path.join(__dirname, "views", fileName));
}

//  LIST PAGE
app.get("/", (req, res) => sendView(res, "bosses.html"));
app.get("/bosses", (req, res) => sendView(res, "bosses.html"));

//  DETAIL PAGE (unique endpoint like /bosses/2)
app.get("/bosses/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const boss = bosses.find((b) => b.id === id);
  if (!boss) return next(); // triggers 404
  sendView(res, "boss.html");
});

//  API: list
app.get("/api/bosses", (req, res) => {
  res.json(bosses);
});

// API: detail
app.get("/api/bosses/:id", (req, res) => {
  const id = Number(req.params.id);
  const boss = bosses.find((b) => b.id === id);
  if (!boss) return res.status(404).json({ error: "Boss not found" });
  res.json(boss);
});

//  404 PAGE (must be last)
app.use((req, res) => {
  res.status(404);
  sendView(res, "404.html");
});

app.listen(PORT, () => {
  console.log(` Server running: http://localhost:${PORT}`);
});
