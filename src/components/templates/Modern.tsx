import { ResumeData } from '@/types/resume'

export function TemplateModern({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-10 shadow-xl text-gray-900 font-sans print:shadow-none print:m-0 print:p-8">
            <header className="flex justify-between items-end border-b-4 border-blue-600 pb-4 mb-6">
                <div>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    {data.personalInfo.summary && (
                        <p className="text-md text-blue-700 font-medium mt-2 max-w-xl">
                            {data.personalInfo.summary}
                        </p>
                    )}
                </div>
                <div className="text-right text-sm text-gray-600 flex flex-col gap-1 items-end whitespace-nowrap">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
                </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <span className="text-blue-200 mr-2">/</span> Experience
                            </h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-gray-200 py-1">
                                        <div className="absolute w-2 h-2 bg-blue-600 rounded-full -left-[5px] top-2"></div>
                                        <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                                        <div className="text-sm font-semibold text-blue-600 mb-2">
                                            {exp.company} <span className="text-gray-400 font-normal">| {exp.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <span className="text-blue-200 mr-2">/</span> Projects
                            </h2>
                            <div className="space-y-4">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        {proj.link && <a href={proj.link} className="text-xs text-blue-500 hover:underline">{proj.link}</a>}
                                        <p className="text-sm text-gray-700 mt-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-1 space-y-8">
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-gray-800 text-sm">{edu.degree}</h3>
                                        <div className="text-sm text-gray-600">{edu.school}</div>
                                        <div className="text-xs font-medium text-blue-600 mt-1">{edu.date}</div>
                                        {edu.info && <p className="text-xs text-gray-500 mt-1">{edu.info}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Languages</h2>
                            <ul className="space-y-2">
                                {data.languages.map((lang, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{lang.language}</span>
                                        <span className="text-xs text-gray-500">{lang.fluency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
