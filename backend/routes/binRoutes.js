// routes/binRoutes.js
const express = require('express');
const {
  createBin,
  getAllBins,
  getBinById,
  updateBin,
  deleteBin,
} = require('../controllers/binController');

const router = express.Router();

router.post('/', createBin);
router.get('/', getAllBins);
router.get('/:id', getBinById);
router.put('/:id', updateBin);
router.delete('/:id', deleteBin);

module.exports = router;