
import {
    GoogleGenerativeAI
} from '@google/generative-ai'
import { NextResponse } from 'next/server';



export const runtime = "edge";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
}


const genAIClient = new GoogleGenerativeAI(GEMINI_API_KEY)

const model = genAIClient.getGenerativeModel({ model: "gemini-1.5-flash" });



export async function POST(req: Request) {
    const { text } = await req.json();
    const isValid = await isMusicPrompt(text);
    if (!isValid) {
        return NextResponse.json({
            error: "Input does not appear to be a sound-generation related prompt.",
        }, {
            status: 400,
            statusText: "Bad Request",
        });
    }
    const prompt = await wrapPrompt(text);

    const response = await model.generateContent({
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
    });

    if (!response) {
        console.error("No candidates found in Gemini model response.");
        return NextResponse.json({
            error: "No candidates found in Gemini model response."
        }, {
            status: 500,
            statusText: "Internal Server Error",
        });
    }

    const result = response.response.text();



    return NextResponse.json({
        enhancedPrompt: result,
    }, {
        status: 200,
        statusText: "OK",
    })
}

const wrapPrompt = async (prompt: string) => {
    const fullPrompt = `Given a user input describing music, rewrite it as a detailed, professional prompt for AI music generation. Maintain the style, genre, and intent while adding depth, mood, tempo, and instrumentation.
    
    **Examples:**
    - "a funky house with 80s hip hop vibes"
    - "a chill song with influences from lofi, chillstep, and downtempo"
    - "a catchy beat for a podcast intro"

    Ensure the output is **short but descriptive**.  
    **Return only the enhanced prompt, nothing else.**  
    
    - Input: "${prompt}"  
    - Output:`;

    return fullPrompt;
}

const isMusicPrompt = async (userText: string): Promise<boolean> => {
    const checkPrompt = `Determine whether the following text is a valid prompt for AI music or sound generation. 
The input should describe musical style, mood, genre, instruments, or audio intent.

Respond only with:
- "valid" → if it is suitable for AI music generation
- "invalid" → if it is not

Text: "${userText}"`;

    const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: checkPrompt }] }],
    });

    const reply = response.response.text().trim().toLowerCase();
    return reply.includes("valid");
}

