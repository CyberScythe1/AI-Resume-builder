import { ResumeData } from '@/types/resume'

export function TemplateVibrant({ data }: { data: ResumeData }) {
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white shadow-xl font-sans flex print:shadow-none print:m-0">
            {/* Left Sidebar */}
            <div className="w-[30%] bg-pink-600 text-white p-8 flex flex-col">
                <div className="mb-12 mt-4">
                    <h1 className="text-3xl font-black uppercase leading-tight tracking-tight break-words">
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                </div>

                <div className="space-y-6 mb-12 text-sm font-medium">
                    {data.personalInfo.email && <div><div className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Email</div>{data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div><div className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Phone</div>{data.personalInfo.phone}</div>}
                    {data.personalInfo.location && <div><div className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Location</div>{data.personalInfo.location}</div>}
                    {data.personalInfo.website && <div><div className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Website</div>{data.personalInfo.website}</div>}
                </div>

                {data.skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-pink-400 pb-2 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-pink-700/50 px-2 py-1 rounded text-xs font-bold">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {data.languages && data.languages.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-pink-400 pb-2 mb-4">Languages</h2>
                        <ul className="space-y-3">
                            {data.languages.map((lang, i) => (
                                <li key={i} className="text-sm">
                                    <div className="font-bold">{lang.language}</div>
                                    <div className="text-xs text-pink-200">{lang.fluency}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-[70%] p-10 py-12 bg-white text-gray-800">
                {data.personalInfo.summary && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-black uppercase text-pink-600 mb-4 inline-block">Profile</h2>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-black uppercase text-pink-600 mb-6 inline-block">Experience</h2>
                        <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l-4 border-pink-100">
                                    <div className="absolute w-4 h-4 bg-pink-600 rounded-full -left-[10px] top-1 border-4 border-white"></div>
                                    <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                                    <div className="text-sm font-bold text-pink-600 mb-1">{exp.company} <span className="text-gray-400 font-normal ml-2">[{exp.date}]</span></div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-black uppercase text-pink-600 mb-6 inline-block">Education</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-gray-900 text-md">{edu.school}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <div className="text-sm text-pink-600 font-bold">{edu.degree}</div>
                                        <div className="text-xs text-gray-500 font-bold">{edu.date}</div>
                                    </div>
                                    {edu.info && <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded">{edu.info}</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
