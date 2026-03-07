import Link from 'next/link'
import { FileDown, Clock, ShieldCheck, Zap, User, LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createClient } from '@/utils/supabase/server'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-8 text-black dark:text-white relative transition-colors duration-300">

      {/* Top Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <ThemeToggle />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2">
                <User className="w-4 h-4" /> Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2">
              <User className="w-4 h-4" /> Log In / Sign Up
            </Link>
          )}
        </div>
      </nav>

      <main className="flex w-full max-w-6xl flex-col items-center justify-center text-center mt-12">

        {/* Hero Section */}
        <div className="mb-12 inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Zap className="w-4 h-4" /> Now with permanent saving & user accounts!
        </div>

        <div className="mb-6 flex flex-col items-center">
          <Logo className="text-6xl sm:text-7xl mb-4" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl dark:text-white">
            Build Your <span className="text-indigo-600 dark:text-indigo-400">Perfect Resume</span> Fast
          </h2>
        </div>

        <p className="mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
          Use the power of AI to craft professional summaries that get you hired. Stand out from the crowd with our intelligent builder. Use as a guest, or log in to permanently save your resumes.
        </p>

        <div className="flex gap-4 mb-16">
          <Link
            href="/builder/new"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 dark:shadow-indigo-900/20"
          >
            <Zap className="w-5 h-5" /> Start Creating Instantly
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI-Powered</h3>
            <p className="text-gray-600 dark:text-gray-400">Instantly generate professional summaries and bullet points using advanced AI.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="bg-green-100 dark:bg-green-900/50 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Permanent Storage</h3>
            <p className="text-gray-600 dark:text-gray-400">Create a free account to securely save and access all your generated resumes anytime.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="bg-red-100 dark:bg-red-900/50 w-12 h-12 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Optional Guest Mode</h3>
            <p className="text-gray-600 dark:text-gray-400">Don't want to sign up? Generate anonymously. Guest resumes self-destruct after 5 minutes.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
