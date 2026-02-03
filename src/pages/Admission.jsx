import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Save, Activity, BookOpen, FileText, User, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'
import logo from '../assets/logo.png'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

// InputField Component with fixed padding and spacing
const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-bold text-slate-700 ml-1 block">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
            required={required}
        />
    </div>
)

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1 block">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold text-slate-600 appearance-none"
                required={required}
            >
                <option value="">বাছাই করুন</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    </div>
)

const Admission = () => {
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        student_name_bn: '', student_name_en: '', dob: '', nid_birth: '',
        student_mobile: '', student_email: '', gender: '', blood_group: '',
        present_address: '', permanent_address: '',
        father_name: '', father_nid: '', father_dob: '',
        mother_name: '', mother_nid: '', mother_dob: '',
        guardian_mobile: '', guardian_email: '',
        guardian_address: '', ward_no: '', thana: '', district: '', division: '',
        admission_class: '',
        prev_institute: '', prev_board: '', prev_group: '', prev_roll: '', prev_reg: '', prev_gpa: '',
        has_disease: 'no', disease_details: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateMobile = (n) => /^01[3-9]\d{8}$/.test(n)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateMobile(formData.guardian_mobile)) { toast.error('অভিভাবকের মোবাইল নম্বরটি সঠিক নয়'); return; }
        setSubmitting(true)
        try {
            await addDoc(collection(db, 'admissions'), {
                ...formData, submittedAt: new Date().toISOString(), status: 'pending'
            })
            setSubmitted(true)
            toast.success('আবেদন সফল হয়েছে!')
            window.scrollTo(0, 0)
        } catch (error) { toast.error('ত্রুটি! আবার চেষ্টা করুন।') } finally { setSubmitting(false) }
    }

    const isHigherClass = ['৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].includes(formData.admission_class)

    if (submitted) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-bengali">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] p-10 max-w-lg w-full text-center shadow-2xl border border-slate-100">
                <CheckCircle size={48} className="text-emerald-600 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-slate-800 mb-4">আবেদন সফল হয়েছে</h2>
                <p className="text-slate-600 font-bold mb-8">তথ্য যাচাইয়ের জন্য অপেক্ষা করুন।</p>
                <Link to="/" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">হোমে যান</Link>
            </motion.div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-bengali">
            <div className="max-w-5xl mx-auto">
                {/* Fixed Header - Removed Green Line */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 mb-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                    <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-6 object-contain" />
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">অনলাইন ভর্তি ফরম</h1>
                    <p className="text-emerald-600 font-bold text-lg">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Student Info */}
                    <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-slate-100 max-w-full">
                        <h3 className="text-xl font-black text-emerald-800 mb-8 flex items-center gap-3 pb-4 border-b border-emerald-50">
                            <User size={20} className="text-emerald-600" /> শিক্ষার্থীর ব্যক্তিগত তথ্য
                        </h3>
                        {/* Fixed Grid for Student Names */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <InputField label="পূর্ণ নাম (বাংলা)" name="student_name_bn" value={formData.student_name_bn} onChange={handleChange} placeholder="বাংলায় নাম" required className="w-full" />
                            <InputField label="Full Name (English)" name="student_name_en" value={formData.student_name_en} onChange={handleChange} placeholder="English Name" required className="w-full" />

                            <InputField label="জন্ম তারিখ" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                            <InputField label="NID / জন্মনিবন্ধন" name="nid_birth" type="number" value={formData.nid_birth} onChange={handleChange} placeholder="নম্বর" required />

                            <InputField label="ফোন নাম্বার" name="student_mobile" type="tel" value={formData.student_mobile} onChange={handleChange} placeholder="নম্বর" />

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 block">লিঙ্গ <span className="text-rose-500">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer"><input type="radio" name="gender" value="male" onChange={handleChange} className="mr-2" /> ছাত্র</label>
                                    <label className="flex-1 cursor-pointer"><input type="radio" name="gender" value="female" onChange={handleChange} className="mr-2" /> ছাত্রী</label>
                                </div>
                            </div>

                            <SelectField label="রক্তের গ্রুপ" name="blood_group" value={formData.blood_group} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                            <InputField label="বর্তমান ঠিকানা" name="present_address" value={formData.present_address} onChange={handleChange} placeholder="ঠিকানা" className="md:col-span-2" required />
                            <InputField label="স্থায়ী ঠিকানা" name="permanent_address" value={formData.permanent_address} onChange={handleChange} placeholder="ঠিকানা" className="md:col-span-2" required />
                        </div>
                    </div>

                    {/* Guardian Info */}
                    <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-slate-100">
                        <h3 className="text-xl font-black text-emerald-800 mb-8 flex items-center gap-3 pb-4 border-b border-emerald-50">
                            <User size={20} className="text-emerald-600" /> অভিভাবক তথ্য
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="বাবার নাম" name="father_name" value={formData.father_name} onChange={handleChange} placeholder="নাম" required />
                            <InputField label="মায়ের নাম" name="mother_name" value={formData.mother_name} onChange={handleChange} placeholder="নাম" required />
                            <InputField label="অভিভাবকের মোবাইল" name="guardian_mobile" value={formData.guardian_mobile} onChange={handleChange} placeholder="01XXXXXXXXX" required />

                            {/* Detailed Fields */}
                            <InputField label="বাবার NID" name="father_nid" value={formData.father_nid} onChange={handleChange} placeholder="NID" />
                            <InputField label="মায়ের NID" name="mother_nid" value={formData.mother_nid} onChange={handleChange} placeholder="NID" />

                            <InputField label="জেলা" name="district" value={formData.district} onChange={handleChange} placeholder="জেলা" required />
                            <InputField label="থানা" name="thana" value={formData.thana} onChange={handleChange} placeholder="থানা" required />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-slate-100">
                        <h3 className="text-xl font-black text-emerald-800 mb-8 flex items-center gap-3 pb-4 border-b border-emerald-50"><BookOpen size={20} /> একাডেমিক তথ্য</h3>
                        <SelectField label="ভর্তি হতে ইচ্ছুক শ্রেণি" name="admission_class" value={formData.admission_class} onChange={handleChange} options={['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম']} required />

                        {isHigherClass && (
                            <div className="bg-slate-50 p-4 rounded-xl mt-4 grid md:grid-cols-2 gap-4">
                                <InputField label="পূর্বের প্রতিষ্ঠান" name="prev_institute" value={formData.prev_institute} onChange={handleChange} />
                                <InputField label="রোল" name="prev_roll" value={formData.prev_roll} onChange={handleChange} />
                                <SelectField label="GPA" name="prev_gpa" value={formData.prev_gpa} onChange={handleChange} options={['5.00', '4.00', '3.50', '3.00']} />
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={submitting} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3">
                        {submitting ? 'জমা হচ্ছে...' : <><Save /> আবেদন জমা দিন</>}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Admission
