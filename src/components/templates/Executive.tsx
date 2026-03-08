import { ResumeData } from '@/types/resume'

export function TemplateExecutive({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white p-10 shadow-xl text-gray-900 font-serif print:shadow-none print:m-0 print:p-8">
            <header className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-widest mb-3">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-700 flex justify-center items-center divide-x-2 divide-gray-400 gap-4">
                    {data.personalInfo.email && <span className="pl-4 first:pl-0 uppercase tracking-wider text-xs">{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="pl-4 uppercase tracking-wider text-xs">{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="pl-4 uppercase tracking-wider text-xs">{data.personalInfo.location}</span>}
                </div>
            </header>

            {data.personalInfo.summary && (
                <section className="mb-8">
                    <p className="text-base text-gray-800 font-medium leading-relaxed text-justify px-4 border-l-4 border-gray-300">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">Professional Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase">{exp.company}</h3>
                                    <span className="text-sm font-bold text-gray-700">{exp.date}</span>
                                </div>
                                <div className="text-md italic text-gray-800 mb-2">{exp.title}</div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-gray-100">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-gray-900 text-md">{edu.school}</h3>
                                    <div className="text-sm font-medium text-gray-800">{edu.degree}</div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-600">{edu.info}</span>
                                        <span className="text-xs font-bold text-gray-500">{edu.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div>
                    {data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">Core Competencies</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800 font-semibold">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                        {skill}
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
