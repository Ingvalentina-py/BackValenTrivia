const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const triviaRoutes = require("./routes/triviaRoutes");

console.log("API KEY:", process.env.OPENAI_API_KEY);

dotenv.config();
const app = express();


app.use(cors({
  origin: 'https://front-valen-trivia.vercel.app/'
}));
app.use(express.json());
app.use("/", triviaRoutes);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado a MongoDB"))
  .then(() => app.listen(5000, () => console.log("Servidor en http://localhost:5000")))
  .catch(err => console.error(err));
