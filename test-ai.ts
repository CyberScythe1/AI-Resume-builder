import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ResumeForge',
    }
})

async function main() {
    try {
        console.log("Starting stream...")
        const result = await streamText({
            model: openrouter('google/gemini-2.0-flash-lite-preview-02-05:free'),
            prompt: 'Hello world',
        })

        for await (const textPart of result.textStream) {
            process.stdout.write(textPart)
        }
        console.log("\nDone.")
    } catch (e) {
        console.error("SDK Error:", e)
    }
}
main()
