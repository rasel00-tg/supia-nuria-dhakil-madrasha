import React, { useRef, useState, useEffect } from 'react'
import { Printer, Download, Calendar } from 'lucide-react'
import html2canvas from 'html2canvas'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'

const Routine = () => {
    const componentRef = useRef()
    const [loading, setLoading] = useState(true)
    const [scale, setScale] = useState(1)
    const [examData, setExamData] = useState({
        name: 'বার্ষিক পরীক্ষা - ২০২৬',
        date: 'শুরু: ১২ ডিসেম্বর, ২০২৫',
        rules: [
            'পরীক্ষা শুরুর ৩০ মিনিট আগে কেন্দ্রে উপস্থিত হতে হবে।',
            'প্রবেশপত্র ছাড়া পরীক্ষায় অংশগ্রহণ করা যাবে না।',
            'ইলেকট্রনিক ডিভাইস সম্পূর্ণ নিষিদ্ধ।'
        ],
        imageUrl: null,
        routine: []
    })

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const docRef = doc(db, 'settings', 'exam_routine')
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setExamData(docSnap.data())
                }
            } catch (error) {
                console.error("Error fetching routine:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchRoutine()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const contentWidth = 955
            const screenWidth = window.innerWidth
            // Scale to fit screen with margin
            if (screenWidth < contentWidth + 32) {
                setScale((screenWidth - 32) / contentWidth)
            } else {
                setScale(1)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = async () => {
        const element = componentRef.current
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            backgroundColor: '#ffffff',
            useCORS: true,
            windowWidth: 955,
            onclone: (document) => {
                const el = document.querySelector('.print-content')
                if (el) {
                    el.style.transform = 'none' // Reset scale for capture
                    el.style.margin = '0'
                    el.style.boxShadow = 'none'
                }
            }
        })

        const data = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = data
        link.download = `Routine_${new Date().getFullYear()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-slate-50 font-bengali pb-40">
            <style>{`
                @media print {
                    @page { size: auto; margin: 5mm; }
                    body { visibility: hidden; }
                    .print-wrapper { 
                        visibility: visible; 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        height: auto; 
                        display: block !important;
                    }
                    .print-content {
                        width: 100% !important;
                        min-height: auto !important;
                        transform: none !important;
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                    }
                    .print-content * { visibility: visible; }
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* Top Navigation Row */}
            <div className="p-4 md:p-6 no-print">
                <BackButton />
            </div>

            {/* Main Content Area with Scale Logic */}
            <div className="w-full flex justify-center overflow-hidden py-4 print-wrapper">
                <div
                    ref={componentRef}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 print-content flex flex-col justify-between origin-top"
                    style={{
                        width: '955px',
                        minHeight: '1211px',
                        transform: `scale(${scale})`,
                    }}
                >
                    <div className="flex-1">
                        {/* 1. Header: Logo & Name */}
                        <div className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-6 mb-8">
                            <img src={logo} alt="Madrasha Logo" className="w-20 h-20 object-contain mb-3" />
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h1>
                            <p className="text-base font-bold text-slate-600">নতুন পল্লান পাড়া, ৪নং ওয়ার্ড, টেকনাফ, কক্সবাজার</p>
                        </div>

                        {/* 2. Dynamic Exam Name & Date */}
                        <div className="text-center mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 break-inside-avoid">
                            <h2 className="text-2xl md:text-3xl font-black text-emerald-700 mb-2">
                                {examData.name || 'আসন্ন পরীক্ষার রুটিন'}
                            </h2>
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                                <Calendar size={18} className="text-slate-500" />
                                <span className="font-bold text-slate-700 text-lg">
                                    {examData.date || 'তারিখ শীঘ্রই প্রকাশিত হবে'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Routine Section (Image or Table) */}
                        <div className="mb-8">
                            {examData.imageUrl ? (
                                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                                    <img
                                        src={examData.imageUrl}
                                        alt="Exam Routine"
                                        className="w-full h-auto object-contain"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                    <table className="w-full border-collapse bg-white text-left">
                                        <thead className="bg-[#ea580c] text-white">
                                            <tr>
                                                <th className="p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap">তারিখ</th>
                                                <th className="p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap">দিন</th>
                                                <th className="p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap">বিষয় ও সময়</th>
                                                <th className="p-3 border-b border-orange-500 font-bold whitespace-nowrap">বিষয় কোড</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Dynamic Data from Firebase */}
                                            {(examData.routine || []).map((item, index) => (
                                                <tr key={index} className="border-b border-slate-200 odd:bg-yellow-50 even:bg-white text-slate-800">
                                                    <td className="p-3 font-bold border-r border-slate-200 whitespace-nowrap">{item.date}</td>
                                                    <td className="p-3 font-bold border-r border-slate-200 whitespace-nowrap">{item.day}</td>
                                                    <td className="p-3 font-bold border-r border-slate-200">
                                                        <div className="flex flex-col">
                                                            <span className="text-base text-slate-900">{item.subject}</span>
                                                            <span className="text-sm text-slate-600 mt-1">{item.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-bold text-center text-slate-900">{item.code}</td>
                                                </tr>
                                            ))}
                                            {(!examData.routine || examData.routine.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-500 font-bold">
                                                        কোনো রুটিন তথ্য পাওয়া যায়নি।
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* 4. Exam Rules */}
                        {examData.rules && examData.rules.length > 0 && (
                            <div className="mb-8 bg-rose-50 border border-rose-100 p-6 rounded-2xl break-inside-avoid">
                                <h3 className="text-xl font-black text-rose-700 mb-4 border-b border-rose-200 pb-2 inline-block">
                                    পরীক্ষার্থীদের জন্য নির্দেশাবলি:
                                </h3>
                                <ul className="space-y-2">
                                    {examData.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3 text-slate-700 font-bold">
                                            <span className="bg-rose-200 text-rose-700 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between pt-12 mt-auto break-inside-avoid">
                        <div className="text-center">
                            <div className="w-40 border-t-2 border-slate-400 mb-2"></div>
                            <p className="font-bold text-slate-500">গার্ডিয়ানের স্বাক্ষর</p>
                        </div>
                        <div className="text-center">
                            <div className="w-40 border-t-2 border-slate-400 mb-2"></div>
                            <p className="font-bold text-slate-500">অধ্যক্ষের স্বাক্ষর</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-6 left-0 right-0 p-4 z-50 no-print flex justify-center">
                <div className="bg-white/90 backdrop-blur-xl border border-slate-200 px-6 py-3 rounded-2xl shadow-xl flex gap-4 w-full max-w-md">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg active:scale-95 text-base"
                    >
                        <Printer size={18} />
                        প্রিন্ট করুন
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg active:scale-95 text-base"
                    >
                        <Download size={18} />
                        ডাউনলোড
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Routine
