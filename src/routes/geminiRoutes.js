import express from 'express';
import { getResponse } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { input } = req.body;

    const response = await getResponse(input);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;