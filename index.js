const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const triviaRoutes = require("./routes/triviaRoutes");

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://front-valen-trivia.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use("/", triviaRoutes);

// 🔁 No usar app.listen() en Vercel
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error(err));

module.exports = app; // ✅ Necesario para Vercel
