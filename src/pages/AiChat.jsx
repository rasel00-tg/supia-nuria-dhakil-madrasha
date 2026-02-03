import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

const AiChat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'আসসালামু আলাইকুম! আমি ইমরান। আমি সুফিয়া নূরীয়া দাখিল মাদ্রাসার AI এসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?', sender: 'ai' }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const quickQuestions = [
        "আপনি কি নতুন ভর্তি আবেদন সম্পর্কে জানতে চান?",
        "আপনি কি মাদ্রাসার ইতিহাস সম্পর্কে জানতে চান?",
        "আপনি কি অ্যাকাউন্ট লগইন সমস্যা সংক্রান্ত তথ্য জানতে চান?",
        "আপনি মাদ্রাসার অফিস প্রতিনিধির সাথে যোগাযোগ করতে চান?"
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSendMessage = async (text) => {
        if (!text.trim()) return

        // Add user message
        const userMsg = { id: Date.now(), text: text, sender: 'user' }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        // Simulate AI response logic
        setTimeout(() => {
            let aiResponseText = "দুঃখিত, আমি এই বিষয়ে বিস্তারিত জানি না। তবে অফিস চলাকালীন সময়ে ০১৮৬৬৪৯৫০৮৬ নাম্বারে কল করে বিস্তারিত জানতে পারবেন।"

            if (text.includes("ভর্তি") || text.includes("আবেদন")) {
                aiResponseText = "২০২৫ শিক্ষাবর্ষের নতুন ভর্তি কার্যক্রম চলছে। আপনি হোম পেজের 'ভর্তি আবেদন' বাটন থেকে অনলাইনে আবেদন করতে পারবেন। এছাড়া সরাসরি মাদ্রাসার অফিস থেকেও ফরম সংগ্রহ করা যাবে।"
            } else if (text.includes("ইতিহাস") || text.includes("সম্পর্কে")) {
                aiResponseText = "সুফিয়া নূরীয়া দাখিল মাদ্রাসা ১৯৭৫ সালে প্রতিষ্ঠিত হয়। এটি টেকনাফ, কক্সবাজারের একটি ঐতিহ্যবাহী দ্বীনি শিক্ষা প্রতিষ্ঠান। মরহুম মাওলানা আবুল হাশেম (রহ.) এই মাদ্রাসার প্রতিষ্ঠাতা।"
            } else if (text.includes("লগইন") || text.includes("সমস্যা") || text.includes("পাসওয়ার্ড")) {
                aiResponseText = "লগইন সমস্যার জন্য দয়া করে চেক করুন আপনার পাসওয়ার্ড সঠিক কিনা। ৫ বার ভুল পাসওয়ার্ড দিলে ১ ঘন্টার জন্য একাউন্ট লক হয়ে যাবে। পাসওয়ার্ড ভুলে গেলে লগইন পেজের 'পাসওয়ার্ড ভুলে গেছেন?' অপশনটি ব্যবহার করুন অথবা অফিসে যোগাযোগ করুন।"
            } else if (text.includes("যোগাযোগ") || text.includes("অফিস") || text.includes("প্রতিনিধি")) {
                aiResponseText = "যেকোনো প্রয়োজনে আমাদের অফিসে যোগাযোগ করুন। \nঠিকানা: নতুন পল্লান পাড়া, টেকনাফ। \nমোবাইল: ০১৮৬৬৪৯৫০৮৬ (সুপার), ০১৮১৭২৭২৩৩৭ (সভাপতি)।"
            } else if (text.includes("সালাম") || text.includes("assalamu")) {
                aiResponseText = "ওয়ালাইকুম আসসালাম! আপনার দিনটি শুভ হোক। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
            }

            const aiMsg = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-bengali flex flex-col md:flex-row relative">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-screen md:pl-0 relative z-0">

                {/* Header */}
                <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full p-0.5 relative">
                            <img src="/assets/ai.png" alt="AI" className="w-full h-full rounded-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">EMRAN <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full ml-1">AI Assistant</span></h1>
                            <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                অনলাইন
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50 scroll-smooth">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>
                                    {msg.sender === 'user' ? <User size={18} className="text-indigo-600" /> : <img src="/assets/ai.png" alt="AI" className="w-full h-full rounded-full object-cover border-2 border-white" />}
                                </div>
                                <div className={`p-4 md:p-6 rounded-[24px] shadow-sm text-sm md:text-base font-medium leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-indigo-200'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-200'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Default Questions */}
                    {messages.length < 2 && (
                        <div className="grid grid-cols-1 gap-3 mt-6 max-w-2xl mx-auto px-2">
                            <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-2">দ্রুত প্রশ্ন করুন</p>
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(q)}
                                    className="text-left p-4 bg-white border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-[0.98] text-sm font-bold flex items-center justify-between group"
                                >
                                    {q}
                                    <Send size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                    <img src="/assets/ai.png" alt="AI" className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-white p-4 rounded-[24px] rounded-bl-none border border-slate-200 shadow-sm flex gap-1.5 items-center h-12">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                    <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                            placeholder="এখানে আপনার প্রশ্ন লিখুন..."
                            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-full px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-inner"
                        />
                        <button
                            onClick={() => handleSendMessage(inputText)}
                            disabled={!inputText.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>

                {/* Memorial Link Footer */}
                <div className="bg-slate-50 py-2 text-center">
                    <Link
                        to="/ai-memorial"
                        className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                    >
                        <Info size={12} />
                        AI ইমরান সম্পর্কে জানুন
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AiChat
