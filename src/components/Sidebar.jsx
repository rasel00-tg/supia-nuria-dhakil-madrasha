import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    BookOpen,
    Calendar,
    Users,
    Trophy,
    Phone,
    Menu,
    X,
    GraduationCap,
    FileText, // Imported for Admission icon
    Sun // Imported for Nurani Department icon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    // Hide sidebar on AI pages, Nurani Department, Committee, and Memorable pages
    if (location.pathname === '/ai-chat' || location.pathname === '/ai-memorial' || location.pathname === '/routine' || location.pathname === '/nurani-department' || location.pathname === '/hifz' || location.pathname === '/committee' || location.pathname === '/memorable') {
        return null
    }

    const navItems = [
        { label: 'হোম', path: '/', icon: Home },
        { label: 'অনলাইন ভর্তি', path: '/admission', icon: FileText }, // Added Admission Link
        { label: 'নূরানী বিভাগ', path: '/nurani-department', icon: Sun },
        { label: 'হিফজ বিভাগ', path: '/hifz', icon: BookOpen },
        { label: 'সাংস্কৃতিক ও খেলাধুলা', path: '/events', icon: Trophy },
        { label: 'শিক্ষক পরিচিতি', path: '/teachers', icon: Users },
        { label: 'একনজরে শিক্ষার্থী', path: '/students', icon: GraduationCap },
        { label: 'আসন্ন পরীক্ষার রুটিন', path: '/routine', icon: Calendar },
        { label: 'যোগাযোগ', path: '/contact', icon: Phone },
    ]

    const toggleSidebar = () => setIsOpen(!isOpen)

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-white font-bengali shadow-2xl">
            {/* Header */}
            <div className="p-6 flex flex-col items-center border-b border-slate-800 bg-slate-950/50">
                <img src={logo} alt="Logo" className="w-14 h-14 mb-3 object-contain" />
                <h2 className="text-lg font-black text-center whitespace-nowrap text-emerald-400 mb-4">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h2>

                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-500"
                >
                    <span>🔐 লগইন</span>
                </Link>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Footer Contact Btn */}
            <div className="p-4 border-t border-slate-800">
                <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-emerald-600 text-white py-3 rounded-xl transition-all font-bold text-sm"
                >
                    <Phone size={16} />
                    যোগাযোগ করুন
                </Link>
            </div>
        </div>
    )

    return (
        <>
            {/* Hamburger Button (Visible on all screens) */}
            <button
                onClick={toggleSidebar}
                className="absolute top-14 left-6 z-[2000] p-3 md:p-4 bg-emerald-600 rounded-xl md:rounded-2xl text-white shadow-xl hover:bg-emerald-500 transition-all group scale-100 hover:scale-105 active:scale-95 ring-4 ring-emerald-600/20"
            >
                <Menu size={28} className="md:w-8 md:h-8" strokeWidth={2.5} />
            </button>

            {/* Drawer Overlay & Content */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 z-[2000] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 z-[2001] h-full"
                        >
                            <SidebarContent />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-800 text-white rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Sidebar
