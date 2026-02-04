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

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = async () => {
        const element = componentRef.current
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true // Important for external images
        })

        const data = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = data
        link.download = `Routine_${new Date().getFullYear()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Fallback Table Data (If no image is provided)
    const routines = [
        { class: 'শ্রেণি: প্রথম', time: '০৯:০০ - ১২:০০', subject: 'কুরআন মাজিদ' },
        { class: 'শ্রেণি: দ্বিতীয়', time: '০৯:০০ - ১২:০০', subject: 'হাদিস শরীফ' },
        { class: 'শ্রেণি: তৃতীয়', time: '০২:০০ - ০৫:০০', subject: 'ফিকহ শাস্ত্র' },
        { class: 'শ্রেণি: চতুর্থ', time: '০২:০০ - ০৫:০০', subject: 'আরবি সাহিত্য' },
    ]

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-slate-50 font-bengali pb-32">
            {/* Top Navigation Row */}
            <div className="p-4 md:p-6 no-print">
                <BackButton />
            </div>

            {/* Main Printable Content Area */}
            <div className="max-w-5xl mx-auto px-4">
                <div
                    ref={componentRef}
                    className="bg-white p-6 md:p-12 rounded-3xl shadow-xl border border-slate-100 print-content"
                >
                    {/* 1. Header: Logo & Name */}
                    <div className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-8 mb-8">
                        <img src={logo} alt="Madrasha Logo" className="w-24 h-24 object-contain mb-4" />
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h1>
                        <p className="text-lg font-bold text-slate-600">নতুন পল্লান পাড়া, ৪নং ওয়ার্ড, টেকনাফ, কক্সবাজার</p>
                    </div>

                    {/* 2. Dynamic Exam Name & Date */}
                    <div className="text-center mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
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
                    <div className="mb-12">
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
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full min-w-[800px] border-collapse bg-white text-left">
                                    <thead className="bg-[#ea580c] text-white">
                                        <tr>
                                            <th className="p-4 border-b border-r border-orange-500 font-bold whitespace-nowrap">তারিখ</th>
                                            <th className="p-4 border-b border-r border-orange-500 font-bold whitespace-nowrap">দিন</th>
                                            <th className="p-4 border-b border-r border-orange-500 font-bold whitespace-nowrap">বিষয় ও সময়</th>
                                            <th className="p-4 border-b border-orange-500 font-bold whitespace-nowrap">বিষয় কোড</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Dynamic Data from Firebase */}
                                        {(examData.routine || []).map((item, index) => (
                                            <tr key={index} className="border-b border-slate-200 odd:bg-yellow-50 even:bg-white text-slate-800">
                                                <td className="p-4 font-bold border-r border-slate-200 whitespace-nowrap">{item.date}</td>
                                                <td className="p-4 font-bold border-r border-slate-200 whitespace-nowrap">{item.day}</td>
                                                <td className="p-4 font-bold border-r border-slate-200">
                                                    <div className="flex flex-col">
                                                        <span className="text-base text-slate-900">{item.subject}</span>
                                                        <span className="text-sm text-slate-600 mt-1">{item.time}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-center text-slate-900">{item.code}</td>
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
                        <div className="mb-12 bg-rose-50 border border-rose-100 p-6 md:p-8 rounded-2xl">
                            <h3 className="text-xl font-black text-rose-700 mb-4 border-b border-rose-200 pb-2 inline-block">
                                পরীক্ষার্থীদের জন্য নির্দেশাবলি:
                            </h3>
                            <ul className="space-y-3">
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

                    {/* Signatures */}
                    <div className="flex justify-between pt-16 mt-8">
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
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 no-print shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-lg mx-auto flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-xl font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-lg"
                    >
                        <Printer size={22} />
                        প্রিন্ট করুন
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-xl font-black hover:bg-slate-700 transition-all shadow-lg active:scale-95 text-lg"
                    >
                        <Download size={22} />
                        ডাউনলোড
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Routine
