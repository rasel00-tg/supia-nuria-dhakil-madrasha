import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'

const AiFloatingButton = () => {
    const location = useLocation()

    // Hide button if already on the chat page or memorial page
    if (location.pathname === '/ai-chat' || location.pathname === '/ai-memorial') return null

    return (
        <Link to="/ai-chat">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white pl-4 pr-1 py-1 rounded-full shadow-2xl shadow-emerald-900/20 border border-emerald-100 group cursor-pointer"
            >
                <div className="flex flex-col items-start leading-none mr-2">
                    <span className="text-[10px] font-bold text-slate-400">চ্যাট করুন</span>
                    <span className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">AI EMRAN</span>
                </div>

                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-500 transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                    <Bot size={24} className="relative z-10" />

                    {/* Online indicator */}
                    <span className="absolute top-2 right-3 w-2 h-2 bg-emerald-300 rounded-full border border-emerald-600 z-20"></span>
                </div>
            </motion.div>
        </Link>
    )
}

export default AiFloatingButton
