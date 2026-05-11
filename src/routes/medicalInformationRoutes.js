import express from 'express';
import { createMedicalInformation } from '../controllers/medicalInfoController.js';

const router = express.Router();

router.post('/', createMedicalInformation);

export default router;
