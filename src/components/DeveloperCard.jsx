import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote, ArrowRight } from 'lucide-react';
import devImg from '../assets/dev.png';

const DeveloperCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const fullMessage = "আমি রাশেদুল করিম—দীর্ঘ ৯ বছর আমার জীবনের মূল্যবান সময় কাটিয়েছি সুফিয়া নূরীয়া দাখিল মাদ্রাসার পাঠশালায়। এই প্রতিষ্ঠান আমার কাছে কেবল একটি শিক্ষাকেন্দ্র ছিল না; এটি ছিল আমার চরিত্র গঠনের সূতিকাগার, আদব ও শালীনতার প্রথম পাঠশালা, এবং জীবনবোধের শক্ত ভিত। এখানকার প্রতিটি শিক্ষক, প্রতিটি শ্রেণিকক্ষ, প্রতিটি স্মৃতি আজও আমাকে নীরবে দায়বদ্ধ করে রাখে। এই দীর্ঘ পথচলার ঋণ কোনো কথায় শোধ হওয়ার নয়। তবুও একজন সাবেক শিক্ষার্থী হিসেবে দায়িত্ববোধ ও কৃতজ্ঞতার জায়গা থেকেই আমি আমার প্রিয় সুফিয়া নূরীয়া দাখিল মাদ্রাসার জন্য এই ওয়েবসাইটটি উপহার হিসেবে প্রদান করেছি। এটি নিছক প্রযুক্তিগত কাজ নয়; এটি আমার অতীতের প্রতি সম্মান, বর্তমানের প্রতি দায়বদ্ধতা এবং ভবিষ্যৎ প্রজন্মের প্রতি এক সুস্পষ্ট অঙ্গীকার। এই ওয়েবসাইটের মাধ্যমে আমাদের ভাই ও বোনেরা সময়ের বাস্তবতায় দাঁড়িয়ে আধুনিক ডিজিটাল ব্যবস্থায় পড়াশোনা করতে পারবে, প্রয়োজনীয় তথ্য পাবে সহজ ও শৃঙ্খলিতভাবে, এবং জ্ঞান অর্জনের পথ আরও বিস্তৃত হবে। এই কাজের মধ্য দিয়েই আমি আমার জীবনের পথ নির্ধারণ করেছি। ওয়েব ও সফটওয়্যার ডেভেলপমেন্টকে কেন্দ্র করে আমি আমার জীবনের যাত্রা শুরু করেছি—এই বিশ্বাস নিয়ে যে প্রযুক্তি যদি নীতিবোধ ও সঠিক উদ্দেশ্যের সাথে যুক্ত হয়, তবে তা শিক্ষা ও সমাজের কল্যাণে শক্তিশালী ভূমিকা রাখতে পারে। এই উদ্যোগ সেই বিশ্বাসেরই প্রথম বাস্তব প্রয়োগ। আমি দৃঢ়ভাবে বিশ্বাস করি—যে প্রতিষ্ঠান আমাদের মানুষ করে তোলে, তার উন্নয়নে ভূমিকা রাখা কোনো দয়া নয়, বরং নৈতিক कर्तव्य। এটি হয়তো একটি ক্ষুদ্র উপহার, কিন্তু এর পেছনে রয়েছে দীর্ঘ নয় বছরের স্মৃতি, আত্মিক টান এবং ভবিষ্যতের প্রতি গভীর দায়বদ্ধতা। আপনাদের সকলের কাছে বিনীত অনুরোধ—আমার জন্য দোয়া করবেন, যেন আল্লাহ তায়ালা আমাকে খালেস নিয়ত দান করেন, এই পথে অবিচল রাখেন এবং আমার জ্ঞান ও শ্রমকে দ্বীন ও সমাজের কল্যাণে কবুল করেন।";

    return (
        <div className="w-full relative z-20 -mt-10 mb-10 px-6 font-bengali">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

                    <div className="relative flex flex-col lg:flex-row gap-10 items-center">
                        {/* Profile Image with Ring */}
                        <div className="shrink-0 relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
                            <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-700">
                                <img
                                    src={devImg}
                                    alt="Rashedul Karim"
                                    className="w-full h-full rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border-2 border-white shadow-lg">
                                Developer
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 justify-center lg:justify-start">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">রাশেদুল করিম</h3>
                                <span className="hidden lg:block w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                <p className="text-emerald-600 font-bold">সাবেক শিক্ষার্থী (জে.ডি.সি ব্যাচ-২০১৮)</p>
                            </div>

                            <div className="relative">
                                <Quote size={40} className="absolute -top-4 -left-6 text-slate-100 dark:text-slate-800 -z-10" />
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-4 text-sm md:text-base text-justify">
                                    {fullMessage}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpen(true)}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold group text-sm md:text-base transition-colors"
                            >
                                বিস্তারিত পড়ুন
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                                <div className="flex items-center gap-4">
                                    <img src={devImg} alt="Dev" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white">রাশেদুল করিম</h4>
                                        <p className="text-xs font-bold text-emerald-600">জে.ডি.সি ব্যাচ-২০১৮</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body (Scrollable) */}
                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p className="text-justify leading-relaxed whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300">
                                        {fullMessage}
                                    </p>

                                    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 text-center">
                                        <p className="text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                                            "শিক্ষা ও প্রযুক্তির সমন্বয়ে আমরা গড়বো আগামীর স্মার্ট বাংলাদেশ।"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeveloperCard;
