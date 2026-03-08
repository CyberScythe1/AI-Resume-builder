'use client'

import { useState, useEffect, useRef } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Templates, TemplateId, TEMPLATE_IDS } from '@/components/templates'

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
    const previewContainerRef = useRef<HTMLDivElement>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(300)
    const [scale, setScale] = useState(1)
    const [history, setHistory] = useState<any[]>([])
    const [isEnhancing, setIsEnhancing] = useState(false)

    const [resumeData, setResumeData] = useState(
        initialResume?.content || {
            templateId: 'minimal',
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
            projects: [],
            languages: [],
            skills: []
        }
    )

    const [title, setTitle] = useState(initialResume?.title || 'Untitled Resume')

    // Countdown logic
    useEffect(() => {
        const checkUserAndStartTimer = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            // If the user is logged in, their resumes don't expire
            if (session?.user) {
                setTimeLeft(null)
                return
            }

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
        }
        checkUserAndStartTimer()
    }, [resumeId, initialResume, router, supabase])

    // Auto-save logic
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(async () => {
            setIsSaving(true)

            try {
                // Determine if user is logged in to link the resume
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session?.user?.id || null

                if (resumeId === 'new') {
                    const newId = uuidv4()
                    const { error } = await supabase.from('resumes').insert({
                        id: newId,
                        user_id: userId,
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
    }, [resumeData, title, resumeId, router, supabase])

    // Container scaling logic
    useEffect(() => {
        const container = previewContainerRef.current
        if (!container) return

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const containerWidth = entry.contentRect.width
                // A4 width is 8.5in (~816px). We add 32px to ensure 16px padding on both sides.
                const newScale = Math.min((containerWidth - 32) / 816, 1)
                setScale(newScale)
            }
        })

        observer.observe(container)
        return () => observer.disconnect()
    }, [])

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

    const handleAddProject = () => {
        setResumeData((prev: any) => ({
            ...prev,
            projects: [...(prev.projects || []), { name: '', link: '', description: '' }]
        }))
    }

    const handleUpdateProject = (index: number, field: string, value: string) => {
        const newProjects = [...resumeData.projects]
        newProjects[index][field] = value
        setResumeData({ ...resumeData, projects: newProjects })
    }

    const handleRemoveProject = (index: number) => {
        const newProjects = [...resumeData.projects]
        newProjects.splice(index, 1)
        setResumeData({ ...resumeData, projects: newProjects })
    }

    const handleAddLanguage = () => {
        setResumeData((prev: any) => ({
            ...prev,
            languages: [...(prev.languages || []), { language: '', fluency: '' }]
        }))
    }

    const handleUpdateLanguage = (index: number, field: string, value: string) => {
        const newLangs = [...resumeData.languages]
        newLangs[index][field] = value
        setResumeData({ ...resumeData, languages: newLangs })
    }

    const handleRemoveLanguage = (index: number) => {
        const newLangs = [...resumeData.languages]
        newLangs.splice(index, 1)
        setResumeData({ ...resumeData, languages: newLangs })
    }

    const handleDownloadPDF = useReactToPrint({
        contentRef: contentRef,
        documentTitle: title || 'Resume',
    })

    const { completion, complete, isLoading } = useCompletion({
        api: '/api/generate',
        streamProtocol: 'text',
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
        <div className="flex flex-col lg:flex-row w-full h-full lg:overflow-hidden text-black dark:text-gray-100 bg-white dark:bg-slate-900 lg:bg-transparent dark:lg:bg-transparent transition-colors">
            {/* Form Section (Left Side) */}
            <div className="print:hidden w-full lg:w-1/2 flex-col lg:overflow-y-auto border-r border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 pb-20 lg:pb-6 transition-colors">
                <header className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-gray-50 dark:bg-slate-900/95 z-10 p-2 shadow-sm rounded-md transition-colors">
                    <div className="flex flex-col gap-1 w-full sm:w-1/2">
                        <Logo className="text-xl sm:text-2xl" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-sm font-medium text-gray-500 dark:text-gray-400 focus:outline-none focus:text-gray-900 dark:focus:text-gray-100 transition-colors"
                            placeholder="Resume Title"
                        />
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                            {(resumeId !== 'new' && timeLeft !== null) && (
                                <div className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 shadow-sm transition-all hover:bg-red-100 whitespace-nowrap">
                                    Ends in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </div>
                            )}
                            <button
                                onClick={handleDownloadPDF}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-indigo-700 transition flex items-center gap-2 font-medium text-xs whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                Download PDF
                            </button>
                            <ThemeToggle />
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                            {isSaving ? 'Saving...' : 'All changes saved.'}
                        </span>
                    </div>
                </header>

                <section className="space-y-6">
                    {/* Template Selector Section */}
                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Design Template</h2>
                        <div className="flex overflow-x-auto gap-3 pb-2 pt-1 scrollbar-hide">
                            {TEMPLATE_IDS.map(tid => (
                                <button
                                    key={tid}
                                    onClick={() => setResumeData({ ...resumeData, templateId: tid })}
                                    className={`px-4 py-2 rounded-md border text-sm font-bold capitalize whitespace-nowrap transition-all ${(resumeData.templateId || 'minimal') === tid
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600 ring-offset-2'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                        }`}
                                >
                                    {tid}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Personal Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Full Name"
                                value={resumeData.personalInfo.fullName}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                            />
                            <input
                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Email"
                                value={resumeData.personalInfo.email}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                            />
                            <input
                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Phone"
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                            />
                            <textarea
                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Professional Summary"
                                value={resumeData.personalInfo.summary}
                                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Experience</h2>
                            <button onClick={handleAddExperience} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Entry</button>
                        </div>
                        {resumeData.experience.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Work experience entries will appear here.</p>
                        ) : (
                            <div className="space-y-6">
                                {resumeData.experience.map((exp: any, index: number) => (
                                    <div key={index} className="relative p-4 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                                        <button
                                            onClick={() => handleRemoveExperience(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Job Title"
                                                value={exp.title}
                                                onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Company Name"
                                                value={exp.company}
                                                onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Dates (e.g. Jan 2020 - Present)"
                                                value={exp.date}
                                                onChange={(e) => handleUpdateExperience(index, 'date', e.target.value)}
                                            />
                                            <textarea
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 h-20 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Education</h2>
                            <button onClick={handleAddEducation} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Entry</button>
                        </div>
                        {resumeData.education.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Education entries will appear here.</p>
                        ) : (
                            <div className="space-y-6">
                                {resumeData.education.map((edu: any, index: number) => (
                                    <div key={index} className="relative p-4 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                                        <button
                                            onClick={() => handleRemoveEducation(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Degree / Certificate"
                                                value={edu.degree}
                                                onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="School / University"
                                                value={edu.school}
                                                onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Dates (e.g. 2018 - 2022)"
                                                value={edu.date}
                                                onChange={(e) => handleUpdateEducation(index, 'date', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Skills</h2>
                            <button onClick={handleAddSkill} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Skill</button>
                        </div>
                        {resumeData.skills.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Skills will appear here.</p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {resumeData.skills.map((skill: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 rounded-full px-3 py-1">
                                        <input
                                            className="bg-transparent focus:outline-none text-sm text-indigo-900 dark:text-indigo-200 w-24"
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
                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Projects</h2>
                            <button onClick={handleAddProject} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Entry</button>
                        </div>
                        {(!resumeData.projects || resumeData.projects.length === 0) ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Project entries will appear here.</p>
                        ) : (
                            <div className="space-y-6">
                                {resumeData.projects.map((proj: any, index: number) => (
                                    <div key={index} className="relative p-4 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                                        <button
                                            onClick={() => handleRemoveProject(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Project Name"
                                                value={proj.name}
                                                onChange={(e) => handleUpdateProject(index, 'name', e.target.value)}
                                            />
                                            <input
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Link (optional)"
                                                value={proj.link}
                                                onChange={(e) => handleUpdateProject(index, 'link', e.target.value)}
                                            />
                                            <textarea
                                                className="rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 col-span-2 h-20 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Description / Technologies used"
                                                value={proj.description}
                                                onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Languages</h2>
                            <button onClick={handleAddLanguage} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Language</button>
                        </div>
                        {(!resumeData.languages || resumeData.languages.length === 0) ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Languages will appear here.</p>
                        ) : (
                            <div className="space-y-4">
                                {resumeData.languages.map((lang: any, index: number) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input
                                            className="rounded-md border p-2 shadow-sm flex-1"
                                            placeholder="Language (e.g. Spanish)"
                                            value={lang.language}
                                            onChange={(e) => handleUpdateLanguage(index, 'language', e.target.value)}
                                        />
                                        <input
                                            className="rounded-md border p-2 shadow-sm flex-1"
                                            placeholder="Fluency (e.g. Native, Fluent, Beginner)"
                                            value={lang.fluency}
                                            onChange={(e) => handleUpdateLanguage(index, 'fluency', e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleRemoveLanguage(index)}
                                            className="text-red-400 hover:text-red-600 p-2"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AI Enhancement Section */}
                    <div className="rounded-lg border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-900/20 p-6 shadow-sm relative overflow-hidden transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                        <h2 className="mb-2 text-xl font-bold text-indigo-900 dark:text-indigo-300">✨ Polish Review & AI Enhance</h2>
                        <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mb-5 leading-relaxed max-w-lg">
                            Ready to finalize? Our AI will scan your entire resume, rewriting your descriptions and summary with powerful action verbs and professional phrasing—without removing your actual experience.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button
                                onClick={async () => {
                                    setIsEnhancing(true)
                                    try {
                                        const res = await fetch('/api/enhance-resume', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ resumeData })
                                        })
                                        const data = await res.json()
                                        if (res.ok && data.enhancedData) {
                                            setHistory(prev => [...prev, resumeData])
                                            setResumeData({ ...data.enhancedData, templateId: resumeData.templateId })
                                        } else {
                                            alert(data.error || 'Enhancement failed.')
                                        }
                                    } catch (err) {
                                        alert('Error connecting to AI service.')
                                    } finally {
                                        setIsEnhancing(false)
                                    }
                                }}
                                disabled={isEnhancing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-md shadow-md flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                            >
                                {isEnhancing ? '✨ Processing Resume...' : '✨ Auto-Polish Entire Resume'}
                            </button>

                            {history.length > 0 && (
                                <button
                                    onClick={() => {
                                        const previousState = history[history.length - 1]
                                        setHistory(prev => prev.slice(0, -1))
                                        setResumeData(previousState)
                                    }}
                                    className="text-sm font-bold text-gray-500 hover:text-indigo-600 hover:underline underline-offset-2 px-2 transition-colors"
                                >
                                    ↺ Undo AI Changes
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Preview Section (Right Side) */}
            <div
                ref={previewContainerRef}
                className="w-full lg:w-1/2 bg-gray-200 dark:bg-slate-900/50 p-4 lg:p-0 flex flex-col items-center overflow-x-hidden overflow-y-auto print:overflow-visible print:bg-white print:p-0 transition-colors"
            >
                <div
                    className="flex justify-center transition-transform duration-300 origin-top pt-8 pb-10 print-safe-wrapper"
                    style={{
                        transform: `scale(${scale})`,
                        width: '816px', // Explicitly hold the 8.5in space to prevent container collapsing
                        marginBottom: `-${(1 - scale) * 1056}px` // Reduce bottom margin to counteract the layout space left by scale
                    }}
                >
                    {/* A4 Resume Paper Effect wrapped securely for print */}
                    <div ref={contentRef} id="resume-preview-content" className="shrink-0 print:shadow-none print:m-0">
                        {(() => {
                            const SelectedTemplate = Templates[(resumeData.templateId as TemplateId) || 'minimal'] || Templates.minimal;
                            return <SelectedTemplate data={resumeData} />;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}
