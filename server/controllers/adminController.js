export const uploadDocument = async (req, res) => {
  try {
    // You can handle file upload with multer or other packages
    res.json({ message: "Document uploaded (dummy)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
