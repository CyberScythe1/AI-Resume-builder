import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
    return (
        <Link
            href="/"
            className={`font-extrabold tracking-tighter transition-colors duration-200 ${className}`}
        >
            <span className="text-gray-900 dark:text-white">Resume</span>
            <span className="text-indigo-600 dark:text-indigo-400">Forge</span>
        </Link>
    )
}
