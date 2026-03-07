import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, FileText, Trash2, Edit2, LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { revalidatePath } from 'next/cache'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch resumes matching this user
    const { data: resumes } = await supabase
        .from('resumes')
        .select('id, title, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

    async function deleteResume(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const supabase = await createClient()
        await supabase.from('resumes').delete().eq('id', id)
        revalidatePath('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 transition-colors duration-200">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo />
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user?.email}</span>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Resumes</h1>
                    <Link
                        href="/builder/new"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" /> Create New
                    </Link>
                </div>

                {(!resumes || resumes.length === 0) ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                        <div className="bg-indigo-50 dark:bg-indigo-900/50 w-16 h-16 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resumes yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Create your first resume to start saving your professional profile permanently.</p>
                        <Link
                            href="/builder/new"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition font-medium"
                        >
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate pr-4">
                                            {resume.title || 'Untitled Resume'}
                                        </h3>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/50 p-2 rounded-md">
                                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Last edited: {new Date(resume.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                                    <Link
                                        href={`/builder/${resume.id}`}
                                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </Link>
                                    <form action={deleteResume}>
                                        <input type="hidden" name="id" value={resume.id} />
                                        <button
                                            type="submit"
                                            className="text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
