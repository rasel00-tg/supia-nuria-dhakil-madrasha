import React from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Phone, Mail, MapPin, Send, Clock, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'

const Home = () => {
    const [committee, setCommittee] = useState([])
    const [memorable, setMemorable] = useState([])

    useEffect(() => {
        try {
            const unsubCommittee = onSnapshot(collection(db, 'committee'), (snap) => {
                setCommittee(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            }, (error) => console.error("Committee Fetch Error:", error))

            const unsubMemorable = onSnapshot(collection(db, 'memorable'), (snap) => {
                setMemorable(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            }, (error) => console.error("Memorable Fetch Error:", error))

            return () => {
                unsubCommittee();
                unsubMemorable();
            }
        } catch (error) {
            console.error("Firebase Init Error:", error)
        }
    }, [])

    const galleryImages = [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1577891720206-8800bbccdaef?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1523050853064-8521a30302b5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
    ]

    return (
        <div className="min-h-screen bg-white font-bengali selection:bg-madrasha-primary selection:text-white transition-all duration-300">
            {/* 2. Hero Section */}
            <Hero />

            {/* 3. Achievements Slider */}
            <section className="py-10 md:py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="container relative z-10 px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-sm">Success Stories</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">শিক্ষার্থীদের বিশেষ অর্জন</h2>
                        <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
                    </div>

                    <Swiper
                        spaceBetween={30}
                        slidesPerView={1}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        navigation={true}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="pb-16"
                    >
                        {galleryImages?.slice(0, 6).map((img, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative h-[300px] md:h-[400px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200"
                                >
                                    <img src={img} alt={`Achievement ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="bg-emerald-500 w-12 h-1 bg-emerald-500 mb-4 rounded-full" />
                                        <h4 className="text-white text-2xl font-black mb-2">প্রতিভাময় শিক্ষার্থী ২০২৬</h4>
                                        <p className="text-slate-300 font-bold">মাদ্রাসার সম্মান অক্ষুণ্ণ রাখতে আমাদের শিক্ষার্থীদের নিরলস প্রচেষ্টা।</p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* 4. পরিচালনা কমিটি */}
            <section className="py-10 md:py-24 bg-white">
                <div className="container px-6">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm">Administration</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">মাদ্রাসা পরিচালনা কমিটি</h2>
                        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                        {committee && committee.length > 0 ? (
                            committee.map((member, i) => (
                                <CommitteeCard key={member.id || i} member={member} index={i} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-slate-400">তথ্য লোড হচ্ছে...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. আমরা আপনাদের স্মরণ করি (Memorial) */}
            <section className="py-10 md:py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

                <div className="container relative z-10 px-6">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm">In Loving Memory</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white">আমরা আপনাদের স্মরণ করি</h2>
                        <p className="text-slate-400 font-bold max-w-2xl mx-auto">যাঁদের অক্লান্ত পরিশ্রম ও ত্যাগের বিনিময়ে এই প্রতিষ্ঠান আজ এই অবস্থানে।</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8">
                        {memorable && memorable.length > 0 ? (
                            memorable.map((person, i) => (
                                <MemorialCard key={person.id || i} person={person} index={i} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-slate-500 font-bold py-10">তথ্য লোড হচ্ছে...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* 6. Contact Section */}
            <section id="contact" className="py-12 md:py-32 bg-slate-50 relative">
                <div className="container px-2 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-[20px] md:rounded-[48px] shadow-2xl shadow-indigo-500/10 overflow-hidden grid grid-cols-2 max-w-6xl mx-auto border border-white"
                    >
                        {/* Left Side: Form (White) */}
                        <div className="col-span-1 p-4 md:p-16 bg-white relative border-r border-slate-50">
                            <div className="space-y-4 md:space-y-8 max-w-lg">
                                <div className="space-y-1 md:space-y-2">
                                    <span className="text-emerald-600 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-xs">Contact</span>
                                    <h2 className="text-lg md:text-5xl font-black text-slate-800 leading-tight">মেসেজ</h2>
                                    <div className="w-10 md:w-24 h-1 md:h-1.5 bg-emerald-500 rounded-full" />
                                </div>

                                <form className="space-y-4 md:space-y-10 pt-2 md:pt-4">
                                    <div className="space-y-3 md:space-y-6">
                                        <div className="group relative">
                                            <input
                                                className="peer w-full py-2 md:py-4 border-b border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold text-[10px] md:text-base"
                                                type="text"
                                                id="name"
                                                placeholder="Name"
                                            />
                                            <label htmlFor="name" className="absolute left-0 -top-2 md:-top-3.5 text-slate-400 text-[8px] md:text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-[10px] md:peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 md:peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-focus:-top-2 md:peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-[8px] md:peer-focus:text-xs peer-focus:font-black">
                                                নাম
                                            </label>
                                        </div>

                                        <div className="group relative">
                                            <input
                                                className="peer w-full py-2 md:py-4 border-b border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold text-[10px] md:text-base"
                                                type="email"
                                                id="email"
                                                placeholder="Email"
                                            />
                                            <label htmlFor="email" className="absolute left-0 -top-2 md:-top-3.5 text-slate-400 text-[8px] md:text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-[10px] md:peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 md:peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-focus:-top-2 md:peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-[8px] md:peer-focus:text-xs peer-focus:font-black">
                                                ইমেইল
                                            </label>
                                        </div>

                                        <div className="group relative">
                                            <textarea
                                                className="peer w-full py-2 md:py-4 border-b border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold resize-none h-16 md:h-32 text-[10px] md:text-base"
                                                id="message"
                                                placeholder="Message"
                                            ></textarea>
                                            <label htmlFor="message" className="absolute left-0 -top-2 md:-top-3.5 text-slate-400 text-[8px] md:text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-[10px] md:peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 md:peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-focus:-top-2 md:peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-[8px] md:peer-focus:text-xs peer-focus:font-black">
                                                বার্তা
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="px-4 py-2 md:px-10 md:py-4 bg-slate-900 text-white font-black rounded-full shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] group text-[10px] md:text-base w-full md:w-auto"
                                    >
                                        SEND <Send size={12} className="group-hover:translate-x-1 md:w-5 md:h-5 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Side: Info (Dark) */}
                        <div className="col-span-1 bg-slate-900 text-white p-4 md:p-16 flex flex-col justify-start md:justify-between relative overflow-hidden space-y-6 md:space-y-12">
                            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-emerald-500/10 rounded-full blur-[40px] md:blur-[80px] -mr-16 md:-mr-32 -mt-16 md:-mt-32 pointer-events-none" />

                            <div className="relative z-10 space-y-4 md:space-y-10">
                                <h3 className="text-sm md:text-2xl font-black uppercase tracking-widest text-emerald-400">Info</h3>

                                <div className="space-y-4 md:space-y-8">
                                    <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                                            <Phone size={14} className="md:w-6 md:h-6" />
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</h4>
                                            <p className="text-[10px] md:text-xl font-bold break-all leading-tight">01866495086</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                                            <Mail size={14} className="md:w-6 md:h-6" />
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1 w-full min-w-0">
                                            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Email</h4>
                                            <p className="text-[10px] md:text-xl font-bold break-all leading-tight">supianuriadhakil...</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-purple-400">
                                            <MapPin size={14} className="md:w-6 md:h-6" />
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Address</h4>
                                            <p className="text-[10px] md:text-lg font-bold leading-tight">টেকনাফ, কক্সবাজার</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    )
}

const CommitteeCard = ({ member, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isLong = member.quote && member.quote.length > 60;

    return (
        <div className="relative group">
            {/* Animated Border Gradient */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600 rounded-[26px] md:rounded-[50px] opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white p-4 md:p-8 rounded-[24px] md:rounded-[48px] text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:shadow-[inset_0_0_60px_rgba(99,102,241,0.05)] transition-all duration-500" />

                <div className="relative inline-block mb-3 md:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <img src={member.imageUrl || logo} alt={member.name} className="relative w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-50 group-hover:border-indigo-500/20 shadow-xl mx-auto transition-colors duration-500" />
                </div>

                <h4 className="relative text-sm md:text-2xl font-black text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{member.name}</h4>
                <div className="relative inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[8px] md:text-xs uppercase tracking-widest mb-3 md:mb-4 border border-emerald-100 self-center">
                    {member.designation}
                </div>

                <div className="relative text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed flex-grow">
                    <span className="text-indigo-400 text-xl font-serif">"</span>
                    {member.quote?.slice(0, 60)}
                    {isLong && '...'}
                    <span className="text-indigo-400 text-xl font-serif">"</span>
                </div>

                {isLong && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative mt-4 px-4 py-2 bg-slate-50 hover:bg-emerald-600 text-slate-600 hover:text-white rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300 border border-slate-100 hover:border-emerald-500 self-center"
                    >
                        বিস্তারিত পড়ুন
                    </button>
                )}
            </motion.div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-6 md:p-10 max-w-lg w-full relative overflow-hidden text-center shadow-2xl border border-white/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-emerald-100 mb-4 overflow-hidden shadow-xl">
                            <img src={member.imageUrl || logo} className="w-full h-full object-cover" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-1">{member.name}</h3>
                        <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6">{member.designation}</p>

                        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl relative border border-slate-100">
                            <span className="absolute top-2 left-4 text-4xl md:text-6xl text-emerald-200 font-serif opacity-50">"</span>
                            <p className="text-slate-600 leading-relaxed relative z-10 font-medium text-sm md:text-base">
                                {member.quote}
                            </p>
                            <span className="absolute bottom-2 right-4 text-4xl md:text-6xl text-emerald-200 font-serif opacity-50">"</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

const MemorialCard = ({ person, index }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = person.contribution && person.contribution.length > 80;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl p-4 md:p-10 rounded-[24px] md:rounded-[48px] border border-white/10 flex flex-col items-center gap-3 md:gap-6 hover:bg-white/10 transition-all group h-full relative"
        >
            <div className="absolute top-6 left-6 w-8 h-8 md:w-12 md:h-12 border-l border-t border-emerald-500/30 rounded-tl-xl" />
            <div className="absolute bottom-6 right-6 w-8 h-8 md:w-12 md:h-12 border-r border-b border-indigo-500/30 rounded-br-xl" />

            <div className="flex items-center gap-2 md:gap-4 self-start md:self-center w-full justify-center">
                <img src={person.imageUrl || logo} alt={person.name} className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow-2xl" />
                <p className="text-emerald-400 font-black text-[10px] md:text-lg">শ্রদ্ধাঞ্জলি</p>
            </div>
            <div className="text-center w-full space-y-1 md:space-y-2">
                <h4 className="text-base md:text-3xl font-black text-white">{person.name}</h4>
                <p className="text-rose-400 font-black text-[10px] md:text-sm uppercase tracking-widest">মৃত্যু: {person.year}</p>
                <div className="text-slate-300 font-medium text-[10px] md:text-base leading-relaxed mt-2 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {expanded ? person.contribution : (person.contribution?.slice(0, 80) || '')}
                    {isLong && !expanded && '...'}
                </div>
                {isLong && (
                    <button onClick={() => setExpanded(!expanded)} className="text-emerald-400 text-xs font-bold mt-2 hover:underline p-2">
                        {expanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত পড়ুন'}
                    </button>
                )}
            </div>
        </motion.div>
    )
}

export default Home
