import { ResumeData } from '@/types/resume'

export function TemplateClassic({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-12 text-black font-serif print:shadow-none print:m-0 print:p-10 shadow-xl">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold uppercase mb-2 leading-tight">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm flex justify-center items-center gap-2">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <><span className="text-gray-400">•</span><span>{data.personalInfo.phone}</span></>}
                    {data.personalInfo.location && <><span className="text-gray-400">•</span><span>{data.personalInfo.location}</span></>}
                    {data.personalInfo.website && <><span className="text-gray-400">•</span><span>{data.personalInfo.website}</span></>}
                </div>
            </header>

            {data.personalInfo.summary && (
                <section className="mb-6">
                    <p className="text-sm leading-relaxed text-justify">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="text-sm font-bold">{exp.title}</h3>
                                    <span className="text-sm">{exp.date}</span>
                                </div>
                                <div className="text-sm italic mb-2">{exp.company}</div>
                                <p className="text-sm leading-relaxed whitespace-pre-line pl-4">
                                    • {exp.description.replace(/\n/g, '\n• ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Education</h2>
                    <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-bold">{edu.school}</h3>
                                    <div className="text-sm italic">{edu.degree}</div>
                                    {edu.info && <div className="text-sm mt-1">{edu.info}</div>}
                                </div>
                                <span className="text-sm">{edu.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Skills</h2>
                        <ul className="list-disc list-inside text-sm columns-2">
                            {data.skills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Projects</h2>
                        <ul className="list-disc list-inside text-sm">
                            {data.projects.map((proj, i) => (
                                <li key={i}>
                                    <strong>{proj.name}</strong> {proj.link && <span className="text-gray-600">({proj.link})</span>}: {proj.description}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    )
}
