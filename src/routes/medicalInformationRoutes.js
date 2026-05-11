import express from 'express';
import { createMedicalInformation, queryMedicalInformation } from '../controllers/medicalInfoController.js';

const router = express.Router();

router.post('/', createMedicalInformation);
router.post('/query', queryMedicalInformation);

export default router;
