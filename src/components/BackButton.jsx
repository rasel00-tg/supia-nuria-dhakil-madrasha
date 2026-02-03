import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-colors mb-6 group ${className}`}
        >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            ফিরে যান
        </button>
    )
}

export default BackButton
