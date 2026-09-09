const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wedding = require('../models/Wedding');

(async () => {
  try {
    await Wedding.collection.dropIndex('userId_1');
  } catch (e) {}
})();

const fullDefaultBudgetCategories = [
  {
    name: "Plate Costs",
    isPlateCost: true,
    items: [
      { name: "Full Plate Cost", cost: 0, payment: 0, balance: 0 },
      { name: "Half Plate Cost", cost: 0, payment: 0, balance: 0 }
    ]
  },
  { name: "Reception Hall", items: [
    { name: "Reception Hall", cost: 0, payment: 0, balance: 0 },
    { name: "Beverages handling fees", cost: 0, payment: 0, balance: 0 },
    { name: "Other location charges", cost: 0, payment: 0, balance: 0 },
    { name: "Seat covers/ Chairs", cost: 0, payment: 0, balance: 0 },
    { name: "Tax & Service charges", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Wedding registration", items: [
    { name: "Registrar Fee", cost: 0, payment: 0, balance: 0 },
    { name: "Marriage Registration Fee", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Beauty Salon", items: [
    { name: "Prewedding Pampering", cost: 0, payment: 0, balance: 0 },
    { name: "Bride's Hair and makeup", cost: 0, payment: 0, balance: 0 },
    { name: "Bride's Dressing", cost: 0, payment: 0, balance: 0 },
    { name: "Bridesmaids'", cost: 0, payment: 0, balance: 0 },
    { name: "Flower Girls'", cost: 0, payment: 0, balance: 0 },
    { name: "Groom's Hair and makeup", cost: 0, payment: 0, balance: 0 },
    { name: "Groom's Dressing", cost: 0, payment: 0, balance: 0 },
    { name: "Groomsmen's", cost: 0, payment: 0, balance: 0 },
    { name: "Flower Boys'", cost: 0, payment: 0, balance: 0 },
    { name: "Bride's Going away", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Cultural Requirements", items: [
    { name: "Astrologer", cost: 0, payment: 0, balance: 0 },
    { name: "Ashtaka and Jayamangala gatha", cost: 0, payment: 0, balance: 0 },
    { name: "Shashrika table", cost: 0, payment: 0, balance: 0 },
    { name: "Traditional Dancing Group", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Photography", items: [
    { name: "Pre-shoot", cost: 0, payment: 0, balance: 0 },
    { name: "Wedding shoot", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Wedding Shoes", items: [
    { name: "Bride's, Bridesmaids', Flower Girls', Groom, Groomsmen, Flower Boys', Bride's Going away, Groom's Going away", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Flowers Bouquets", items: [
    { name: "Bride's Bouquets", cost: 0, payment: 0, balance: 0 },
    { name: "Bridesmaids' Bouquets", cost: 0, payment: 0, balance: 0 },
    { name: "Flower Girls Flowers", cost: 0, payment: 0, balance: 0 },
    { name: "Groomsmen Boutonnieres, Groom's Boutonnieres", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Wedding Decoration", items: [
    { name: "Wedding Decoration", cost: 0, payment: 0, balance: 0 },
    { name: "Reception Hall Decor", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Entertainment", items: [
    { name: "Band", cost: 0, payment: 0, balance: 0 },
    { name: "Master of Ceremony (MC)", cost: 0, payment: 0, balance: 0 },
    { name: "Dancing Group", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Jewelry", items: [
    { name: "Bride's Ring, Bride's necklace", cost: 0, payment: 0, balance: 0 },
    { name: "Groom's Ring, Brother's Ring (Gift)", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Stationary", items: [
    { name: "Invitation cards", cost: 0, payment: 0, balance: 0 },
    { name: "Wedding cake boxes, Other printing elements", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Wedding cakes", items: [
    { name: "Wedding cake", cost: 0, payment: 0, balance: 0 },
    { name: "Wedding cake pieces", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Transportation", items: [
    { name: "Wedding Car", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Foods and beverages", items: [
    { name: "Catering service", cost: 0, payment: 0, balance: 0 },
    { name: "Liquor", cost: 0, payment: 0, balance: 0 },
    { name: "Soft drinks, Bites", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Gifts", items: [
    { name: "Bride's Mother", cost: 0, payment: 0, balance: 0 },
    { name: "Bride's Father", cost: 0, payment: 0, balance: 0 },
    { name: "Bride's Uncle", cost: 0, payment: 0, balance: 0 },
    { name: "Groom's Mother", cost: 0, payment: 0, balance: 0 },
    { name: "Groom's Father, Groom's Uncle", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Rental Items", items: [
    { name: "Marquees and Lightings", cost: 0, payment: 0, balance: 0 },
    { name: "Table Numbers", cost: 0, payment: 0, balance: 0 },
    { name: "Table Clothes", cost: 0, payment: 0, balance: 0 },
    { name: "Show Plates", cost: 0, payment: 0, balance: 0 },
    { name: "Cutleries", cost: 0, payment: 0, balance: 0 },
    { name: "Chairs, Guest Book", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Honey-moon", items: [
    { name: "Shopping.", cost: 0, payment: 0, balance: 0 },
    { name: "Transportation.", cost: 0, payment: 0, balance: 0 },
    { name: "Foods and drinks.", cost: 0, payment: 0, balance: 0 },
    { name: "Activities and tickets., Hotels & Resorts", cost: 0, payment: 0, balance: 0 }
  ]},
  { name: "Other", items: [] }
];

// Protect all API routes below this middleware
router.use(auth);

router.get('/events', async (req, res) => {
  try {
    let events = await Wedding.find({ userId: req.user.id });
    
    for (let event of events) {
      if (!event.budget || !event.budget.categories || event.budget.categories.length < fullDefaultBudgetCategories.length) {
        const existingCatNames = new Set((event.budget?.categories || []).map(c => c.name));
        const missingCategories = fullDefaultBudgetCategories.filter(c => !existingCatNames.has(c.name));
        
        if (missingCategories.length > 0) {
          if (!event.budget) event.budget = { totalBudget: 0, categories: [] };
          event.budget.categories.push(...missingCategories);
          await event.save();
        }
      }
    }

    if (events.length === 0) {
      const defaultEvent = new Wedding({
        userId: req.user.id,
        eventType: 'Wedding',
        budget: { totalBudget: 0, categories: fullDefaultBudgetCategories }
      });
      await defaultEvent.save();
      events = [defaultEvent];
    }
    res.json(events);
  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { eventType } = req.body;
    const newEvent = new Wedding({
      userId: req.user.id,
      eventType: eventType || 'Birthday',
      budget: { totalBudget: 0, categories: fullDefaultBudgetCategories }
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await Wedding.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Wedding.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update Data Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/notes/:id', async (req, res) => {
  try {
    const event = await Wedding.findOne({ _id: req.params.id, userId: req.user.id });
    event.notes.push(req.body);
    await event.save();
    res.json(event.notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;