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
      default: "Unknown Source",
      // required: true
    },
    page: {
      type: String,
      default: "Unknown Page",
      // required: true
    },
    topic: {
      type: String,
      default: "Unknown Topic", 
      // required: true
    },
    link: {
      type: String,
      default: "Unknown Link",
      // required: true
    }
  }
});

const MedicalKnowledgeBase = mongoose.model('MedicalKnowledgeBase', medicalKnowledgeBaseSchema);
export default MedicalKnowledgeBase;
