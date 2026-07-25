/**
 * @file App.jsx
 * @description Main Layout component for the Admin Dashboard.
 * Controls the overall grid shell, left sidebar navigation with role-based filtering,
 * breadcrumb page title header, user profile metadata, and nested route outlet.
 */

import { Outlet, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { logout } from './utils/api'
import {
  LayoutDashboard, Calendar, ClipboardList, Coffee, Tags, Award,
  UserPlus, Image, MessageSquare, Mail, Settings, ExternalLink, LogOut, Banknote, Receipt, Send, Bell, Users, Percent, Sparkles
} from 'lucide-react'

/**
 * Mapping of navigation link labels to Lucide UI Icons.
 */
const iconMap = {
  Dashboard: LayoutDashboard, 
  Events: Calendar, 
  Bookings: ClipboardList,
  'Tea Items': Coffee, 
  'Tea Categories': Tags, 
  Memberships: Award,
  Users: UserPlus, 
  Gallery: Image, 
  Testimonials: MessageSquare, 
  Contacts: Mail,
  Instructors: Users, 
  'Discount Codes': Percent, 
  Settings: Settings,
  Finance: Banknote, 
  Expenses: Receipt, 
  Newsletter: Send, 
  'Email Templates': Mail,
  'Dashboard Users': Users
}

/**
 * Navigation items configuration for the admin sidebar.
 */
const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/tea-items', label: 'Tea Items' },
  { to: '/admin/tea-categories', label: 'Tea Categories' },
  { to: '/admin/memberships', label: 'Memberships' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/dashboard-users', label: 'Dashboard Users', adminOnly: true },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/contacts', label: 'Contacts' },
  { to: '/admin/newsletter', label: 'Newsletter' },
  { to: '/admin/email-templates', label: 'Email Templates' },
  { to: '/admin/instructors', label: 'Instructors' },
  { to: '/admin/discount-codes', label: 'Discount Codes' },
  { to: '/admin/finance', label: 'Finance' },
  { to: '/admin/expenses', label: 'Expenses' },
  { to: '/admin/settings', label: 'Settings' },
]

/**
 * SidebarNav Component
 * Renders the vertical navigation list with role-based filtering (e.g. adminOnly links).
 */
function SidebarNav() {
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}
  const isAdmin = adminUser.role === 'admin'

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1.5 scrollbar-thin">
      {links.map(l => {
        if (l.adminOnly && !isAdmin) return null
        const Icon = iconMap[l.label] || LayoutDashboard
        return (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-xs font-semibold no-underline rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00d2ff] to-[#00a2ff] text-white shadow-[0_6px_20px_rgba(0,180,255,0.35)] scale-[1.02]'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`
            }>
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            <span>{l.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

/**
 * App Main Layout Component
 * Wraps the dashboard layout, enforces authentication check, header breadcrumb title, and outlet rendering.
 */
export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('admin_token')
  const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {}

  useEffect(() => {
    document.body.classList.remove('dark')
  }, [])

  // If no auth token is present in localStorage, redirect immediately to login
  if (!token) return <Navigate to="/admin/login" replace />

  /**
   * Handle session logout and state cleanup.
   */
  const handleLogout = async () => {
    try { await logout() } catch {}
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  // Determine active page label for header breadcrumb
  const currentLink = links.find(l => l.end ? location.pathname === l.to : location.pathname.startsWith(l.to) && l.to !== '/admin')
  const pageName = currentLink ? currentLink.label : 'Overview'

  return (
    <div className="h-screen w-screen bg-[#f4f5fa] p-2 sm:p-3 flex items-center justify-center overflow-hidden">
      {/* Outer Card Container */}
      <div className="w-full h-full max-w-[1600px] bg-white rounded-[24px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-56 sm:w-64 shrink-0 border-r border-slate-100 flex flex-col bg-white py-4">
          {/* Studio Brand Header */}
          <div className="px-5 pb-4 flex items-center gap-2.5 border-b border-slate-100/60 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00d2ff] to-[#7963f0] flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
              <Sparkles size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-800 tracking-wider leading-none">PILATEA</h1>
              <p className="text-[9px] font-semibold text-slate-400 tracking-tight mt-0.5">Studio Management</p>
            </div>
          </div>

          {/* Navigation Items List */}
          <SidebarNav />

          {/* Sidebar Footer Actions */}
          <div className="px-5 pt-3 mt-auto border-t border-slate-100/80">
            <div className="flex items-center justify-between px-1">
              <a href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer"
                className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 no-underline">
                <ExternalLink size={13} /> Visit Site
              </a>
              <button onClick={handleLogout}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-500 flex items-center gap-1.5 cursor-pointer bg-transparent border-0">
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#fafbfe] h-full overflow-hidden">
          {/* Sticky Header Bar */}
          <header className="px-6 py-3.5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md shrink-0 z-30">
            {/* Breadcrumb Navigation */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <span>DASHBOARD</span>
                <span>/</span>
                <span className="text-slate-700">{pageName}</span>
              </div>
            </div>

            {/* User Profile Header Controls */}
            <div className="flex items-center gap-3">
              <button className="relative w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <Bell size={15} strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full" />
              </button>

              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-purple-500/20 overflow-hidden border border-white">
                  {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Main Body View for Nested Routes */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
            <div className="page-enter">
              <Outlet />
            </div>
          </main>
        </div>

      </div>
    </div>
  )
}
