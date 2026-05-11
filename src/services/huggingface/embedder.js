// This maps sentences & paragraphs to a 384 dimensional dense vector space to be used for storing meanings and performing semantic search.
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

async function getEmbedding(inputText) {
    if (!inputText) throw new Error("Input text is required for embedding.");

    const embedding = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: inputText,
        provider: "hf-inference",
    });

    // console.log(embedding);
    return embedding;
}

export default getEmbedding;