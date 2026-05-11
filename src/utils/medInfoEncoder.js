import MedicalKnowledgeBase from "../models/medical-information";
import { getEmbedding } from "../services/huggingface/embedder";


async function encodeMedicalInfo(content, metadata) {
    try {
        const embedding = await getEmbedding(content);

        const medicalInfo = new MedicalKnowledgeBase({
            content,
            embedding,
            metadata
        });

        const savedMedicalInfo = await medicalInfo.save();
    } catch (error) {
        console.error("Error encoding medical information:", error);
        throw error;
    }
}

export default encodeMedicalInfo;
// use this to encode an array of medical information objects into the database (within the medicalknowled gebase collection)