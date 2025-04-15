import { GoogleGenerativeAI } from '@google/generative-ai'

export const summarize = async (text: string, minLength: number = 120, maxLength: number = 512) => {
    try {
        if (!text || text.trim() === '') return { error: 'Empty input text' }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return { error: 'GEMINI_API_KEY is not defined' };
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-1.5' });
        
        const prompt = `
        Summarize the following text in a clear and detailed paragraph, using approximately ${minLength} to ${maxLength} **words**. Focus on key points, main ideas, and insights. Do not copy the original text verbatim.

        ${text}
        `;


        const result = await model.generateContent(prompt);
        const summary = await result.response.text();

        return { summary: summary }

    } catch (error) {
        return { error: `Error summarizing text: ${error instanceof Error ? error?.message : "ERROR"}`}; 
    }
}  