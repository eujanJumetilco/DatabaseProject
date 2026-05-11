import mongoose from 'mongoose';

const medicalKnowledgeBaseSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  embedding: [{
    type: Number
  }],
  metadata: {
    source: {
      type: String,
      // required: true
    },
    page: {
      type: String,
      // required: true
    },
    topic: {
      type: String,
      // required: true
    },
    link: {
      type: String,
      // required: true
    }
  }
});

const MedicalKnowledgeBase = mongoose.model('MedicalKnowledgeBase', medicalKnowledgeBaseSchema);
export default MedicalKnowledgeBase;
