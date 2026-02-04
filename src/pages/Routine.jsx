import React, { useRef } from 'react'
import { Printer, Download, Calendar } from 'lucide-react'
import html2canvas from 'html2canvas'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'

const Routine = () => {
    const componentRef = useRef()

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = async () => {
        const element = componentRef.current
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            backgroundColor: '#ffffff'
        })

        const data = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = data
        link.download = 'Exam_Routine_2026.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const routines = [
        { class: 'শ্রেণি: প্রথম', time: '০৯:০০ - ১২:০০', subject: 'কুরআন মাজিদ' },
        { class: 'শ্রেণি: দ্বিতীয়', time: '০৯:০০ - ১২:০০', subject: 'হাদিস শরীফ' },
        { class: 'শ্রেণি: তৃতীয়', time: '০২:০০ - ০৫:০০', subject: 'ফিকহ শাস্ত্র' },
        { class: 'শ্রেণি: চতুর্থ', time: '০২:০০ - ০৫:০০', subject: 'আরবি সাহিত্য' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-bengali transition-all duration-300">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 no-print">
                <div>
                    <BackButton />
                    <h1 className="text-3xl font-black text-slate-800">আসন্ন পরীক্ষার রুটিন</h1>
                    <p className="text-slate-500 font-bold">বার্ষিক পরীক্ষা - ২০২৬</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                    >
                        <Printer size={20} />
                        প্রিন্ট করুন
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-black hover:bg-slate-300 transition-all active:scale-95">
                        <Download size={20} />
                        ডাউনলোড
                    </button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="bg-white p-8 md:p-16 rounded-[32px] shadow-sm border border-slate-200 print-content" ref={componentRef}>
                {/* Print Header (Only visible in Print) */}
                <div className="hidden print-header mb-8 text-center border-b-2 border-slate-900 pb-6">
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="Logo" className="w-24 h-24 object-contain mb-4" />
                        <h1 className="text-4xl font-black text-slate-900 mb-2">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h1>
                        <p className="text-lg font-bold text-slate-600">নতুন পল্লান পাড়া, ৪নং ওয়ার্ড, টেকনাফ, কক্সবাজার</p>
                        <p className="text-sm font-bold text-slate-500 mt-1">ইমেইল: supianuriadhakil.edu@gmail.com | ফোন: 01866495086</p>
                        <div className="mt-4 px-4 py-1 bg-slate-900 text-white inline-block rounded-full text-sm font-bold uppercase tracking-widest">পরীক্ষার রুটিন - ২০২৬</div>
                    </div>
                </div>

                {/* Routine Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700">
                                <th className="p-4 text-left border border-slate-200 font-black">তারিখ</th>
                                <th className="p-4 text-left border border-slate-200 font-black">বার</th>
                                <th className="p-4 text-left border border-slate-200 font-black">শ্রেণি ও বিষয়</th>
                                <th className="p-4 text-left border border-slate-200 font-black">সময়</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border border-slate-200">
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">১০ জানুয়ারি, ২০২৬</td>
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">শনিবার</td>
                                <td className="p-4 border border-slate-200">
                                    <div className="space-y-2">
                                        {routines.map((r, i) => (
                                            <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                                <span className="font-black text-slate-800">{r.class}</span>
                                                <span className="text-emerald-600 font-bold">{r.subject}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">সকাল ১০:০০ - দুপুর ১:০০</td>
                            </tr>
                            {/* More rows would go here */}
                            <tr className="border border-slate-200 bg-slate-50/50">
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">১২ জানুয়ারি, ২০২৬</td>
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">সোমবার</td>
                                <td className="p-4 border border-slate-200">
                                    <div className="space-y-2">
                                        {routines.map((r, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg">
                                                <span className="font-black text-slate-800">{r.class}</span>
                                                <span className="text-emerald-600 font-bold">{r.subject} (২য় পত্র)</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-600 border border-slate-200">সকাল ১০:০০ - দুপুর ১:০০</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-16 flex justify-between pt-16">
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
    )
}

export default Routine
