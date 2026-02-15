import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AuthContext } from '../App'

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { role } = useContext(AuthContext)

    const handleBack = () => {
        if (role === 'admin' && location.pathname.startsWith('/admin')) {
            navigate('/admin')
        } else {
            navigate(-1)
        }
    }

    return (
        <button
            onClick={handleBack}
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
