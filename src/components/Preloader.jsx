import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const Preloader = ({ progress, message }) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center font-bengali">
            {/* 3D Book Animation Styles */}
            <style>{`
                .book-wrapper {
                    position: relative;
                    width: 100px;
                    height: 140px;
                    margin: 0 auto;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
                .book {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transform: rotateX(10deg);
                    animation: bookFloat 3s ease-in-out infinite;
                }
                .book-cover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border-radius: 4px 10px 10px 4px;
                    box-shadow: 
                        inset 4px 0 10px rgba(0,0,0,0.1),
                        inset -1px 0 2px rgba(255,255,255,0.3),
                        5px 5px 15px rgba(0,0,0,0.15);
                    z-index: 10;
                    transform-origin: left;
                    animation: coverOpen 2s ease-in-out infinite alternate;
                }
                .book-page {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 96%;
                    height: 96%;
                    background: #fff;
                    border-radius: 2px 8px 8px 2px;
                    z-index: 5;
                    transform-origin: left;
                    animation: pageFlip 2s ease-in-out infinite alternate;
                }
                .book-page:nth-child(2) { animation-delay: 0.1s; }
                .book-page:nth-child(3) { animation-delay: 0.2s; }

                .book-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #047857;
                    border-radius: 4px 10px 10px 4px;
                    transform: translateZ(-20px);
                    box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
                }

                @keyframes coverOpen {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(-160deg); }
                }
                @keyframes pageFlip {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(-155deg); }
                }
                @keyframes bookFloat {
                    0%, 100% { transform: rotateX(10deg) translateY(0); }
                    50% { transform: rotateX(10deg) translateY(-10px); }
                }
            `}</style>

            {/* Animated Gradient Background Rays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex flex-col items-center px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-8 mb-8 text-center"
                >
                    {/* Header: Logo and Name in One Line */}
                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                            <img src={logo} alt="Madrasa Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg" />
                        </div>

                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-2xl">
                                সুফিয়া নূরীয়া
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-6 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-[0.2em]">দাখিল মাদ্রাসা</span>
                            </div>
                        </div>
                    </div>

                    {/* 3D Book Animation */}
                    <div className="book-wrapper">
                        <div className="book">
                            <div className="book-cover"></div>
                            <div className="book-page"></div>
                            <div className="book-page"></div>
                            <div className="book-page"></div>
                            <div className="book-back"></div>
                        </div>
                    </div>

                    {/* Dynamic Message */}
                    <div className="relative w-64 md:w-80 text-center space-y-3 mt-4">
                        <motion.p
                            key={message}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-emerald-300 font-bold text-sm md:text-base tracking-wide h-6"
                        >
                            {message || 'লোডিং...'}
                        </motion.p>

                        {/* Progress Bar */}
                        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            {progress !== undefined ? (
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <motion.div
                                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                    animate={{ left: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Footer/Established */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 flex items-center gap-2 text-slate-500"
                >
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">Established 1975</p>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                </motion.div>
            </div>
        </div>
    )
}

export default Preloader
