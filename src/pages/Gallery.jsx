import React from 'react'
import { motion } from 'framer-motion'

const Gallery = () => {
    const images = [
        "https://images.unsplash.com/photo-1577563908411-5077b6cf7624?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1523050335456-cbb6e890ae0d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    ]

    return (
        <div className="min-h-screen bg-slate-50 py-32 font-bengali">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm"
                    >
                        Our Campus
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900">ফটোগ্যালারি</h2>
                    <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer"
                        >
                            <img
                                src={img}
                                alt={`Gallery ${i}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <p className="text-white font-black text-lg">মাদ্রাসার প্রাঙ্গণ</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gallery
