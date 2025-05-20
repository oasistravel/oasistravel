
const express = require('express');
const router = express.Router();
const HR = require('../models/HR');

router.get('/', async (req, res) => {
  const data = await HR.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const record = new HR(req.body);
  await record.save();
  res.json(record);
});

module.exports = router;
