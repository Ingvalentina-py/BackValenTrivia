const express = require("express");
const { getQuestions, getQuestion, saveQuestion, saveUser } = require("../controllers/triviaController");

const router = express.Router();

router.get("/get-question", getQuestion);
router.get("/get-questions", getQuestions);
router.post("/save-question", saveQuestion);
router.post("/save-user", saveUser);

module.exports = router;
