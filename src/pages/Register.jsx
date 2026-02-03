import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { User, Mail, Lock, Loader, ShieldCheck, UserPlus, ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'
import { motion } from 'framer-motion'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('student')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Determine collection based on role
            const collectionName = role === 'teacher' ? 'teachers' : 'students'

            await setDoc(doc(db, collectionName, user.uid), {
                id: user.uid,
                full_name: fullName,
                email: email,
                role: role,
                approved: false,
                createdAt: serverTimestamp()
            })

            toast.success('নিবন্ধন সফল! এডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।')
            navigate('/login')

        } catch (error) {
            console.error(error)
            toast.error('নিবন্ধন ব্যর্থ হয়েছে: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-bengali py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                    <div className="p-10 md:p-12">
                        <div className="text-center mb-10">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                className="inline-block relative mb-6"
                            >
                                <div className="absolute inset-0 bg-madrasha-primary/10 blur-2xl rounded-full" />
                                <Link to="/" className="relative z-10 block">
                                    <img src={logo} alt="Logo" className="w-20 h-20 mx-auto drop-shadow-xl" />
                                </Link>
                            </motion.div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">নতুন অ্যাকাউন্ট</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Create your portal account</p>
                        </div>

                        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6">
                            {/* Full Name field */}
                            <div className="space-y-2.5 group">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 px-1">
                                    <User size={16} className="text-madrasha-primary" /> শিক্ষার্থীর পুরো নাম
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-madrasha-primary focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 font-bold placeholder:text-slate-300 shadow-sm"
                                    placeholder="যেমন: আব্দুল্লাহ মানসুর"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email field */}
                            <div className="space-y-2.5 group">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 px-1">
                                    <Mail size={16} className="text-madrasha-primary" /> ইমেইল ঠিকানা
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-madrasha-primary focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 font-bold placeholder:text-slate-300 shadow-sm"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password field */}
                            <div className="space-y-2.5 group">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 px-1">
                                    <Lock size={16} className="text-madrasha-primary" /> পাসওয়ার্ড
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-madrasha-primary focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 font-bold placeholder:text-slate-300 shadow-sm"
                                    placeholder="কমপক্ষে ৬টি ক্যারেক্টার"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Role select */}
                            <div className="space-y-2.5 group">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 px-1">
                                    <ShieldCheck size={16} className="text-madrasha-primary" /> আপনি কে?
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-madrasha-primary focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 font-bold appearance-none shadow-sm cursor-pointer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="student">শিক্ষার্থী</option>
                                        <option value="teacher">শিক্ষক</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ArrowLeft size={18} className="-rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-madrasha-primary to-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 hover:translate-y-[-4px] active:translate-y-[0] transition-all flex items-center justify-center gap-3 group text-xl mt-4"
                                disabled={loading}
                            >
                                {loading ? <Loader className="animate-spin" size={24} /> : (
                                    <>নিবন্ধন করুন <UserPlus size={24} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                আগে থেকেই অ্যাকাউন্ট আছে? <Link to="/login" className="text-madrasha-primary font-black hover:underline px-2">লগইন করুন</Link>
                            </p>
                        </div>
                    </div>

                    <Link to="/" className="block py-6 bg-slate-50 text-center text-slate-400 hover:text-madrasha-primary hover:bg-slate-100 transition-all text-sm font-black border-t border-slate-100 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> হোম পেজে ফিরে যান
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
