import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Facebook, Youtube, Twitter, Heart, MapPin, Phone, Mail, User, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

export const DeveloperProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const fullMessage = "আমি রাশেদুল করিম—দীর্ঘ ৯ বছর আমার জীবনের মূল্যবান সময় কাটিয়েছি সুফিয়া নূরীয়া দাখিল মাদ্রাসার পাঠশালায়। এই প্রতিষ্ঠান আমার কাছে কেবল একটি শিক্ষাকেন্দ্র ছিল না; এটি ছিল আমার চরিত্র গঠনের সূতিকাগার, আদব ও শালীনতার প্রথম পাঠশালা, এবং জীবনবোধের শক্ত ভিত। এখানকার প্রতিটি শিক্ষক, প্রতিটি শ্রেণিকক্ষ, প্রতিটি স্মৃতি আজও আমাকে নীরবে দায়বদ্ধ করে রাখে। এই দীর্ঘ পথচলার ঋণ কোনো কথায় শোধ হওয়ার নয়। তবুও একজন সাবেক শিক্ষার্থী হিসেবে দায়িত্ববোধ ও কৃতজ্ঞতার জায়গা থেকেই আমি আমার প্রিয় সুফিয়া নূরীয়া দাখিল মাদ্রাসার জন্য এই ওয়েবসাইটটি উপহার হিসেবে প্রদান করেছি। এটি নিছক প্রযুক্তিগত কাজ নয়; এটি আমার অতীতের প্রতি সম্মান, বর্তমানের প্রতি দায়বদ্ধতা এবং ভবিষ্যৎ প্রজন্মের প্রতি এক সুস্পষ্ট অঙ্গীকার। এই ওয়েবসাইটের মাধ্যমে আমাদের ভাই ও বোনেরা সময়ের বাস্তবতায় দাঁড়িয়ে আধুনিক ডিজিটাল ব্যবস্থায় পড়াশোনা করতে পারবে, প্রয়োজনীয় তথ্য পাবে সহজ ও শৃঙ্খলিতভাবে, এবং জ্ঞান অর্জনের পথ আরও বিস্তৃত হবে। এই কাজের মধ্য দিয়েই আমি আমার জীবনের পথ নির্ধারণ করেছি। ওয়েব ও সফটওয়্যার ডেভেলপমেন্টকে কেন্দ্র করে আমি আমার জীবনের যাত্রা শুরু করেছি—এই বিশ্বাস নিয়ে যে প্রযুক্তি যদি নীতিবোধ ও সঠিক উদ্দেশ্যের সাথে যুক্ত হয়, তবে তা শিক্ষা ও সমাজের কল্যাণে শক্তিশালী ভূমিকা রাখতে পারে। এই উদ্যোগ সেই বিশ্বাসেরই প্রথম বাস্তব প্রয়োগ। আমি দৃঢ়ভাবে বিশ্বাস করি—যে প্রতিষ্ঠান আমাদের মানুষ করে তোলে, তার উন্নয়নে ভূমিকা রাখা কোনো দয়া নয়, বরং নৈতিক कर्तव्य। এটি হয়তো একটি ক্ষুদ্র উপহার, কিন্তু এর পেছনে রয়েছে দীর্ঘ নয় বছরের স্মৃতি, আত্মিক টান এবং ভবিষ্যতের প্রতি গভীর দায়বদ্ধতা। আপনাদের সকলের কাছে বিনীত অনুরোধ—আমার জন্য দোয়া করবেন, যেন আল্লাহ তায়ালা আমাকে খালেস নিয়ত দান করেন, এই পথে অবিচল রাখেন এবং আমার জ্ঞান ও শ্রমকে দ্বীন ও সমাজের কল্যাণে কবুল করেন।";

    return (
        <>
            <div className="w-full max-w-sm ml-auto">
                <div className="relative bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors flex items-start gap-4 cursor-pointer" onClick={() => setIsOpen(true)}>
                    {/* Image */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-emerald-500 to-indigo-500">
                            <img
                                src="/assets/dev.png"
                                alt="Rashedul Karim"
                                className="w-full h-full rounded-full object-cover border border-slate-900"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 space-y-1">
                        <div>
                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                রাশেদুল করিম
                            </h3>
                            <p className="text-slate-500 text-[10px] font-bold">সাবেক শিক্ষার্থী (ব্যাচ-২০১৮)</p>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {fullMessage}
                        </p>
                        <button
                            className="text-emerald-400 text-[10px] font-bold hover:text-emerald-300 flex items-center gap-1 transition-colors mt-1"
                        >
                            বিস্তারিত পড়ুন <ArrowRight size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col font-bengali"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <img src="/assets/dev.png" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900">রাশেদুল করিম</h4>
                                        <p className="text-xs font-bold text-slate-500">ডেভেলপার প্রোফাইল</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-wrap font-medium text-sm md:text-base">
                                    {fullMessage}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

const Footer = () => {
    const location = useLocation()
    const isAiPage = location.pathname === '/ai-chat' || location.pathname === '/ai-memorial'

    if (isAiPage) return null

    return (
        <footer className="bg-slate-900 text-slate-300 font-bengali pt-16 pb-8 border-t border-slate-800 mt-auto">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-600 to-emerald-500" />

            <div className="container mx-auto px-6 py-10 md:py-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-4 md:gap-16 pb-16 border-b border-white/5">
                    {/* About Column - Full width on mobile */}
                    <div className="col-span-2 lg:col-span-5 space-y-4 md:space-y-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white leading-none">সুফিয়া নূরীয়া</h3>
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 mt-1">দাখিল মাদ্রাসা</p>
                            </div>
                        </div>
                        <p className="text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                            একটি আধুনিক ও যুগোপযোগী দ্বীনি শিক্ষা প্রতিষ্ঠান। যেখানে ইসলামের শিক্ষার পাশাপাশি আধুনিক শিক্ষার সমন্বয় ঘটানো হয়।
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            {[
                                { icon: Facebook, color: 'hover:bg-[#1877F2]' },
                                { icon: Youtube, color: 'hover:bg-[#FF0000]' },
                                { icon: Twitter, color: 'hover:bg-[#1DA1F2]' }
                            ].map((social, i) => (
                                <button key={i} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all ${social.color} hover:text-white group`}>
                                    <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Column - Left side on mobile */}
                    <div className="col-span-1 lg:col-span-3 space-y-4 md:space-y-6">
                        <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4">প্রয়োজনীয় লিংক</h4>
                        <ul className="space-y-2 md:space-y-4">
                            {[
                                { label: 'হোম', path: '/' },
                                { label: 'শিক্ষক তালিকা', path: '/teachers' },
                                { label: 'নোটিশ বোর্ড', path: '/notices' },
                                { label: 'ভর্তি তথ্য', path: '/admission' },
                                { label: 'যোগাযোগ', path: '/contact' }
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-xs md:text-lg font-bold hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column - Right side on mobile */}
                    <div className="col-span-1 lg:col-span-4 space-y-4 md:space-y-6">
                        <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4">যোগাযোগ কেন্দ্র</h4>
                        <div className="space-y-4 md:space-y-6 text-xs md:text-lg">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start">
                                <MapPin size={16} className="text-emerald-500 md:hidden" />
                                <div className="w-10 h-10 bg-white/5 rounded-xl hidden md:flex items-center justify-center shrink-0">
                                    <MapPin size={20} className="text-emerald-500" />
                                </div>
                                <p className="font-bold">টেকনাফ, কক্সবাজার</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                                <Phone size={16} className="text-indigo-500 md:hidden" />
                                <div className="w-10 h-10 bg-white/5 rounded-xl hidden md:flex items-center justify-center shrink-0">
                                    <Phone size={20} className="text-indigo-500" />
                                </div>
                                <p className="font-bold break-all">01866495086</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                                <Mail size={16} className="text-purple-500 md:hidden" />
                                <div className="w-10 h-10 bg-white/5 rounded-xl hidden md:flex items-center justify-center shrink-0">
                                    <Mail size={20} className="text-purple-500" />
                                </div>
                                <p className="font-bold break-all">supianuriadakhilmadrasha@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom (Credits) */}
                <div className="pt-8 space-y-6">
                    {/* Developer Card Integrated Here - Aligned Right/Bottom */}
                    <DeveloperProfile />

                    <div className="text-center pt-8 border-t border-white/5">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                            © {new Date().getFullYear()} সুফিয়া নূরীয়া দাখিল মাদ্রাসা | All Rights Reserved
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">শুভেচ্ছান্তে:</span>
                            <span className="text-xs font-black text-white tracking-widest"> জে.ডি.সি ব্যাচ-২০১৮</span>
                            <Heart size={14} fill="#e11d48" color="#e11d48" className="animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
