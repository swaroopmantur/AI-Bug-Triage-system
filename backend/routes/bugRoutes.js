const express = require("express");
const Bug = require("../Bug");
const { analyzeBug } = require("../geminiService");

const router = express.Router();
router.post("/", async (req, res) => {
    const bug = new Bug(req.body);

    await bug.save();

    res.json(bug);
});
router.get("/", async (req, res) => {
    const bugs = await Bug.find();

    res.json(bugs);
});

router.put("/:id", async (req, res) => {
    try {
        const updatedBug = await Bug.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.json(updatedBug);
    } catch (error) {
        res.status(500).json({ message: "Failed to update bug" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedBug = await Bug.findByIdAndDelete(req.params.id);

        if (!deletedBug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.json({ message: "Bug deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete bug" });
    }
});
router.post("/analyze", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const analysis = await analyzeBug(title, description);

    res.json(analysis);
  } catch (error) {
    console.error("Gemini analysis failed:", error.message);

    res.status(500).json({
      message: "Failed to analyze bug",
    });
  }
});

module.exports = router;

