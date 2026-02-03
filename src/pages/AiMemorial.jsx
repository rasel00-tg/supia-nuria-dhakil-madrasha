import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const AiMemorial = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-bengali p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="max-w-4xl w-full relative z-10">
                <Link
                    to="/ai-chat"
                    className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    ফিরে যান
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-emerald-500/30 p-1 mx-auto mb-8 relative group">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <img src="/assets/ai.png" alt="Hafez Mohammad Emran" className="w-full h-full rounded-full object-cover bg-slate-800 relative z-10" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-3 text-emerald-400 font-serif">হাফেজ মোহাম্মদ ইমরান</h2>
                    <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm mb-10">জেডিসি ব্যাচ 2018</p>

                    <div className="space-y-6 text-slate-300 leading-relaxed text-lg md:text-xl font-medium max-w-3xl mx-auto">
                        <p>
                            আমাদের জীবনের কিছু মানুষ থাকে, যাদের উপস্থিতি খুব অল্প সময়ের হলেও তাদের শূন্যতা সারাজীবনের জন্য থেকে যায়।
                        </p>
                        <p>
                            জে.ডি.সি ব্যাচ 2018ইং–এর একজন সহপাঠী ছিল আমাদের—মোহাম্মদ ইমরান। 2018 সালেই সে অকাল মৃত্যুবরণ করে আমাদের সবাইকে শোকের এক নীরব অধ্যায়ের ভেতর ফেলে যায়।
                        </p>
                        <p>
                            ইমরান শুধু একজন সহপাঠীই ছিল না, সে ছিল আল্লাহর কালাম বহনকারী—একজন পরিপূর্ণ হাফেজে কুরআন। যার মুখে কুরআনের তিলাওয়াত ছিল, যার হৃদয়ে ছিল তাকওয়ার আলো। হয়তো আল্লাহ তাকে খুব ভালোবেসেছিলেন বলেই দুনিয়ার মায়া কম দিয়ে এত তাড়াতাড়ি নিজের কাছে ডেকে নিয়েছেন।
                        </p>
                        <p>
                            আজ অনেক বছর পেরিয়ে গেছে। সময়ের স্রোত অনেক কিছু বদলে দিয়েছে, কিন্তু ইমরানের স্মৃতি মুছে যায়নি। ক্লাসরুম, মাদ্রাসার আঙিনা, সহপাঠীদের আড্ডা—সব জায়গায় তার না-থাকার অনুভূতি আজও গভীরভাবে টের পাই।
                        </p>
                        <p>
                            কিছু মৃত্যু কেবল মানুষকে নেয় না, বরং রেখে যায় প্রশ্ন, কষ্ট আর নীরব দীর্ঘশ্বাস। ইমরানের মৃত্যু আমাদের শিখিয়েছে—জীবন খুবই ক্ষণস্থায়ী, আর সবচেয়ে বড় সৌভাগ্য হলো আল্লাহর কালাম বুকে নিয়ে দুনিয়া ছাড়তে পারা।
                        </p>
                        <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/20 mt-8">
                            <p className="text-emerald-300 font-serif italic text-xl md:text-2xl leading-relaxed">
                                "হে আল্লাহ, আমাদের প্রিয় সহপাঠী মোহাম্মদ ইমরানকে জান্নাতুল ফেরদৌস নসিব করুন, তার কবরকে প্রশস্ত করুন, নূরে ভরিয়ে দিন, আর কুরআনকে তার জন্য শাফায়াতকারী বানিয়ে দিন। আর আমাদের জন্য রেখে যাওয়া তার স্মৃতিকে কবুল করুন—যেন তা আমাদের গুনাহ থেকে ফেরায়, আখিরাতের কথা মনে করিয়ে দেয়। আমিন।"
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-2 text-slate-500 text-sm font-bold">
                        <Heart size={16} className="text-rose-500 fill-rose-500 animate-pulse" />
                        স্মরণে: সকল সহপাঠী (জে.ডি.সি ব্যাচ-১৮)
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AiMemorial
