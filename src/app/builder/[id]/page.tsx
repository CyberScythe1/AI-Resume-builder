import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ResumeBuilderClient from './ResumeBuilderClient'

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()

    let initialResume = null
    let isExpired = false

    if (id !== 'new') {
        // Fetch the resume generically by ID (no user required)
        const { data: resume, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !resume) {
            redirect('/') // Handle not found by kicking back to home
        }

        // Check if 5 minutes have passed
        const createdAt = new Date(resume.created_at).getTime()
        const now = new Date().getTime()
        const diffMinutes = (now - createdAt) / (1000 * 60)

        if (diffMinutes > 5) {
            isExpired = true
            // We could optionally also delete it here from the DB
            await supabase.from('resumes').delete().eq('id', id)
            redirect('/?expired=true')
        }

        initialResume = resume
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Passing the resume down */}
            <ResumeBuilderClient initialResume={initialResume} resumeId={id} isExpired={isExpired} />
        </div>
    )
}
