import mongoose from 'mongoose';
import 'dotenv/config';

import Contact from '../models/contact.js';
import MedicalKnowledgeBase from '../models/medical-information.js';

import { getEmbedding } from '../services/huggingface/embedder.js';

const dementiaCareParagraphs = [
  "Caring for a person with dementia requires patience, empathy, and consistency. People living with dementia may experience memory loss, confusion, and difficulty communicating, so maintaining a calm and reassuring environment can help reduce stress and anxiety. Caregivers should speak clearly, use simple instructions, and allow extra time for responses during conversations.",

  "Establishing daily routines is important for individuals with dementia because predictable schedules can provide comfort and reduce confusion. Regular times for meals, medication, bathing, and sleep help create structure and familiarity. Visual reminders such as calendars, labels, and clocks may also support independence and orientation.",

  "Safety is a major consideration when caring for someone with dementia. Homes should be adapted to reduce risks by removing tripping hazards, securing dangerous items like medications and cleaning supplies, and installing locks or alarms if wandering is a concern. Adequate lighting and clear pathways can also help prevent falls and accidents.",

  "Good nutrition and hydration play a key role in maintaining health for people with dementia. Some individuals may forget to eat or drink, while others may struggle with using utensils or recognizing food. Offering simple meals, finger foods, and regular reminders to drink water can support their physical well-being.",

  "Emotional support is just as important as physical care. People with dementia may feel frustrated, fearful, or isolated as their condition progresses. Engaging them in meaningful activities such as listening to music, looking at family photos, gardening, or light exercise can improve mood and encourage social connection.",

  "Caregivers should also pay attention to their own health and well-being. Providing dementia care can be emotionally and physically demanding, making it essential for caregivers to seek support from family members, community resources, or support groups. Taking breaks, maintaining healthy habits, and asking for help when needed can reduce caregiver burnout.",

  "Communication challenges are common in dementia care, especially in later stages of the condition. Nonverbal communication such as eye contact, gentle gestures, and facial expressions can help convey reassurance and understanding. Avoid arguing or correcting the person excessively, as this may increase distress or agitation.",

  "As dementia progresses, individuals may require increasing assistance with personal care activities such as dressing, bathing, and mobility. Encouraging independence whenever possible while providing respectful support helps preserve dignity and self-esteem. Adaptive clothing and assistive devices can make daily tasks easier for both caregivers and patients.",

  "Behavioral changes such as agitation, wandering, or sleep disturbances are common in dementia. Identifying triggers like noise, discomfort, hunger, or unfamiliar environments can help caregivers manage these behaviors more effectively. Responding calmly and redirecting attention to comforting activities is often more helpful than confrontation.",

  "Planning for future care is an important part of supporting someone with dementia. Families may need to discuss legal, financial, and medical decisions early while the individual can still participate in conversations. Advance care planning and regular communication with healthcare professionals can help ensure that the person's wishes and needs are respected throughout the progression of the disease."
];

const contacts = [
  {
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@example.com",
    phone: "+639171112233",
    contactType: "Family Member",
    previousInteractions: [
      "Asked about managing nighttime confusion and wandering in her father with dementia.",
      "Requested advice on creating a safe home environment for an elderly parent with memory loss.",
      "Inquired about support groups for family caregivers caring for someone with Alzheimer's disease."
    ]
  },
  {
    firstName: "James",
    lastName: "Walker",
    email: "james.walker@example.com",
    phone: "+12025550121",
    contactType: "Caretaker",
    previousInteractions: [
      "Asked for strategies to calm agitation during bathing routines.",
      "Requested guidance on communicating with nonverbal dementia patients.",
      "Discussed concerns about aggressive behavior during evening hours."
    ]
  },
  {
    firstName: "Angela",
    lastName: "Reyes",
    email: "angela.reyes@example.com",
    phone: "+639189998877",
    contactType: "Family Member",
    previousInteractions: [
      "Asked about meal preparation for a grandmother with late-stage dementia.",
      "Requested tips for encouraging hydration and regular eating habits.",
      "Inquired about signs that indicate dementia progression."
    ]
  },
  {
    firstName: "Daniel",
    lastName: "Morris",
    email: "daniel.morris@example.com",
    phone: "+447700900123",
    contactType: "Caretaker",
    previousInteractions: [
      "Requested recommendations for activities that improve memory stimulation.",
      "Asked how to handle repetitive questioning without causing distress.",
      "Discussed techniques for reducing anxiety during doctor appointments."
    ]
  },
  {
    firstName: "Sofia",
    lastName: "Garcia",
    email: "sofia.garcia@example.com",
    phone: "+34600111222",
    contactType: "Family Member",
    previousInteractions: [
      "Asked about helping her mother remember medication schedules.",
      "Requested advice on handling emotional outbursts related to confusion.",
      "Inquired about dementia-friendly daily routines."
    ]
  },
  {
    firstName: "Liam",
    lastName: "Brooks",
    email: "liam.brooks@example.com",
    phone: "+16135551234",
    contactType: "Caretaker",
    previousInteractions: [
      "Asked how to safely assist dementia patients with mobility issues.",
      "Requested information on preventing falls inside the home.",
      "Discussed sleep disturbances and nighttime restlessness in dementia care."
    ]
  },
  {
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    phone: "+919876543210",
    contactType: "Family Member",
    previousInteractions: [
      "Asked about coping with caregiver stress while caring for her grandfather.",
      "Requested respite care recommendations for dementia caregivers.",
      "Inquired about legal planning and healthcare directives for dementia patients."
    ]
  },
  {
    firstName: "Ethan",
    lastName: "Coleman",
    email: "ethan.coleman@example.com",
    phone: "+14165557890",
    contactType: "Caretaker",
    previousInteractions: [
      "Requested techniques for redirecting wandering behavior.",
      "Asked about sensory activities that help reduce agitation.",
      "Discussed maintaining dignity while assisting with personal hygiene."
    ]
  },
  {
    firstName: "Hannah",
    lastName: "Lee",
    email: "hannah.lee@example.com",
    phone: "+6581234567",
    contactType: "Family Member",
    previousInteractions: [
      "Asked for advice on managing hallucinations experienced by her father.",
      "Requested information about dementia progression and end-of-life care.",
      "Discussed balancing work responsibilities with caregiving duties."
    ]
  },
  {
    firstName: "Carlos",
    lastName: "Mendez",
    email: "carlos.mendez@example.com",
    phone: "+5215512345678",
    contactType: "Caretaker",
    previousInteractions: [
      "Asked about building trust with newly diagnosed dementia patients.",
      "Requested strategies for reducing confusion during transportation.",
      "Inquired about music therapy and calming activities for dementia care."
    ]
  }
];

export async function insertContacts(contactsArray) {
  try {
    const insertedContacts = await Contact.insertMany(contactsArray);
    console.log(`Inserted ${insertedContacts.length} contacts`);
  } catch (error) {
    console.error('Error inserting contacts:', error);
    await mongoose.disconnect();
  }
}

export async function insertMedicalInfo(infoArray) {
  try {
    // takes an input of array of strings
    const medInfoArray = [];

    for (const content of infoArray) {
        const embedding = await getEmbedding(content);
        
        const medInfoObject = {
            content,
            embedding
        }

        medInfoArray.push(medInfoObject);
    }

    const insertedMedical = await MedicalKnowledgeBase.insertMany(medInfoArray);
    console.log(`Inserted ${insertedMedical.length} medical information entries`);

  } catch (error) {
    console.error('Error inserting medical information:', error);
    await mongoose.disconnect();
  }
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    await insertContacts(contacts);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

main();