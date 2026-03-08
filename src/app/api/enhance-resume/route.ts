import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { resumeData } = await req.json();

        // Check if there's enough data
        const hasContent = (resumeData.personalInfo?.summary?.length > 5) ||
            (resumeData.experience?.length > 0) ||
            (resumeData.projects?.length > 0) ||
            (resumeData.education?.length > 0);

        if (!hasContent) {
            return Response.json({ error: "Please provide more details (experience, education, or summary) in your resume to enhance it." }, { status: 400 });
        }

        const result = await generateObject({
            model: openrouter('google/gemini-2.0-flash-lite-preview-02-05:free'),
            maxTokens: 4000,
            system: `You are an expert executive resume writer and career coach. Review the provided resume JSON.
Your goal is to enhance the grammar, professionalism, and impact of all text fields (summaries, job descriptions, project details).
- DO NOT invent fake experiences, jobs, or degrees.
- DO replace weak verbs with strong action verbs.
- DO rewrite bullet points to be more impactful and results-oriented.
- DO NOT change the names of companies, schools, dates, or the user's personal contact info.
Return the exactly structured JSON data reflecting these enhancements.`,
            schema: z.object({
                personalInfo: z.object({
                    fullName: z.string(),
                    email: z.string(),
                    phone: z.string(),
                    location: z.string(),
                    website: z.string(),
                    summary: z.string()
                }),
                experience: z.array(z.object({
                    title: z.string(),
                    company: z.string(),
                    date: z.string(),
                    description: z.string()
                })).optional().default([]),
                education: z.array(z.object({
                    degree: z.string(),
                    school: z.string(),
                    date: z.string(),
                    info: z.string()
                })).optional().default([]),
                projects: z.array(z.object({
                    name: z.string(),
                    link: z.string(),
                    description: z.string()
                })).optional().default([]),
                languages: z.array(z.object({
                    language: z.string(),
                    fluency: z.string()
                })).optional().default([]),
                skills: z.array(z.string()).optional().default([]),
                templateId: z.string().optional()
            }),
            prompt: `Enhance this resume data:\n\n${JSON.stringify(resumeData, null, 2)}`
        });

        return Response.json({ enhancedData: result.object });
    } catch (error) {
        console.error("Enhancement Error:", error);
        return Response.json({ error: "Failed to enhance resume. The AI provider might be experiencing high load." }, { status: 500 });
    }
}
