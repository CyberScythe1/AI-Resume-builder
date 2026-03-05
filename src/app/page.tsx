import Link from 'next/link'
import { FileDown, Clock, ShieldCheck, Zap } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8 text-black">
      <main className="flex w-full max-w-6xl flex-col items-center justify-center text-center">

        {/* Hero Section */}
        <div className="mb-12 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200">
          <Clock className="w-4 h-4" /> Resumes self-destruct in 5 minutes for your privacy.
        </div>

        <div className="mb-6 flex flex-col items-center">
          <Logo className="text-6xl sm:text-7xl mb-4" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Build Your <span className="text-indigo-600">Perfect Resume</span> Fast
          </h2>
        </div>

        <p className="mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Use the power of AI to craft professional summaries that get you hired. Stand out from the crowd with our intelligent builder. No login required, maximum privacy.
        </p>

        <div className="flex gap-4 mb-16">
          <Link
            href="/builder/new"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1"
          >
            <Zap className="w-5 h-5" /> Start Creating Instantly
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">AI-Powered</h3>
            <p className="text-gray-600">Instantly generate professional summaries and bullet points using advanced AI.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">No Login Required</h3>
            <p className="text-gray-600">Skip the sign-up process. Just start building your resume immediately.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center text-red-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">5-Minute Expiration</h3>
            <p className="text-gray-600">For your security, generated resumes are completely destroyed from our servers after 5 minutes.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
