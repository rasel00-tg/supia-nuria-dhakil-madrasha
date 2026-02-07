import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const Preloader = ({ progress }) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center font-bengali">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -20 }}
                    animate={{
                        scale: [0.8, 1.1, 1],
                        opacity: 1,
                        rotate: 0
                    }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut"
                    }}
                    className="w-32 h-32 md:w-40 md:h-40 relative z-10"
                >
                    <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-center mt-12 space-y-3"
                >
                    <h2 className="text-3xl font-black text-white tracking-tight">সুফিয়া নূরীয়া</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">দাখিল মাদ্রাসা</p>
                </motion.div>

                {/* Progress Bar or Infinite Loader */}
                <div className="mt-12 w-64">
                    {progress !== undefined ? (
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.2 }}
                            />
                            <p className="text-center text-emerald-400 font-bold text-xs mt-2">{Math.round(progress)}% Uploading...</p>
                        </div>
                    ) : (
                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative mx-auto">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-indigo-500"
                                initial={{ width: '0%', left: '0%' }}
                                animate={{
                                    width: ['10%', '60%', '100%'],
                                    left: ['0%', '0%', '0%']
                                }}
                                transition={{
                                    duration: 2.5,
                                    ease: "easeInOut",
                                    repeat: Infinity
                                }}
                            />
                        </div>
                    )}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-slate-500 font-bold text-xs uppercase tracking-widest"
                >
                    সুফিয়া নূরীয়া দাখিল মাদ্রাসা লোডিং হচ্ছে....
                </motion.p>
            </div>
        </div>
    )
}

export default Preloader

