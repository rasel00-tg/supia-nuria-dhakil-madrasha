import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { supabase } from '../lib/supabase'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { user, role } = useContext(AuthContext)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [notices, setNotices] = useState(['স্বাগতম আমাদের মাদ্রাসায়', '২০২৬ শিক্ষাবর্ষের ভর্তি চলছে'])
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchMarqueeNotices = async () => {
            const { data } = await supabase.from('notices').select('title').order('created_at', { ascending: false }).limit(5)
            if (data && data.length > 0) {
                setNotices(data.map(n => n.title))
            }
        }
        fetchMarqueeNotices()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setIsOpen(false)
        navigate('/')
    }

    const navItems = [
        { label: 'হোম', path: '/' },
        { label: 'শিক্ষক তালিকা', path: '/teachers' },
        { label: 'নোটিশ বোর্ড', path: '/notices' },
        { label: 'ভর্তি তথ্য', path: '/admission' },
        { label: 'গ্যালারি', path: '/gallery' },
        { label: 'যোগাযোগ', path: '/contact' },
    ]

    return (
        <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl border-b border-slate-100' : 'bg-transparent'}`}>
            {/* Top Bar / Scrolling Notice */}
            <div className={`bg-slate-900 overflow-hidden transition-all duration-500 ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                <div className="container mx-auto px-6 h-full flex items-center">
                    <div className="flex items-center gap-4 text-white font-bold text-sm whitespace-nowrap">
                        <span className="bg-emerald-500 text-white px-3 py-0.5 rounded-full text-[10px] uppercase tracking-tighter shrink-0 animate-pulse">Update</span>
                        <div className="relative flex-1 overflow-hidden">
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                                className="flex gap-16"
                            >
                                {notices.map((n, i) => (
                                    <span key={i} className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                                        {n}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={`container mx-auto px-6 transition-all duration-500 ${isScrolled ? 'h-20' : 'h-24'}`}>
                <div className="flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                            <img src={logo} alt="Logo" className={`transition-all duration-500 ${isScrolled ? 'w-10 h-10' : 'w-14 h-14'} object-contain relative z-10`} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-black tracking-tight leading-none transition-all duration-500 ${isScrolled ? 'text-lg text-slate-900' : 'text-xl text-white'}`}>
                                সুফিয়া নূরীয়া
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest leading-none mt-1 transition-all duration-500 ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}>
                                দাখিল মাদ্রাসা
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-black uppercase tracking-widest transition-all hover:text-emerald-500 relative group ${isScrolled ? 'text-slate-600' : 'text-white'}`}
                            >
                                {item.label}
                                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-emerald-500 rounded-full transition-all group-hover:w-full" />
                            </Link>
                        ))}

                        {user ? (
                            <Link
                                to={role === 'admin' ? '/admin' : (role === 'teacher' ? '/teacher' : '/student')}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                            >
                                ড্যাশবোর্ড
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                            >
                                লগইন
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`lg:hidden p-3 rounded-2xl transition-colors ${isScrolled ? 'bg-slate-50 text-slate-900' : 'bg-white/10 text-white backdrop-blur-md'}`}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Slide-out Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1100] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl z-[1200] lg:hidden border-l border-white/20"
                        >
                            <div className="flex flex-col h-full">
                                {/* Drawer Header */}
                                <div className="p-6 flex justify-between items-center border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 leading-none">সুফিয়া নূরীয়া</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">মেনু</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Drawer Items */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-6 py-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl text-slate-700 hover:text-emerald-600 font-black uppercase tracking-widest transition-all"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                    {user ? (
                                        <div className="space-y-3">
                                            <Link
                                                to={role === 'admin' ? '/admin' : (role === 'teacher' ? '/teacher' : '/student')}
                                                onClick={() => setIsOpen(false)}
                                                className="block w-full text-center py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                                            >
                                                ড্যাশবোর্ড
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                                            >
                                                লগ আউট
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                                        >
                                            লগইন পোর্টাল
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
