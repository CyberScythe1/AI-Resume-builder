import { ResumeData } from '@/types/resume'

export function TemplateCreative({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white shadow-xl text-gray-900 font-sans flex print:shadow-none print:m-0">
            {/* Left Sidebar */}
            <div className="w-1/3 bg-emerald-800 text-white p-8 flex flex-col pt-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-black uppercase leading-none opacity-90 tracking-tighter mix-blend-overlay">
                        {data.personalInfo.fullName?.split(' ')[0] || 'FIRST'}
                    </h1>
                    <h1 className="text-4xl font-black uppercase leading-none tracking-tighter">
                        {data.personalInfo.fullName?.split(' ').slice(1).join(' ') || 'LAST'}
                    </h1>
                </div>

                <div className="space-y-4 mb-10 text-emerald-100 text-sm font-medium">
                    {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                    {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                    {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
                </div>

                {data.skills.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-emerald-600 pb-2 mb-4 text-emerald-300">Skills</h2>
                        <ul className="space-y-2 text-emerald-50 text-sm">
                            {data.skills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {data.languages && data.languages.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-emerald-600 pb-2 mb-4 text-emerald-300">Languages</h2>
                        <ul className="space-y-3">
                            {data.languages.map((lang, i) => (
                                <li key={i} className="text-sm">
                                    <div className="font-bold text-emerald-50">{lang.language}</div>
                                    <div className="text-xs text-emerald-200">{lang.fluency}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-10 py-12 bg-[#FDFDFD]">
                {data.personalInfo.summary && (
                    <section className="mb-10">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-800 mb-4 inline-block border-b-4 border-emerald-200 pb-1">Profile</h2>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-800 mb-6 inline-block border-b-4 border-emerald-200 pb-1">Experience</h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                                        <span className="text-xs font-bold text-white bg-emerald-700 px-2 py-1 rounded-full">{exp.date}</span>
                                    </div>
                                    <div className="text-md text-emerald-600 font-semibold mb-2">{exp.company}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-800 mb-6 inline-block border-b-4 border-emerald-200 pb-1">Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <div className="text-sm text-gray-700">{edu.school}</div>
                                    <div className="text-xs text-gray-500 mt-1">{edu.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
