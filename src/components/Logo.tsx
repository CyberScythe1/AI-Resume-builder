import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
    return (
        <Link
            href="/"
            className={`font-extrabold tracking-tighter ${className}`}
        >
            <span className="text-gray-900">Resume</span>
            <span className="text-indigo-600">Forge</span>
        </Link>
    )
}
