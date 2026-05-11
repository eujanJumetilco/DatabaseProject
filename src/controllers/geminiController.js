import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// 1. Tool Logic: Updated to hit your specific localhost endpoint
async function searchMedicalInfo(inquiry) {
    try {
        console.log(`--- Extracting and Querying DB for: ${inquiry} ---`);
        
        const response = await fetch("http://localhost:3000/api/medical-information/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Matches your requirement: body contains query: "Questions?"
            body: JSON.stringify({ query: inquiry }) 
        });

        if (!response.ok) {
            throw new Error(`Database API error: ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming your API returns an array of strings/objects
        return data; 
    } catch (err) {
        console.error("Fetch Error:", err.message);
        return "Error: Could not retrieve data from local database.";
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function getResponse(userInput) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // Fast and cost-effective for RAG
            tools: [{
                functionDeclarations: [{
                    name: "searchMedicalInfo",
                    description: "Retrieves dementia care documents and medical advice from the MongoDB database.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            inquiry: { 
                                type: "string", 
                                description: "The specific question or topic to search for in the medical database." 
                            }
                        },
                        required: ["inquiry"]
                    }
                }]
            }],
            systemInstruction: `
                You are the "DementiaSG" AI Care Assistant. 
                1. Always use 'searchMedicalInfo' for dementia inquiries to ensure accuracy.
                2. Use ONLY retrieved data to answer (Open-book policy).
                3. Tone: Compassionate, clear, and actionable.
                4. Match the user's manner (brief if they are brief, detailed if they are expressive).
                5. Emergency: If a life-threatening situation is mentioned, advise calling 995 (Singapore) immediately.
            `
        });

        const chat = model.startChat();
        
        // Phase 1: Send user input to the AI
        let result = await chat.sendMessage(userInput);
        let response = result.response;

        // Phase 2: Check if the AI wants to call your local tool
        const call = response.functionCalls()?.[0];
        if (call) {
            // Call your local API with the AI-extracted inquiry
            const toolData = await searchMedicalInfo(call.args.inquiry);

            // Phase 3: Feed the database results back to the AI for the final answer
            const finalResult = await chat.sendMessage([{
                functionResponse: {
                    name: "searchMedicalInfo",
                    response: { content: toolData }
                }
            }]);

            return finalResult.response.text();
        }

        return response.text();
    } catch (error) {
        console.error("System Error:", error.message);
        return "I'm sorry, I'm having trouble accessing my knowledge base right now.";
    }
}