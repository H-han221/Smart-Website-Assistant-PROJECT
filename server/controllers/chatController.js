export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    // Here you call your RAG + AI backend logic
    res.json({ reply: `You said: ${message}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
