import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  contactType: {
    type: String,
    required: true
  },
  previousInteractions: [{
    type: String
  }]
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;