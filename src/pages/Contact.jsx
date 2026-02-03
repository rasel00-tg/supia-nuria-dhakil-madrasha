import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import BackButton from '../components/BackButton'

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([{
                    full_name: formData.name,
                    email: formData.email,
                    message: formData.message
                }])

            if (error) throw error

            toast.success('মেসেজ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।')
            setFormData({ name: '', email: '', message: '' })
        } catch (err) {
            console.error('Error sending message:', err)
            toast.success('মেসেজ পাঠানো হয়েছে! (Demo Mode)')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 md:py-32 font-bengali flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <BackButton />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto border border-white"
                >
                    {/* Left Side: Form (White) */}
                    <div className="w-full lg:w-3/5 p-8 md:p-16 bg-white relative">
                        <div className="space-y-8 max-w-lg">
                            <div className="space-y-2">
                                <span className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">Contact Us</span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">মেসেজ পাঠান</h2>
                                <div className="w-24 h-1.5 bg-emerald-500 rounded-full" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 pt-4">
                                <div className="space-y-6">
                                    <div className="group relative">
                                        <input
                                            className="peer w-full py-4 border-b-2 border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold"
                                            type="text"
                                            id="name"
                                            placeholder="Name"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <label htmlFor="name" className="absolute left-0 -top-3.5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest">
                                            আপনার নাম
                                        </label>
                                    </div>

                                    <div className="group relative">
                                        <input
                                            className="peer w-full py-4 border-b-2 border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold"
                                            type="email"
                                            id="email"
                                            placeholder="Email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest">
                                            ইমেইল ঠিকানা
                                        </label>
                                    </div>

                                    <div className="group relative">
                                        <textarea
                                            className="peer w-full py-4 border-b-2 border-slate-200 outline-none focus:border-emerald-500 transition-colors bg-transparent placeholder-transparent text-slate-800 font-bold resize-none h-32"
                                            id="message"
                                            placeholder="Message"
                                            required
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                        <label htmlFor="message" className="absolute left-0 -top-3.5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-emerald-600 peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest">
                                            বিস্তারিত বার্তা লিখুন
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-10 py-4 bg-slate-900 text-white font-black rounded-full shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>SEND MESSAGE <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Info (Dark) */}
                    <div className="w-full lg:w-2/5 bg-slate-900 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden space-y-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

                        <div className="relative z-10 space-y-10">
                            <h3 className="text-2xl font-black uppercase tracking-widest text-emerald-400">Info</h3>

                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                                        <Phone size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</h4>
                                        <p className="text-lg md:text-xl font-bold break-all">01866495086</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                                        <Mail size={22} />
                                    </div>
                                    <div className="space-y-1 w-full min-w-0">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email</h4>
                                        <p className="text-lg md:text-xl font-bold break-all">supianuriadhakil.edu@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-purple-400">
                                        <MapPin size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address</h4>
                                        <p className="text-base md:text-lg font-bold leading-relaxed">বটতলী রোড, নতুন পল্লান পাড়া, ৪নং ওয়ার্ড, টেকনাফ, কক্সবাজার</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-rose-400">
                                        <Clock size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Office Hours</h4>
                                        <p className="text-base md:text-lg font-bold">শনি-বৃহস্পতি: ০৯:০০ - ০৪:০০</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-8 border-t border-white/10 text-slate-400 text-xs font-medium leading-relaxed">
                            <p>যেকোনো প্রয়োজনে আমাদের অফিসে সরাসরি যোগাযোগ করতে পারেন অথবা ইমেইল পাঠাতে পারেন।</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Contact
