import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Users, FileText, Trash2, ShieldAlert } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const supabase = await createClient()

    // 1. Authenticate Request
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Authorize Admin Role 
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (roleError || !roleData || roleData.role !== 'admin') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center px-4">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Unauthorized Access</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 mt-2 max-w-md">You do not have the required administrative privileges to view this page. If you believe this is an error, please contact support.</p>
                <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition shadow">
                    Return to Dashboard
                </Link>
            </div>
        )
    }

    // 3. Fetch Admin Data via Secure RPCs
    const { data: statsData, error: statsError } = await supabase.rpc('get_app_stats')
    const { data: usersData, error: usersError } = await supabase.rpc('get_all_users_admin')

    const stats = statsData || { totalUsers: 0, totalResumes: 0 }
    const users = usersData || []

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform overview and user management</p>
                    </div>
                    <Link href="/dashboard" className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white transition shadow-sm">
                        Back to User Dashboard
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Registered Users</p>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats.totalUsers}</h2>
                        </div>
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Users className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Resumes Created</p>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats.totalResumes}</h2>
                        </div>
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                            <FileText className="w-7 h-7" />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" /> User Directory
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User Email</th>
                                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u: any) => {
                                        const deleteUserAction = async () => {
                                            'use server'
                                            const sp = await createClient()
                                            await sp.rpc('admin_delete_user', { target_uid: u.id })
                                        }
                                        return (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">
                                                {u.email}
                                                {user.id === u.id && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full block md:inline mt-1 md:mt-0">You</span>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                                                    ${u.role === 'admin' 
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' 
                                                        : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
                                                    }
                                                `}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={deleteUserAction}>
                                                    <button 
                                                        type="submit" 
                                                        disabled={user.id === u.id}
                                                        className="inline-flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                                        title={user.id === u.id ? "Cannot delete yourself" : "Delete User"}
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    )})
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
