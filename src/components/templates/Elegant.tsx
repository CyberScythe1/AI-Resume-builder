import { ResumeData } from '@/types/resume'

export function TemplateElegant({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-neutral-50 p-12 shadow-xl text-neutral-800 font-sans print:shadow-none print:m-0 print:p-10">
            <header className="mb-10 pb-6 border-b border-neutral-200">
                <h1 className="text-5xl font-light text-neutral-900 tracking-wide mb-4">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-neutral-500 font-light flex flex-wrap gap-x-6 gap-y-2">
                    {data.personalInfo.email && <span className="hover:text-neutral-800 transition-colors">{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="hover:text-neutral-800 transition-colors">{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="hover:text-neutral-800 transition-colors">{data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span className="hover:text-neutral-800 transition-colors">{data.personalInfo.website}</span>}
                </div>
            </header>

            {data.personalInfo.summary && (
                <section className="mb-10">
                    <p className="text-sm text-neutral-600 leading-loose font-light">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-6">Experience</h2>
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-1/4 shrink-0">
                                    <div className="text-xs font-semibold text-neutral-400 tracking-wider mt-1.5">{exp.date}</div>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="text-lg font-normal text-neutral-900">{exp.title}</h3>
                                    <div className="text-sm text-neutral-500 font-medium mb-3">{exp.company}</div>
                                    <p className="text-sm text-neutral-600 leading-loose font-light whitespace-pre-line">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-6">Education</h2>
                    <div className="space-y-6">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-1/4 shrink-0">
                                    <div className="text-xs font-semibold text-neutral-400 tracking-wider mt-1">{edu.date}</div>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="text-base font-normal text-neutral-900">{edu.degree}</h3>
                                    <div className="text-sm text-neutral-500 font-light">{edu.school}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex gap-6">
                <div className="w-1/4 shrink-0">
                    <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-4">Skills & Tools</h2>
                </div>
                <div className="w-3/4">
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="text-sm text-neutral-600 font-light border border-neutral-200 px-3 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
