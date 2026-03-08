import { ResumeData } from '@/types/resume'

export function TemplateStartup({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-10 shadow-xl text-black font-sans print:shadow-none print:m-0 print:p-8">
            <header className="mb-8">
                <h1 className="text-6xl font-black text-black tracking-tighter uppercase leading-none mb-3">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="text-sm font-bold flex flex-wrap gap-4 border-t-4 border-black pt-3">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
                </div>
            </header>

            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1 space-y-8">
                    {data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-3 pb-1">Skills</h2>
                            <ul className="space-y-1">
                                {data.skills.map((skill, i) => (
                                    <li key={i} className="text-sm font-semibold">{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-3 pb-1">Languages</h2>
                            <ul className="space-y-2">
                                {data.languages.map((lang, i) => (
                                    <li key={i} className="text-sm">
                                        <div className="font-bold">{lang.language}</div>
                                        <div className="text-xs text-gray-500">{lang.fluency}</div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <div className="col-span-3 space-y-8">
                    {data.personalInfo.summary && (
                        <section>
                            <h2 className="text-2xl font-black uppercase bg-black text-white inline-block px-3 py-1 mb-4">About Me</h2>
                            <p className="text-base font-medium leading-relaxed">
                                {data.personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase bg-black text-white inline-block px-3 py-1 mb-5">Experience</h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="border-l-4 border-black pl-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-black uppercase">{exp.title}</h3>
                                            <span className="text-sm font-bold bg-gray-100 px-2 py-1">{exp.date}</span>
                                        </div>
                                        <div className="text-md font-bold text-gray-600 mb-2">{exp.company}</div>
                                        <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black uppercase bg-black text-white inline-block px-3 py-1 mb-5">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-3">
                                        <div>
                                            <h3 className="font-black text-lg">{edu.degree}</h3>
                                            <div className="text-sm font-bold text-gray-600">{edu.school}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{edu.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
