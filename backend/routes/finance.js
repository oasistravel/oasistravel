
const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');

router.get('/', async (req, res) => {
  const data = await Finance.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const f = new Finance(req.body);
  await f.save();
  res.json(f);
});

router.delete('/:id', async (req, res) => {
  await Finance.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
