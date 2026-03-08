import { ResumeData } from '@/types/resume'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export function TemplateMinimal({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-10 shadow-xl text-gray-900 print:shadow-none print:m-0 print:p-8">
            <header className="border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-4xl font-serif font-bold text-gray-900 uppercase tracking-tight">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm mt-2 text-gray-600 flex flex-wrap gap-4">
                    {data.personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {data.personalInfo.website}</span>}
                </div>
            </header>

            {data.personalInfo.summary && (
                <section className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed font-serif">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4">Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-md font-bold text-gray-900">{exp.title}</h3>
                                    <span className="text-sm text-gray-500 font-medium">{exp.date}</span>
                                </div>
                                <div className="text-md text-gray-700 italic mb-2">{exp.company}</div>
                                <p className="text-sm text-gray-600 font-serif leading-relaxed whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4">Education</h2>
                    <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-md font-bold text-gray-900">{edu.degree}</h3>
                                    <span className="text-sm text-gray-500 font-medium">{edu.date}</span>
                                </div>
                                <div className="text-md text-gray-700 mb-1">{edu.school}</div>
                                {edu.info && <p className="text-sm text-gray-600 font-serif">{edu.info}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-6">
                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-3">Skills</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 font-serif columns-2">
                            {data.skills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-3">Languages</h2>
                        <div className="space-y-1">
                            {data.languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-900 font-medium">{lang.language}</span>
                                    <span className="text-gray-500 font-serif">{lang.fluency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {data.projects && data.projects.length > 0 && (
                <section className="mt-6 border-t border-gray-100 pt-4">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-4">Projects</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="text-md font-bold text-gray-900">
                                    {proj.name} {proj.link && <span className="text-xs font-normal text-indigo-500 ml-1">({proj.link})</span>}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 font-serif leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
