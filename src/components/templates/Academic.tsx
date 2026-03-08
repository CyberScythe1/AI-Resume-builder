import { ResumeData } from '@/types/resume'

export function TemplateAcademic({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-12 shadow-xl text-black font-serif print:shadow-none print:m-0 print:p-10">
            <header className="text-center mb-6 border-b-2 border-double border-gray-400 pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">
                    {data.personalInfo.fullName || 'Academic Name'}
                </h1>
                <div className="text-xs flex justify-center items-center gap-4">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                </div>
            </header>

            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 py-1 px-2 mb-3 border border-gray-300">Education</h2>
                    <div className="space-y-3 px-2">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="w-4/5">
                                    <h3 className="text-sm font-bold">{edu.school}</h3>
                                    <div className="text-sm italic">{edu.degree}</div>
                                    {edu.info && <div className="text-xs mt-1 text-gray-800">{edu.info}</div>}
                                </div>
                                <div className="w-1/5 text-right text-xs pt-1">{edu.date}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 py-1 px-2 mb-3 border border-gray-300">Academic & Professional Experience</h2>
                    <div className="space-y-4 px-2">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-bold">{exp.title}, <span className="font-normal italic">{exp.company}</span></h3>
                                    <span className="text-xs pt-1">{exp.date}</span>
                                </div>
                                <p className="text-xs leading-relaxed whitespace-pre-line mt-1 text-justify">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects && data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 py-1 px-2 mb-3 border border-gray-300">Research & Publications</h2>
                    <div className="space-y-3 px-2">
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-bold">{proj.name}</h3>
                                    {proj.link && <span className="text-xs italic text-blue-700">{proj.link}</span>}
                                </div>
                                <p className="text-xs leading-relaxed mt-1 text-justify">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-6">
                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 py-1 px-2 mb-3 border border-gray-300">Technical Skills</h2>
                        <div className="px-2 text-xs leading-relaxed">
                            <strong>Proficient in:</strong> {data.skills.join(', ')}
                        </div>
                    </section>
                )}
                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 py-1 px-2 mb-3 border border-gray-300">Languages</h2>
                        <div className="px-2 text-xs leading-relaxed">
                            {data.languages.map((lang, i) => (
                                <span key={i}>
                                    <strong>{lang.language}</strong> ({lang.fluency}){i < data.languages.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
