import React, { useRef, useState, useEffect } from 'react'
import { Printer, Download, Calendar, ChevronDown, Check } from 'lucide-react'
import html2canvas from 'html2canvas'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'

const Routine = () => {
    const componentRef = useRef()
    const [loading, setLoading] = useState(true)
    const [scale, setScale] = useState(1)
    const [selectedClass, setSelectedClass] = useState('সকল শ্রেণি')
    const [showClassPopup, setShowClassPopup] = useState(false)
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

    const classList = [
        'সকল শ্রেণি',
        '১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', '৪র্থ শ্রেণি', '৫ম শ্রেণি',
        '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি'
    ]

    useEffect(() => {
        setLoading(true)
        const docRef = doc(db, 'settings', 'exam_routine')
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setExamData(docSnap.data())
            }
            setLoading(false)
        }, (error) => {
            console.error("Error fetching routine:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth
            // Only scale if screen is larger than typical mobile breakpoint to effectively disable scaling on small mobile
            // User requested Scale: 1 for mobile optimization
            if (screenWidth < 768) {
                setScale(1)
            } else {
                // Desktop scaling logic preserves 955px width
                const contentWidth = 955
                if (screenWidth < contentWidth + 32) {
                    setScale((screenWidth - 32) / contentWidth)
                } else {
                    setScale(1)
                }
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
            windowWidth: 955, // Ensure capture uses standard width
            onclone: (document) => {
                const el = document.querySelector('.print-content')
                if (el) {
                    el.style.transform = 'none'
                    el.style.margin = '0'
                    el.style.boxShadow = 'none'
                    if (window.innerWidth < 768) {
                        el.style.maxWidth = '955px' // Force desktop width for image generation
                        el.style.width = '955px'
                    }
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

    // Filter Logic
    const filteredRoutine = (examData.routine || []).filter(item => {
        if (selectedClass === 'সকল শ্রেণি') return true
        return item.class === selectedClass
    })

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

            {/* Sticky Header with Controls */}
            <div className="sticky top-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 z-[100] no-print mb-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
                    <BackButton />

                    <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar justify-between md:justify-end">
                        {/* Class Filter Button */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setShowClassPopup(!showClassPopup)}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap text-sm md:text-base"
                            >
                                {selectedClass}
                                <ChevronDown size={16} className="text-slate-400" />
                            </button>


                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-all shadow-md active:scale-95 whitespace-nowrap text-sm md:text-base"
                            >
                                <Printer size={16} />
                                <span className="hidden sm:inline">প্রিন্ট</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all shadow-md active:scale-95 whitespace-nowrap text-sm md:text-base"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">ডাউনলোড</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Scale Logic */}
            <div className={`w-full flex justify-center py-2 md:py-4 print-wrapper ${scale === 1 ? 'overflow-auto' : 'overflow-hidden'}`}>
                <div
                    ref={componentRef}
                    className="bg-white rounded-lg shadow-sm border border-slate-100 print-content flex flex-col justify-between origin-top"
                    style={{
                        // Mobile first styles
                        width: '100%',
                        maxWidth: window.innerWidth < 768 ? '400px' : '955px',
                        margin: '0 auto',
                        // Apply specific dimensions only for Desktop scaling
                        ...(window.innerWidth >= 768 ? { minHeight: '1211px' } : {}),
                        transform: `scale(${scale})`,
                        padding: window.innerWidth < 768 ? '12px' : '48px'
                    }}
                >
                    <div className="flex-1">
                        {/* 1. Header: Logo & Name */}
                        <div className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-4 mb-4 md:pb-6 md:mb-8">
                            <img src={logo} alt="Madrasha Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain mb-2 md:mb-3" />
                            <h1 className="text-[18px] md:text-4xl font-black text-slate-900 mb-1 md:mb-2">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h1>
                            <p className="text-[13px] md:text-base font-bold text-slate-600">নতুন পল্লান পাড়া, ৪নং ওয়ার্ড, টেকনাফ, কক্সবাজার</p>
                        </div>

                        {/* 2. Dynamic Exam Name & Date */}
                        <div className="text-center mb-6 md:mb-8 bg-slate-50 p-4 md:p-6 rounded-lg md:rounded-2xl border border-slate-200 break-inside-avoid">
                            <h2 className="text-[16px] md:text-3xl font-black text-emerald-700 mb-2">
                                {examData.name || 'আসন্ন পরীক্ষার রুটিন'}
                            </h2>
                            <div className="flex flex-col items-center gap-2 mt-2">
                                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 md:px-4 md:py-2 rounded-full border border-slate-200 shadow-sm">
                                    <Calendar size={16} className="text-slate-500" />
                                    <span className="font-bold text-slate-700 text-[14px] md:text-lg">
                                        {examData.date || 'তারিখ শীঘ্রই প্রকাশিত হবে'}
                                    </span>
                                </div>
                                <div className="mt-1 md:mt-2 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 md:px-3 md:py-1 rounded-lg border border-emerald-100 text-[13px] md:text-base">
                                    {selectedClass === 'সকল শ্রেণি' ? 'সকল শ্রেণির রুটিন' : `${selectedClass}-এর রুটিন`}
                                </div>
                            </div>
                        </div>

                        {/* 3. Routine Section (Image or Table) */}
                        <div className="mb-6 md:mb-8 overflow-x-auto">
                            {examData.imageUrl ? (
                                <div className="overflow-hidden rounded-lg md:rounded-xl border border-slate-200 shadow-sm">
                                    <img
                                        src={examData.imageUrl}
                                        alt="Exam Routine"
                                        className="w-full h-auto object-contain"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            ) : (
                                <div className="rounded-lg md:rounded-xl border border-slate-200 overflow-hidden min-w-[600px] md:min-w-full">
                                    <table className="w-full border-collapse bg-white text-left text-[13px] md:text-base">
                                        <thead className="bg-[#ea580c] text-white">
                                            <tr>
                                                <th className="p-2 md:p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap text-center">তারিখ</th>
                                                <th className="p-2 md:p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap text-center">বার</th>
                                                <th className="p-2 md:p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap">বিষয়</th>
                                                <th className="p-2 md:p-3 border-b border-r border-orange-500 font-bold whitespace-nowrap text-center">সময়</th>
                                                <th className="p-2 md:p-3 border-b border-orange-500 font-bold whitespace-nowrap text-center">বিষয় কোড</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Dynamic Data from Firebase */}
                                            {filteredRoutine.map((item, index) => (
                                                <tr key={index} className="border-b border-slate-200 odd:bg-yellow-50 even:bg-white text-slate-800">
                                                    <td className="p-2 md:p-3 font-bold border-r border-slate-200 whitespace-nowrap text-center">{item.date}</td>
                                                    <td className="p-2 md:p-3 font-bold border-r border-slate-200 whitespace-nowrap text-center">{item.day}</td>
                                                    <td className="p-2 md:p-3 font-bold border-r border-slate-200 text-slate-900">{item.subject}</td>
                                                    <td className="p-2 md:p-3 font-bold border-r border-slate-200 whitespace-nowrap text-center text-slate-600 bg-slate-50/50">{item.time}</td>
                                                    <td className="p-2 md:p-3 font-bold text-center text-slate-900">{item.code}</td>
                                                </tr>
                                            ))}
                                            {(filteredRoutine.length === 0) && (
                                                <tr>
                                                    <td colSpan="5" className="p-8 md:p-12 text-center text-slate-400 font-bold bg-slate-50">
                                                        এই শ্রেণির জন্য কোনো রুটিন পাওয়া যায়নি।
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
                            <div className="mb-6 md:mb-8 bg-rose-50 border border-rose-100 p-4 md:p-6 rounded-lg md:rounded-2xl break-inside-avoid">
                                <h3 className="text-[16px] md:text-xl font-black text-rose-700 mb-3 md:mb-4 border-b border-rose-200 pb-2 inline-block">
                                    পরীক্ষার্থীদের জন্য নির্দেশাবলি:
                                </h3>
                                <ul className="space-y-2">
                                    {examData.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2 md:gap-3 text-slate-700 font-bold text-[13px] md:text-base">
                                            <span className="bg-rose-200 text-rose-700 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[10px] md:text-xs shrink-0 mt-0.5">
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
                    <div className="flex justify-between pt-8 md:pt-12 mt-auto break-inside-avoid">
                        <div className="text-center">
                            <div className="w-24 md:w-40 border-t-2 border-slate-400 mb-2"></div>
                            <p className="font-bold text-slate-500 text-[12px] md:text-base">গার্ডিয়ানের স্বাক্ষর</p>
                        </div>
                        <div className="text-center">
                            <div className="w-24 md:w-40 border-t-2 border-slate-400 mb-2"></div>
                            <p className="font-bold text-slate-500 text-[12px] md:text-base">অধ্যক্ষের স্বাক্ষর</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Class Popup Menu - Moved for fixed positioning */}
            {showClassPopup && (
                <>
                    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm" onClick={() => setShowClassPopup(false)}></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 z-[1001] animate-in fade-in zoom-in-95 duration-200 p-2">
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-3 border-b border-slate-100 mb-2 font-black text-center text-slate-700 text-lg">
                            শ্রেণি নির্বাচন করুন
                        </div>
                        <div className="space-y-1">
                            {classList.map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => {
                                        setSelectedClass(cls)
                                        setShowClassPopup(false)
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors rounded-xl text-base ${selectedClass === cls ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'
                                        }`}
                                >
                                    {cls}
                                    {selectedClass === cls && <Check size={20} className="text-emerald-600" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Routine
