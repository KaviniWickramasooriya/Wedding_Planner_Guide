const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wedding = require('../models/Wedding');

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

router.post('/register', async (req, res) => {
  const { name, email, password, initialEventType } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists' });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const firstEvent = new Wedding({
      userId: user.id,
      eventType: initialEventType || 'Wedding',
      budget: { totalBudget: 0, categories: fullDefaultBudgetCategories }
    });
    await firstEvent.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

const auth = require('../middleware/auth');
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;