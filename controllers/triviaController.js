const User = require("../models/user");
const Question = require("../models/questions");
const OpenAI = require("openai");
require("dotenv").config();

// Inicializa el cliente de OpenAI (SDK v4)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const getQuestions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("questions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const questions = user.questions.map((q) => ({
      questionId: q.questionId,
      questionText: q.questionText,
      questionIsTrue: q.questionIsTrue,
    }));

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

const getQuestion = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Genera la pregunta con Chat Completion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a trivia question about "${category}". Provide 4 options labeled 1 to 4, one of them should be correct. Mark the correct option by appending "(correct)" at the end of that line.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(500).json({ message: "No content returned from OpenAI" });
    }

    const lines = text
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const questionText = lines.shift();
    if (lines.length !== 4) {
      console.warn("Unexpected number of options:", lines);
      return res.status(500).json({ message: "Invalid options generated by OpenAI" });
    }

    const options = lines.map((line) => {
      const is_correct = /\(correct\)$/.test(line);
      const raw = line.replace(/\s*\(correct\)\s*$/, "");
      const cleanText = raw.replace(/^\d+\.\s*/, "");
      return { text: cleanText, is_correct };
    });

    res.status(200).json({ questionText, options });
  } catch (error) {
    console.error("Error fetching question from OpenAI:", error);
    res.status(500).json({ message: "Error fetching question from OpenAI" });
  }
};

const saveQuestion = async (req, res) => {
  try {
    const { userId, questionText, questionIsTrue } = req.body;
    if (!userId || !questionText || questionIsTrue === undefined) {
      return res
        .status(400)
        .json({ message: "User ID, question text, and correctness flag are required" });
    }

    const newQuestion = new Question({
      questionId: Date.now().toString(),
      questionText,
      questionIsTrue,
    });
    await newQuestion.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.questions.push(newQuestion);
    await user.save();

    res.status(201).json({ message: "Question saved successfully", question: newQuestion });
  } catch (error) {
    console.error("Error saving question:", error);
    res.status(500).json({ message: "Error saving question" });
  }
};

const saveUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    console.log("Request body:", req.body);

    const newUser = new User({ name, questions: [] });
    await newUser.save();

    res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user" });
  }
};

module.exports = { getQuestions, getQuestion, saveQuestion, saveUser };
