import MedicalKnowledgeBase from '../models/medical-information.js';

export const createMedicalInformation = async (req, res) => {
  try {
    const medicalJson = JSON.parse(JSON.stringify(req.body));
    const medicalInfo = new MedicalKnowledgeBase(medicalJson);
    const savedMedicalInfo = await medicalInfo.save();

    res.status(201).json(savedMedicalInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
