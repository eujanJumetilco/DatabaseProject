import Contact from '../models/contact.js';

export const createContact = async (req, res) => {
  try {
    const contactJson = JSON.parse(JSON.stringify(req.body));
    const contact = new Contact(contactJson);
    const savedContact = await contact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};