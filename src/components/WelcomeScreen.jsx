import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

const WelcomeScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onComplete, 500) // Wait for exit animation
        }, 1500) // Show for 1.5s total

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 h-screen w-full z-[99999] flex flex-col items-center justify-center font-bengali p-4 text-center"
                    style={{
                        backgroundImage: `url('/assets/welcome.png?v=${new Date().getTime()}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'transparent'
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        {/* Logo */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-xl p-4 flex items-center justify-center">
                            <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2">
                            <h2 className="text-xl md:text-2xl font-black text-white">আসসালামু আলাইকুম</h2>
                            <h1 className="text-lg md:text-xl font-bold text-slate-100">
                                সুফিয়া নূরীয়া দাখিল মাদ্রাসার অফিসিয়াল ওয়েবসাইটে আপনাকে স্বাগতম
                            </h1>
                        </div>

                        {/* Quranic Verse */}
                        <div className="mt-8 md:mt-12 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                            <p className="text-emerald-300 font-bold text-sm md:text-base">
                                "পড় তোমার প্রভুর নামে যিনি তোমাকে সৃষ্টি করেছেন"
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default WelcomeScreen
