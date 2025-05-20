const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

// Get all branches
router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

// Add new branch
router.post('/', async (req, res) => {
  const newBranch = new Branch(req.body);
  await newBranch.save();
  res.json({ message: 'Branch added', branch: newBranch });
});

module.exports = router;