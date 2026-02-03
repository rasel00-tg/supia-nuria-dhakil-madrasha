import React from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

const Home = () => {
    const committee = [
        { name: 'হাজী আব্দুল লতিফ', role: 'সভাপতি', img: 'https://i.pravatar.cc/150?u=1', bio: 'মাদ্রাসার সার্বিক উন্নয়নে নিবেদিত।' },
        { name: 'মাওলানা আব্দুল মান্নান', role: 'মুহতামিম', img: 'https://i.pravatar.cc/150?u=2', bio: 'অভিজ্ঞ ইসলামী চিন্তাবিদ ও শিক্ষা সংস্কারক।' },
        { name: 'মোঃ আব্দুর রশিদ', role: 'সেক্রেটারি', img: 'https://i.pravatar.cc/150?u=3', bio: 'প্রশাসনিক কাজের দক্ষ পরিচালক।' },
        { name: 'মোঃ খলিলুর রহমান', role: 'কোষাধ্যক্ষ', img: 'https://i.pravatar.cc/150?u=4', bio: 'আর্থিক হিসাব ব্যবস্থাপনায় নিয়োজিত।' },
    ]

    const memorial = [
        { name: 'মাওলানা আবুল হাশেম', role: 'প্রতিষ্ঠাতা মুহতামিম', year: '২০১২', achievements: 'মাদ্রাসার ভিত্তি স্থাপন ও প্রাথমিক বিস্তার।', img: 'https://i.pravatar.cc/150?u=11' },
        { name: 'হাজী মোঃ ইউসুফ', role: 'সাবেক সভাপতি', year: '২০১৫', achievements: 'একাডেমিক ভবনের অন্যতম দাতা।', img: 'https://i.pravatar.cc/150?u=12' },
    ]

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
                        {galleryImages.slice(0, 6).map((img, index) => (
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
                        {committee.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-slate-50 p-4 md:p-8 rounded-[24px] md:rounded-[48px] text-center hover:bg-white hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 border border-transparent hover:border-slate-100"
                            >
                                <div className="relative inline-block mb-3 md:mb-6">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <img src={member.img} alt={member.name} className="relative w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl mx-auto" />
                                </div>
                                <h4 className="text-sm md:text-2xl font-black text-slate-900 mb-1 line-clamp-1">{member.name}</h4>
                                <p className="text-indigo-600 font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-4 line-clamp-1">{member.role}</p>
                                <Link to="#" className="inline-block px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-[10px] md:text-xs font-black rounded-full transition-all duration-300">বিস্তারিত</Link>
                            </motion.div>
                        ))}
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

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8">
                        {memorial.map((person, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-white/5 backdrop-blur-xl p-4 md:p-10 rounded-[24px] md:rounded-[48px] border border-white/10 flex flex-col items-center gap-3 md:gap-6 hover:bg-white/10 transition-all group h-full"
                            >
                                <div className="flex items-center gap-2 md:gap-4 self-start md:self-center w-full justify-center">
                                    <img src={person.img} alt={person.name} className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors" />
                                    <p className="text-emerald-400 font-black text-[10px] md:text-lg">শ্রদ্ধাঞ্জলি</p>
                                </div>
                                <div className="text-center w-full space-y-1 md:space-y-2">
                                    <h4 className="text-sm md:text-3xl font-black text-white">{person.name}</h4>
                                    <p className="text-rose-400 font-black text-[10px] md:text-sm uppercase tracking-widest">মৃত্যু: {person.year}</p>
                                    <p className="text-slate-300 font-medium text-[10px] md:text-base leading-relaxed mt-2">অবদান বিস্তারিত</p>
                                </div>
                            </motion.div>
                        ))}
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

export default Home
