const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// Get all partners
router.get('/', async (req, res) => {
  const partners = await Partner.find();
  res.json(partners);
});

// Add new partner
router.post('/', async (req, res) => {
  const newPartner = new Partner(req.body);
  await newPartner.save();
  res.json({ message: 'Partner added', partner: newPartner });
});

module.exports = router;