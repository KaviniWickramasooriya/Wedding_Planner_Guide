const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wedding = require('../models/Wedding');

router.use(auth);

const defaultBudgetTemplate = [
  { name: 'Reception Hall', items: [] },
  { name: 'Photography', items: [] },
  { name: 'Wedding Cakes', items: [] }
];

router.get('/data', async (req, res) => {
  try {
    let data = await Wedding.findOne({ userId: req.user.id });
    
    if (!data) {
      data = new Wedding({ 
        userId: req.user.id,
        budget: { totalBudget: 0, categories: defaultBudgetTemplate }
      });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    console.error("Fetch Data Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/update', async (req, res) => {
  try {
    const updated = await Wedding.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { returnDocument: 'after', runValidators: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update Data Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/notes', async (req, res) => {
  try {
    const wedding = await Wedding.findOne({ userId: req.user.id });
    wedding.notes.push(req.body);
    await wedding.save();
    res.json(wedding.notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;