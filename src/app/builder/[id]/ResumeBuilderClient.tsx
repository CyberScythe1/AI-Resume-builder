'use client'

import { useState, useEffect, useRef } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'

export default function ResumeBuilderClient({
    initialResume,
    resumeId,
    isExpired
}: {
    initialResume: any,
    resumeId: string,
    isExpired?: boolean
}) {
    const router = useRouter()
    const supabase = createClient()
    const [isSaving, setIsSaving] = useState(false)
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [timeLeft, setTimeLeft] = useState<number>(300)

    const [resumeData, setResumeData] = useState(
        initialResume?.content || {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                summary: ''
            },
            experience: [],
            education: [],
            skills: []
        }
    )

    const [title, setTitle] = useState(initialResume?.title || 'Untitled Resume')

    // Countdown logic
    useEffect(() => {
        if (resumeId !== 'new') {
            const initialCreatedAt = initialResume?.created_at ? new Date(initialResume.created_at).getTime() : Date.now()
            const interval = setInterval(() => {
                const now = Date.now()
                const diff = Math.floor((initialCreatedAt + 5 * 60 * 1000 - now) / 1000)
                if (diff <= 0) {
                    clearInterval(interval)
                    router.push('/?expired=true')
                } else {
                    setTimeLeft(diff)
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [resumeId, initialResume, router])

    // Auto-save logic
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(async () => {
            setIsSaving(true)

            try {
                if (resumeId === 'new') {
                    const newId = uuidv4()
                    const { error } = await supabase.from('resumes').insert({
                        id: newId,
                        title: title,
                        content: resumeData
                    })
                    if (!error) {
                        router.replace(`/builder/${newId}`)
                    }
                } else {
                    await supabase.from('resumes').update({
                        title: title,
                        content: resumeData,
                        updated_at: new Date().toISOString()
                    }).eq('id', resumeId)
                }
            } catch (err) {
                console.error("Failed to save", err)
            } finally {
                setIsSaving(false)
            }
        }, 1500) // 1.5 sec debounce

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
        }
    }, [resumeData, title])
    // Array item handlers
    const handleAddExperience = () => {
        setResumeData((prev: any) => ({
            ...prev,
            experience: [...prev.experience, { title: '', company: '', date: '', description: '' }]
        }))
    }

    const handleUpdateExperience = (index: number, field: string, value: string) => {
        const newExp = [...resumeData.experience]
        newExp[index][field] = value
        setResumeData({ ...resumeData, experience: newExp })
    }

    const handleRemoveExperience = (index: number) => {
        const newExp = [...resumeData.experience]
        newExp.splice(index, 1)
        setResumeData({ ...resumeData, experience: newExp })
    }

    const handleAddEducation = () => {
        setResumeData((prev: any) => ({
            ...prev,
            education: [...prev.education, { degree: '', school: '', date: '', info: '' }]
        }))
    }

    const handleUpdateEducation = (index: number, field: string, value: string) => {
        const newEdu = [...resumeData.education]
        newEdu[index][field] = value
        setResumeData({ ...resumeData, education: newEdu })
    }

    const handleRemoveEducation = (index: number) => {
        const newEdu = [...resumeData.education]
        newEdu.splice(index, 1)
        setResumeData({ ...resumeData, education: newEdu })
    }

    const handleAddSkill = () => {
        setResumeData((prev: any) => ({
            ...prev,
            skills: [...prev.skills, '']
        }))
    }

    const handleUpdateSkill = (index: number, value: string) => {
        const newSkills = [...resumeData.skills]
        newSkills[index] = value
        setResumeData({ ...resumeData, skills: newSkills })
    }

    const handleRemoveSkill = (index: number) => {
        const newSkills = [...resumeData.skills]
        newSkills.splice(index, 1)
        setResumeData({ ...resumeData, skills: newSkills })
    }

    const handleDownloadPDF = useReactToPrint({
        contentRef: contentRef,
        documentTitle: title || 'Resume',
    })

    const { completion, complete, isLoading } = useCompletion({
        api: '/api/generate',
        onFinish: (prompt: string, result: string) => {
            setResumeData((prev: any) => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    summary: result
                }
            }))
        }
    })

    // Update summary live as it streams in
    useEffect(() => {
        if (completion) {
            setResumeData((prev: any) => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    summary: completion
                }
            }))
        }
    }, [completion])

    return (
        <div className="flex w-full overflow-hidden text-black">
            {/* Form Section (Left Side) */}
            <div className="w-1/2 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
                <header className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-center">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-1/2 bg-transparent text-2xl font-bold text-gray-900 focus:outline-none"
                        placeholder="Resume Title"
                    />
                    <div className="flex flex-col items-end">
                        {resumeId !== 'new' && (
                            <div className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-1 border border-red-200 shadow-sm transition-all hover:bg-red-100">
                                Self-destructs in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                        <span className="text-xs text-gray-400 font-medium">
                            {isSaving ? 'Saving...' : 'All changes saved.'}
                        </span>
                    </div>
                </header>

                <section className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Personal Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="rounded-md border p-2 col-span-2 shadow-sm"
                                placeholder="Full Name"
                                value={resumeData.personalInfo.fullName}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                            />
                            <input
                                className="rounded-md border p-2 shadow-sm"
                                placeholder="Email"
                                value={resumeData.personalInfo.email}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                            />
                            <input
                                className="rounded-md border p-2 shadow-sm"
                                placeholder="Phone"
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                            />
                            <textarea
                                className="rounded-md border p-2 col-span-2 h-24 shadow-sm"
                                placeholder="Professional Summary"
                                value={resumeData.personalInfo.summary}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })}
                            />
                            {/* Note: In a full app, we would add the AI generation button right next to the summary here */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (resumeData.personalInfo.summary.length > 5) {
                                        complete(resumeData.personalInfo.summary)
                                    } else {
                                        alert('Please enter a few keywords or sentences first.')
                                    }
                                }}
                                disabled={isLoading}
                                className="col-span-2 rounded bg-indigo-50 p-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '✨ Generating...' : '✨ Enhance Summary with AI'}
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
                            <button onClick={handleAddExperience} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Entry</button>
                        </div>
                        {resumeData.experience.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Work experience entries will appear here.</p>
                        ) : (
                            <div className="space-y-6">
                                {resumeData.experience.map((exp: any, index: number) => (
                                    <div key={index} className="relative p-4 border border-gray-100 bg-gray-50 rounded-md">
                                        <button
                                            onClick={() => handleRemoveExperience(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <input
                                                className="rounded-md border p-2 shadow-sm"
                                                placeholder="Job Title"
                                                value={exp.title}
                                                onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border p-2 shadow-sm"
                                                placeholder="Company Name"
                                                value={exp.company}
                                                onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border p-2 col-span-2 shadow-sm"
                                                placeholder="Dates (e.g. Jan 2020 - Present)"
                                                value={exp.date}
                                                onChange={(e) => handleUpdateExperience(index, 'date', e.target.value)}
                                            />
                                            <textarea
                                                className="rounded-md border p-2 col-span-2 h-20 shadow-sm"
                                                placeholder="Description / Responsibilities"
                                                value={exp.description}
                                                onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                            <button onClick={handleAddEducation} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Entry</button>
                        </div>
                        {resumeData.education.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Education entries will appear here.</p>
                        ) : (
                            <div className="space-y-6">
                                {resumeData.education.map((edu: any, index: number) => (
                                    <div key={index} className="relative p-4 border border-gray-100 bg-gray-50 rounded-md">
                                        <button
                                            onClick={() => handleRemoveEducation(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <input
                                                className="rounded-md border p-2 shadow-sm"
                                                placeholder="Degree / Certificate"
                                                value={edu.degree}
                                                onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border p-2 shadow-sm"
                                                placeholder="School / University"
                                                value={edu.school}
                                                onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border p-2 col-span-2 shadow-sm"
                                                placeholder="Dates (e.g. 2018 - 2022)"
                                                value={edu.date}
                                                onChange={(e) => handleUpdateEducation(index, 'date', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border p-2 col-span-2 shadow-sm"
                                                placeholder="Additional Info (GPA, Honors, etc.)"
                                                value={edu.info}
                                                onChange={(e) => handleUpdateEducation(index, 'info', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
                            <button onClick={handleAddSkill} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Skill</button>
                        </div>
                        {resumeData.skills.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Skills will appear here.</p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {resumeData.skills.map((skill: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                                        <input
                                            className="bg-transparent focus:outline-none text-sm text-indigo-900 w-24"
                                            placeholder="Skill..."
                                            value={skill}
                                            onChange={(e) => handleUpdateSkill(index, e.target.value)}
                                            autoFocus={skill === ''}
                                        />
                                        <button
                                            onClick={() => handleRemoveSkill(index)}
                                            className="text-indigo-400 hover:text-red-500 rounded-full flex items-center justify-center p-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Preview Section (Right Side) */}
            <div className="w-1/2 bg-gray-200 p-8 flex flex-col items-center overflow-y-auto relative">
                <div className="w-[8.5in] flex justify-end mb-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-indigo-600 text-white px-5 py-2 rounded shadow-md hover:bg-indigo-700 transition flex items-center gap-2 font-medium text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Download / Print PDF
                    </button>
                </div>
                {/* A4 Resume Paper Effect */}
                <div ref={contentRef} id="resume-preview-content" className="w-[8.5in] min-h-[11in] bg-white p-10 shadow-xl transition-all h-fit shrink-0 tracking-normal text-gray-900 print:shadow-none print:m-0 print:p-8">
                    {/* Preview Content */}
                    <header className="border-b-2 border-gray-300 pb-4 mb-6">
                        <h1 className="text-4xl font-serif font-bold text-gray-900 uppercase tracking-tight">
                            {resumeData.personalInfo.fullName || 'Your Name'}
                        </h1>
                        <div className="text-sm mt-2 text-gray-600 flex gap-4">
                            <span>{resumeData.personalInfo.email || 'email@example.com'}</span>
                            <span>•</span>
                            <span>{resumeData.personalInfo.phone || '(555) 123-4567'}</span>
                        </div>
                    </header>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Professional Summary</h2>
                        <p className="text-sm text-gray-700 leading-relaxed font-serif">
                            {resumeData.personalInfo.summary || 'Summary text will appear here. Build an impressive and professional summary to catch the eye of recruiters.'}
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Experience</h2>
                        {resumeData.experience.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">Experience items will map here...</div>
                        ) : (
                            <div className="space-y-4 pt-2">
                                {resumeData.experience.map((exp: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
                                            <span className="text-sm font-medium text-gray-600 font-serif">{exp.date || 'Dates'}</span>
                                        </div>
                                        <div className="text-indigo-700 font-semibold text-sm mb-2">{exp.company || 'Company Name'}</div>
                                        <p className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">
                                            {exp.description || 'Description of responsibilities and achievements...'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Education</h2>
                        {resumeData.education.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">Education items will map here...</div>
                        ) : (
                            <div className="space-y-4 pt-2">
                                {resumeData.education.map((edu: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{edu.degree || 'Degree/Certificate'}</h3>
                                            <span className="text-sm font-medium text-gray-600 font-serif">{edu.date || 'Dates'}</span>
                                        </div>
                                        <div className="text-indigo-700 font-semibold text-sm mb-1">{edu.school || 'School/University Name'}</div>
                                        <div className="text-sm text-gray-600 font-serif">{edu.info}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {resumeData.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {resumeData.skills.map((skill: string, index: number) => (
                                    skill && (
                                        <span key={index} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-sm border border-gray-200 font-medium">
                                            {skill}
                                        </span>
                                    )
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
