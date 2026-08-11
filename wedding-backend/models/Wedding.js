const mongoose = require('mongoose');

const WeddingSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  couple: {
    bride: { firstName: String, lastName: String, email: String, phone: String },
    groom: { firstName: String, lastName: String, email: String, phone: String }
  },
  eventInfo: {
    venueName: String,
    venueType: { type: String, default: 'Indoor' },
    venueAddress: String,
    hallName: String,
    date: String,
    session: { type: String, default: 'Morning' },
    startTime: String,
    endTime: String
  },
  budget: {
    totalBudget: { type: Number, default: 0 },
    categories: [{
      name: String,
      items: [{ name: String, cost: Number, payment: Number, balance: Number }]
    }]
  },
  guests: [{
    category: String,
    title: String,
    firstName: String,
    lastName: String,
    phone: String,
    rsvp: { type: String, default: 'Pending' }
  }],
  timeline: [{ day: String, startTime: String, endTime: String, event: String, coordinator: String }],
  tables: [{ id: String, name: String, capacity: Number, assignedGuests: [String] }],
  notes: [{
    type: { type: String, enum: ['Note', 'Checklist', 'Reminder', 'Invoice/Receipts'] },
    content: mongoose.Schema.Types.Mixed,
    color: String,
    isPinned: Boolean,
    createdAt: { type: Date, default: Date.now }
  }],
  contacts: [{ name: String, email: String, phone: String, type: String, notes: String }]
}, { timestamps: true });

// Remove the 'next' parameter entirely for synchronous calculations
WeddingSchema.pre('save', function() {
  if (this.budget && Array.isArray(this.budget.categories)) {
    this.budget.categories.forEach(category => {
      if (Array.isArray(category.items)) {
        category.items.forEach(item => {
          item.balance = (Number(item.cost) || 0) - (Number(item.payment) || 0);
        });
      }
    });
  }
});

module.exports = mongoose.model('Wedding', WeddingSchema);