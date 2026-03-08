import { ResumeData } from '@/types/resume'

export function TemplateTech({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-zinc-50 p-10 shadow-xl text-zinc-900 font-mono print:shadow-none print:m-0 print:bg-white print:p-8">
            <header className="border-l-4 border-purple-500 pl-6 mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                    {data.personalInfo.fullName || 'user@local:~# whoami'}
                </h1>
                <div className="text-xs text-zinc-600 flex flex-wrap gap-x-6 gap-y-2">
                    {data.personalInfo.email && <span className="flex items-center hover:text-purple-600 font-medium">email: {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="flex items-center hover:text-purple-600 font-medium">tel: {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="flex items-center hover:text-purple-600 font-medium">loc: {data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span className="flex items-center text-purple-600 font-medium">url: {data.personalInfo.website}</span>}
                </div>
            </header>

            {data.personalInfo.summary && (
                <section className="mb-8">
                    <div className="text-xs font-bold text-purple-500 mb-2 uppercase tracking-wider">{`// Summary`}</div>
                    <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-100 p-4 rounded border border-zinc-200">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.skills.length > 0 && (
                <section className="mb-8">
                    <div className="text-xs font-bold text-purple-500 mb-2 uppercase tracking-wider">{`// Technologies`}</div>
                    <ul className="flex flex-wrap gap-2 text-xs">
                        {data.skills.map((skill, i) => (
                            <li key={i} className="bg-purple-100 text-purple-800 px-2 py-1 border border-purple-200">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-8">
                    <div className="text-xs font-bold text-purple-500 mb-4 uppercase tracking-wider">{`// Experience`}</div>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="relative">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-bold text-zinc-900">
                                        <span className="text-purple-500 mr-2">&gt;</span>{exp.title}
                                    </h3>
                                    <span className="text-xs text-zinc-500 border-b border-zinc-300 border-dashed">{exp.date}</span>
                                </div>
                                <div className="text-xs text-zinc-500 mb-2 pl-4">@ {exp.company}</div>
                                <p className="text-xs text-zinc-700 leading-normal pl-4 whitespace-pre-line border-l border-zinc-300 ml-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.education.length > 0 && (
                    <section>
                        <div className="text-xs font-bold text-purple-500 mb-4 uppercase tracking-wider">{`// Education`}</div>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i} className="pl-4 border-l border-zinc-300 ml-1">
                                    <h3 className="font-bold text-zinc-900 text-sm mb-1">{edu.degree}</h3>
                                    <div className="text-xs text-zinc-600 mb-1">{edu.school}</div>
                                    <div className="text-xs text-zinc-500">{edu.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <div className="text-xs font-bold text-purple-500 mb-4 uppercase tracking-wider">{`// Projects`}</div>
                        <div className="space-y-4">
                            {data.projects.map((proj, i) => (
                                <div key={i} className="pl-4 border-l border-zinc-300 ml-1">
                                    <h3 className="font-bold text-zinc-900 text-sm mb-1">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} className="text-xs text-purple-600 hover:underline block mb-1">{proj.link}</a>}
                                    <p className="text-xs text-zinc-600 mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
