import MedicalKnowledgeBase from '../models/medical-information.js';
import getEmbedding from '../services/huggingface/embedder.js'; 

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

export const queryMedicalInformation = async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    if (!query) return res.status(400).json({ message: "Query text is required." });

    // Get embedding for the query
    const queryEmbedding = await getEmbedding(query);

    // Perform vector search using MongoDB Atlas $vectorSearch
    const results = await MedicalKnowledgeBase.aggregate([
      {
        $vectorSearch: {
          index: "medical_kb_embedding_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: limit * 10, // Cast a wider net for better accuracy
          limit: limit,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $unset: "embedding"
      }
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No relevant medical information found." });
    }

    res.status(200).json({
      message: "Query processed successfully.",
      query,
      results,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ChatGPT Written
export const queryMedicalInformation = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query text is required." });
    }

    // 1) Convert the inquiry to a vector
    const queryEmbedding = await getEmbedding(query);

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      return res.status(500).json({ message: "Failed to generate query embedding." });
    }

    // 2) Semantic search against the vector index
    const results = await MedicalKnowledgeBase.aggregate([
      {
        $vectorSearch: {
          index: "medical_kb_embedding_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 1
        }
      },
      {
        $project: {
          _id: 1,
          content: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    const bestMatch = results[0] || null;

    return res.status(200).json({
      message: bestMatch
        ? "Best matching medical document found."
        : "No matching document found.",
      query,
      bestMatch
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error processing query.",
      error: error.message
    });
  }
};



Sample
export const queryMedicalInformation = async (req, res) => {
  try{
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query text is required." });

    // Get embedding for the query
    const queryEmbedding = await getEmbedding(query);

    // Perform semantic search in the database using the query embedding
    // This is a placeholder for the actual search logic, which would involve comparing the query embedding with stored embeddings in the database.
    // You would typically use a vector similarity search here (e.g., cosine similarity) to find relevant medical information based on the query embedding.
    
    res.status(200).json({ message: "Query processed successfully.", queryEmbedding });
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
}
*/