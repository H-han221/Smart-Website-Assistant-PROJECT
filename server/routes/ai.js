const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({
      answer: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;
