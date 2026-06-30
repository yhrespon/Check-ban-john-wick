import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ================= DIRNAME =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= STATIC FILES =================
app.use(express.static(__dirname));

// ================= HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= HEALTH CHECK =================
app.get("/ping", (req, res) => {
  res.json({ status: "OK", message: "Server running" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 10028;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
