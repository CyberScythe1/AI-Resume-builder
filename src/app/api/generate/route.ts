import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Create an OpenAI compatible client pointing to OpenRouter
const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ResumeForge',
    }
})

export async function POST(req: Request) {
    try {
        // Extract the `prompt` from the body of the request
        const { prompt } = await req.json()

        // Ask OpenRouter for a streaming chat completion
        // Using an actively maintained free model to ensure stability
        const result = await streamText({
            model: openrouter('meta-llama/llama-3.3-70b-instruct:free'),
            system: 'You are an expert resume writer. Act as an assistant helping the user write a professional resume summary. Expand the brief points provided into a polished 2-3 sentence paragraph. Do NOT output any markdown, XML tags, conversational filler, or greetings like "here is your summary". ONLY output the finalized professional summary text.',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        })

        // Respond with the stream
        return result.toTextStreamResponse()
    } catch (error) {
        console.error("AI Generation Error:", error)
        return new Response('Error generating resume summary', { status: 500 })
    }
}
