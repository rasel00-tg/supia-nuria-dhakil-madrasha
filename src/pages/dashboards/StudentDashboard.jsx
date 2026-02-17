import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Award, Bell, User, Calendar, Check, ArrowLeft, Home, FileText, Users, HelpCircle, ClipboardCheck, CheckCircle, X, ChevronRight, LogOut, Phone, Mail, Facebook } from 'lucide-react'
import { AuthContext } from '../../App'
import logo from '../../assets/logo.png'
import { auth, db } from '../../firebase'
import { collection, query, orderBy, limit, onSnapshot, getDocs, where, updateDoc, doc, arrayUnion, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { toast } from 'react-hot-toast'

const StudentDashboard = () => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState('home')
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [noticeList, setNoticeList] = useState([])
    const [homeworkList, setHomeworkList] = useState([])
    const [resultList, setResultList] = useState([]) // For Result Sheet
    const [classmates, setClassmates] = useState([])
    const [teachers, setTeachers] = useState([])
    const [myNotes, setMyNotes] = useState([])

    // UI State
    const [selectedNotice, setSelectedNotice] = useState(null)
    const [newNote, setNewNote] = useState('')
    const [selectedResultStudent, setSelectedResultStudent] = useState(null)
    const [isDevExpanded, setIsDevExpanded] = useState(false)

    const devBio = `আসসালামু আলাইকুম ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহু।

আমি রাশেদুল করিম—এই প্রিয় প্রতিষ্ঠানেরই এক সময়কার ক্ষুদ্র একজন শিক্ষার্থী। দীর্ঘ নয়টি বছর আমি এই মাদ্রাসার স্নেহময়, শৃঙ্খলাবদ্ধ ও আলোকিত পরিবেশে শিক্ষা অর্জনের সৌভাগ্য লাভ করেছি। এই অঙ্গনের প্রতিটি ইট-পাথর, প্রতিটি শ্রেণিকক্ষ, প্রতিটি উপদেশ ও সংশোধন আমার চরিত্র গঠনের একেকটি ভিত্তিপ্রস্তর হয়ে আছে। এখানে আমি কেবল পাঠ্যবইয়ের জ্ঞান অর্জন করিনি; বরং শিখেছি আদব, আখলাক, দায়িত্ববোধ ও আত্মমর্যাদার প্রকৃত অর্থ। আমার জীবনের যতটুকু অর্জন, তার পেছনে এই মাদ্রাসার অবদান গভীর ও চিরস্মরণীয়।

বর্তমান যুগ প্রযুক্তিনির্ভর। জ্ঞানের অগ্রযাত্রা এখন ডিজিটাল প্ল্যাটফর্মে দ্রুতগতিতে বিস্তৃত হচ্ছে। এই বাস্তবতাকে সামনে রেখে আমি আমাদের মাদ্রাসার জন্য একটি আধুনিক ওয়েব অ্যাপ ডেভেলপমেন্টের উদ্যোগ গ্রহণ করেছি। এটি কেবল একটি প্রযুক্তিগত সংযোজন নয়; বরং শিক্ষাব্যবস্থাকে আরও স্বচ্ছ, গতিশীল ও ফলপ্রসূ করার এক সুদূরপ্রসারী প্রয়াস। আমি বিশ্বাস করি, এই স্মার্ট উদ্যোগ আমাদের শিক্ষার্থী ভাই বোনের পাঠদানকে সহজতর করবে, শিক্ষকদের কার্যক্রমকে আরও সংগঠিত করবে এবং অভিভাবকদের সঙ্গে প্রতিষ্ঠানের যোগাযোগকে শক্তিশালী করবে। জ্ঞানের এই ডিজিটাল সেতুবন্ধন আমাদের প্রতিষ্ঠানকে সময়োপযোগী ও প্রতিযোগিতামূলক ধারায় এগিয়ে নিয়ে যাবে, ইনশাআল্লাহ।

প্রিয় ভাই ও বোনেরা, মনে রেখো—এই মাদ্রাসা শুধু আপনাদের শিক্ষালয় নয়; এটি আপনাদের পরিচয়ের ভিত্তি, আদর্শের উৎস এবং ভবিষ্যতের পথনির্দেশক। এর সুনাম রক্ষা, উন্নয়ন ও কল্যাণে নিজ নিজ অবস্থান থেকে কাজ করা আপনাদেরও নৈতিক দায়িত্ব। আপনাদের সাফল্যই এই প্রতিষ্ঠানের গৌরব, আর প্রতিষ্ঠানের মর্যাদাই তোমাদের সম্মান।

শিক্ষকদের প্রতি শ্রদ্ধাশীল হোন, তাঁদের উপদেশকে হৃদয়ে ধারণ করেন। পিতামাতার নির্দেশনা অনুসরণ করেন, কারণ তাঁদের দোয়া ও সন্তুষ্টিই জীবনের সবচেয়ে বড় পুঁজি। অধ্যবসায়, শৃঙ্খলা ও তাকওয়াকে সঙ্গী করে নিজেকে এমনভাবে গড়ে তোলেন, যেন আপনাদের মাধ্যমে সমাজ ও দেশ আলোকিত হয়। দ্বীনি ও দুনিয়াবি উভয় ক্ষেত্রে উৎকর্ষ অর্জন করে আপনারা যেন আদর্শ নাগরিক ও পরিপূর্ণ মানুষ হিসেবে আত্মপ্রকাশ করতে পারেন—এই কামনাই করি।

পরিশেষে, আমাকে আপনাদের দোয়ায় স্মরণ রাখবেন। আল্লাহ তাআলা আমাদের সবাইকে ইলমে নাফে, আমলে সালেহ এবং চরিত্রে দৃঢ়তা দান করুন। তিনি যেন এই প্রতিষ্ঠানকে আরও সমৃদ্ধ ও বরকতময় করে তোলেন এবং আমাদের সকল প্রচেষ্টাকে কবুল করেন। আমীন।`

    // --- 1. LOGOUT PROTECTION LOGIC ---
    useEffect(() => {
        // Handle Browser/Phone Back Button
        const handlePopState = (event) => {
            event.preventDefault();
            setShowLogoutConfirm(true);
            // Re-push state to trap user in the page unless they confirm logout
            window.history.pushState(null, null, window.location.pathname);
        };

        // Push initial state
        // Prevent Drag-Refresh / Accidental Tab Close
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        }

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [])

    const confirmLogout = async () => {
        await auth.signOut();
        navigate('/login');
    }

    // --- DATA FETCHING ---
    useEffect(() => {
        if (user?.uid) {
            fetchUserProfile();
            fetchNotices();
            fetchMyNotes();
        }
    }, [user])

    // Dependent Queries (Need Class Info)
    useEffect(() => {
        const studentClass = userProfile?.class || userProfile?.admission_class;
        if (studentClass) {
            fetchHomework(studentClass);
            fetchClassmates(studentClass);
            // Fetch Results for this class (mock logic or real if collection exists)
            fetchResults(studentClass);
        }
        fetchTeachers(); // General
    }, [userProfile])

    const fetchUserProfile = async () => {
        try {
            const studentRef = doc(db, 'students', user.uid)
            const snap = await getDoc(studentRef)
            if (snap.exists()) {
                setUserProfile(snap.data())
            } else {
                // Fallback for demo or mixed auth
                const userRef = doc(db, 'users', user.uid)
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()) setUserProfile(userSnap.data())
            }
        } catch (err) { console.error(err) }
    }

    const fetchNotices = () => {
        // Filter for 'student' category only as requested
        const q = query(collection(db, 'notices'), where('category', '==', 'student'), orderBy('createdAt', 'desc'), limit(10))
        onSnapshot(q, (snap) => {
            setNoticeList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }, (error) => {
            console.error("Notice fetch error:", error)
            // Fallback if index missing or field missing, fetch all then filter client side or show all
            if (error.code === 'failed-precondition') {
                // Index missing fallback
                const fallbackQ = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(10))
                onSnapshot(fallbackQ, (snap) => setNoticeList(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
            }
        })
    }

    const fetchHomework = (className) => {
        // Assuming 'assignments' collection has 'class' field
        // If not exists, will return empty. User asked for logic.
        // We will query by class.
        const q = query(collection(db, 'assignments'), where('class', '==', className), orderBy('createdAt', 'desc'), limit(30))
        onSnapshot(q, (snap) => {
            setHomeworkList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        })
    }

    const fetchClassmates = (className) => {
        if (!className) return;
        const q = query(collection(db, 'students'), where('class', '==', className), orderBy('roll', 'asc'))
        getDocs(q).then(snap => {
            setClassmates(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }).catch(err => console.error("Classmate fetch error:", err))
    }

    const fetchTeachers = () => {
        getDocs(collection(db, 'teachers')).then(snap => {
            setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        })
    }

    const fetchResults = (className) => {
        // Mocking Result Architecture if collection doesn't exist fully
        // Assuming 'results' collection with 'class', 'examName', 'studentsArray'
        // Just for demo, let's look for a 'results' collection
        const q = query(collection(db, 'results'), where('class', '==', className), orderBy('createdAt', 'desc'), limit(1))
        onSnapshot(q, (snap) => {
            if (!snap.empty) {
                setResultList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            } else {
                // Determine if we should show mock for UI requirements? 
                // User asked "Logic to be added". If data missing, show empty state or placeholder.
                // I will show empty state logic.
                setResultList([])
            }
        })
    }

    const fetchMyNotes = () => {
        // Subcollection for notes
        const q = query(collection(db, `students/${user.uid}/notes`), orderBy('createdAt', 'desc'))
        onSnapshot(q, (snap) => {
            setMyNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        })
    }

    // --- ACTIONS ---
    const addNote = async () => {
        if (!newNote.trim()) return;
        try {
            await setDoc(doc(collection(db, `students/${user.uid}/notes`)), {
                text: newNote,
                completed: false,
                createdAt: new Date().toISOString()
            })
            setNewNote('')
            toast.success('নোট যোগ করা হয়েছে')
        } catch (e) {
            console.error(e)
        }
    }

    const toggleNote = async (note) => {
        try {
            await updateDoc(doc(db, `students/${user.uid}/notes`, note.id), {
                completed: !note.completed
            })
        } catch (e) { console.error(e) }
    }

    const deleteNote = async (id) => {
        try {
            await deleteDoc(doc(db, `students/${user.uid}/notes`, id))
        } catch (e) { console.error(e) }
    }

    // --- UI HELPERS ---
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString) // specific date format might be needed if timestamp
        // Handle Firestore timestamp if applicable, but assuming string for now based on existing code
        if (dateString.seconds) return new Date(dateString.seconds * 1000).toLocaleDateString()
        return date.toLocaleDateString()
    }


    // --- RENDERERS ---

    // 1. HOME TAB
    const renderHome = () => (
        <div className="space-y-6 pb-24">
            {/* Profile Card (Yellow Theme) */}
            <div className="bg-amber-400 rounded-3xl p-6 text-slate-900 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10" />

                {/* Logout Button Added Here */}
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-slate-900 transition-colors z-20"
                >
                    <LogOut size={18} />
                </button>

                <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-3 shadow-md bg-slate-200">
                        <img src={userProfile?.imageUrl || logo} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-black mb-1 text-center">{userProfile?.full_name || user?.displayName || 'Student Name'}</h2>
                    <div className="flex items-center gap-3 text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full">
                        <span>শ্রেণি: {userProfile?.class || userProfile?.admission_class || 'N/A'}</span>
                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                        <span>রোল: {userProfile?.roll || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Smart Notice Card (Latest) */}
            {noticeList.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Bell className="text-rose-500 fill-rose-500" size={20} />
                        <h3 className="font-black text-slate-800">সাম্প্রতিক নোটিশ</h3>
                    </div>
                    <h4 className="text-lg font-bold mb-2 line-clamp-2">{noticeList[0].title || noticeList[0].notice_title}</h4>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">{noticeList[0].description || noticeList[0].details || noticeList[0].content || 'বিস্তারিত দেখুন...'}</p>
                    <button
                        onClick={() => setSelectedNotice(noticeList[0])}
                        className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
                    >
                        বিস্তারিত পড়ুন
                    </button>
                </div>
            )}

            {/* Recent Notices List (Last 6) */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <h3 className="font-black text-slate-800 mb-4 border-b pb-2">পূর্ববর্তী নোটিশসমূহ</h3>
                <div className="space-y-4">
                    {noticeList.slice(1, 7).map((notice, i) => (
                        <div key={i} onClick={() => setSelectedNotice(notice)} className="flex items-start gap-3 cursor-pointer group">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(notice.createdAt || notice.date).slice(0, 3) || 'DATE'}</span>
                                <span className="text-sm font-black text-slate-800">{new Date(notice.createdAt?.seconds * 1000 || notice.date || Date.now()).getDate()}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors">{notice.title || notice.notice_title}</h4>
                                <span className="text-[10px] text-slate-400">{formatDate(notice.createdAt || notice.date)}</span>
                            </div>
                        </div>
                    ))}
                    {noticeList.length <= 1 && <p className="text-slate-400 text-sm text-center">আর কোনো নোটিশ নেই</p>}
                </div>
            </div>
        </div>
    )

    // 2. HOMEWORK TAB
    const renderHomework = () => (
        <div className="space-y-6 pb-24">
            {/* Latest HW Card (Yellow) */}
            {homeworkList.length > 0 ? (
                <div className="bg-amber-400 rounded-3xl p-6 text-slate-900 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-slate-900/10 px-2 py-1 rounded text-xs font-bold">Latest</span>
                            <span className="text-xs font-bold">{formatDate(homeworkList[0].createdAt || homeworkList[0].date)}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-1">{homeworkList[0].subject}</h3>
                        <p className="font-medium text-sm mb-4 line-clamp-3 opacity-90">{homeworkList[0].details || homeworkList[0].title}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-8 h-8 bg-slate-900/20 rounded-full flex items-center justify-center text-xs font-bold">
                                {homeworkList[0].teacherName ? homeworkList[0].teacherName[0] : 'T'}
                            </div>
                            <span className="text-sm font-bold">{homeworkList[0].teacherName || 'Teacher'}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-100 rounded-3xl p-6 text-center text-amber-800 font-bold">
                    কোনো হোমওয়ার্ক নেই
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <h3 className="font-black text-slate-800 mb-4 border-b pb-2">বিগত ১ মাসের হোমওয়ার্ক</h3>
                <div className="space-y-4">
                    {homeworkList.map((hw, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-300 transition-all">
                            <div className="flex justify-between mb-1">
                                <h4 className="font-bold text-slate-800">{hw.subject}</h4>
                                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border">{formatDate(hw.createdAt || hw.date)}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{hw.details || hw.title}</p>
                            <p className="text-xs text-slate-400 font-bold">Teacher: {hw.teacherName || 'N/A'}</p>
                        </div>
                    ))}
                    {homeworkList.length === 0 && <div className="text-center text-slate-400 text-sm">লিস্ট ফাঁকা</div>}
                </div>
            </div>
        </div>
    )

    // 3. RESULT TAB
    const renderResult = () => {
        // Find result for logged in user in the latest result sheet
        // resultList contains Exam Objects which contain a 'students' array or similar structure, 
        // OR resultList IS the student list for one exam.
        // Assuming resultList is array of student results for the LATEST exam found.

        // Mock data structure assumption: Result Doc -> { examName: '...', date: '...', results: [ {roll: '1', name: '...', gpa: '5.00', ...} ] }
        // Or collection 'results' -> docs are individual student results?
        // Let's assume 'results' collection has docs representing EXAMS. Each doc has a 'sheet' array.

        const latestExam = resultList[0] || null
        const myResult = latestExam?.sheet?.find(s => s.roll === userProfile?.roll)

        return (
            <div className="space-y-6 pb-24">
                {latestExam ? (
                    <>
                        <div className="bg-white rounded-3xl p-6 text-center shadow-lg border border-slate-100">
                            <h2 className="text-xl font-black text-slate-800">{latestExam.examName || 'Exam Result'}</h2>
                            <p className="text-slate-500 text-sm font-bold">প্রকাশিত: {formatDate(latestExam.publishDate || latestExam.createdAt)}</p>
                            {/* Pass/Fail Status for User */}
                            {myResult && (
                                <div className={`mt-4 inline-block px-6 py-2 rounded-full font-black text-white ${parseFloat(myResult.gpa) >= 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                    {parseFloat(myResult.gpa) >= 1 ? `PASSED (GPA ${myResult.gpa})` : 'FAILED'}
                                </div>
                            )}
                        </div>

                        {/* Result Sheet */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-600 flex justify-between">
                                <span>Roll</span>
                                <span>Student Name</span>
                                <span>GPA</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {latestExam.sheet && latestExam.sheet.length > 0 ? (
                                    [...latestExam.sheet].sort((a, b) => parseInt(a.roll || 0) - parseInt(b.roll || 0)).map((res, i) => {
                                        const isMe = res.roll === userProfile?.roll
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedResultStudent(res)}
                                                className={`flex justify-between px-6 py-4 text-sm font-bold cursor-pointer transition-colors ${isMe ? 'bg-amber-100 text-amber-900' : 'hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                <span className="w-10">{res.roll}</span>
                                                <span className="flex-1 text-left">{res.name} {isMe && '(You)'}</span>
                                                <span className={`w-12 text-right ${parseFloat(res.gpa || 0) === 5 ? 'text-emerald-500' : ''}`}>{res.gpa}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="p-6 text-center text-slate-400 text-sm">ফলাফল তালিকা পাওয়া যায়নি</div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Award size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold">কোনো ফলাফল পাওয়া যায়নি</h3>
                    </div>
                )}
            </div>
        )
    }

    // 4. MY CLASS TAB
    const renderClass = () => (
        <div className="space-y-6 pb-24">
            <div className="bg-indigo-500 rounded-3xl p-6 text-white shadow-xl mb-6">
                <h2 className="text-2xl font-black">আমার ক্লাস ({userProfile?.class})</h2>
                <p className="opacity-80 font-bold">সহপাঠীদের তালিকা</p>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 divide-y divide-slate-50">
                {classmates.map((mate, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 transition-colors ${mate.roll === userProfile?.roll ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <img src={mate.imageUrl || logo} className="w-full h-full object-cover" alt={mate.name} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{mate.full_name || mate.name || 'Unknown'} {mate.roll === userProfile?.roll && <span className="text-indigo-600 text-xs">(আমি)</span>}</h4>
                            <p className="text-xs text-slate-500 font-bold">Roll No: {mate.roll || 'N/A'}</p>
                        </div>
                    </div>
                ))}
                {classmates.length === 0 && <p className="p-8 text-center text-slate-400">Loading or No Students Found...</p>}
            </div>
        </div>
    )

    // 5. NOTES TAB
    const renderNotes = () => (
        <div className="space-y-6 pb-24">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 sticky top-20 z-10">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2"><ClipboardCheck size={24} className="text-emerald-500" /> দৈনন্দিন নোট</h2>
                <div className="flex gap-2">
                    <input
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="আজকের গুরুত্বপূর্ণ কাজ লিখুন..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button onClick={addNote} className="bg-emerald-500 text-white p-3 rounded-xl font-bold hover:bg-emerald-600"><Check /></button>
                </div>
            </div>

            <div className="space-y-3">
                {myNotes.map(note => (
                    <motion.div layout key={note.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <button onClick={() => toggleNote(note)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${note.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}>
                            <Check size={14} />
                        </button>
                        <p className={`flex-1 font-medium ${note.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{note.text}</p>
                        <button onClick={() => deleteNote(note.id)} className="text-slate-300 hover:text-rose-500"><X size={18} /></button>
                    </motion.div>
                ))}
                {myNotes.length === 0 && <p className="text-center text-slate-400 py-8">কোনো নোট নেই। নতুন নোট যুক্ত করুন।</p>}
            </div>
        </div>
    )

    // 6. SUPPORT TAB
    const renderSupport = () => (
        <div className="space-y-8 pb-24">
            {/* Official Info */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 text-center space-y-4">
                <img src={logo} className="w-16 h-16 mx-auto" />
                <h2 className="text-xl font-black text-slate-800">মাদ্রাসা সাপোর্ট</h2>
                <div className="space-y-2 text-sm font-medium text-slate-600">
                    <p className="flex items-center justify-center gap-2"><Mail size={16} /> supianuriadhakil.edu@gmail.com</p>
                    <p className="flex items-center justify-center gap-2"><Home size={16} /> নতুন পল্লান পাড়া, টেকনাফ, কক্সবাজার</p>
                    <a href="https://www.facebook.com/share/1AYXUXtvfr/" target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full mt-2 hover:bg-blue-100"><Facebook size={16} /> ফেইসবুক পেজ</a>
                </div>
            </div>

            {/* Headmaster Section */}
            {teachers.find(t => ['Principal', 'Headmaster', 'সুপার', 'মুহতামিম'].includes(t.designation)) && (
                <div className="bg-amber-100 p-4 rounded-2xl border border-amber-200">
                    <h3 className="text-lg font-black text-amber-900 mb-3 text-center">প্রতিষ্ঠান প্রধান</h3>
                    {teachers.filter(t => ['Principal', 'Headmaster', 'সুপার', 'মুহতামিম'].includes(t.designation)).map(hm => (
                        <div key={hm.id} className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-white overflow-hidden shadow-sm border-2 border-amber-300">
                                <img src={hm.imageUrl || logo} className="w-full h-full object-cover" alt="Headmaster" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg">{hm.full_name}</h4>
                            <p className="text-sm font-bold text-slate-600 mb-2">{hm.designation}</p>
                            <a href={`tel:${hm.mobile}`} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors">
                                <Phone size={18} /> কল করুন
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Teachers List */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 px-2">অন্যান্য শিক্ষকমণ্ডলী</h3>
                {teachers.filter(t => !['Principal', 'Headmaster', 'সুপার', 'মুহতামিম'].includes(t.designation)).map(teacher => (
                    <div key={teacher.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0"><img src={teacher.imageUrl || logo} className="w-full h-full object-cover" /></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{teacher.full_name}</h4>
                            <p className="text-xs text-slate-500 font-bold">{teacher.designation || 'Teacher'}</p>
                        </div>
                        <div className="flex gap-3">
                            <a href={`tel:${teacher.mobile}`} className="text-emerald-500 bg-emerald-50 p-2 rounded-full"><Phone size={18} /></a>
                        </div>
                    </div>
                ))}
            </div>


            {/* Developer Profile - Compact & Centered */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white text-center relative overflow-hidden transition-all duration-300 max-w-xs mx-auto shadow-2xl shadow-slate-900/40">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">ডেভেলপার পরিচিতি</h3>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                        <img src="/assets/dev.png" className="w-full h-full rounded-full object-cover bg-slate-800" alt="Developer" />
                    </div>
                    <h4 className="font-bold text-xl mb-4">রাশেদুল করিম</h4>

                    <div className={`text-sm text-slate-300 text-justify bg-slate-800/50 p-4 rounded-xl leading-relaxed whitespace-pre-line ${!isDevExpanded ? 'line-clamp-4' : ''}`}>
                        {devBio}
                    </div>

                    <button
                        onClick={() => setIsDevExpanded(!isDevExpanded)}
                        className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-xs font-bold transition-colors shadow-lg shadow-emerald-900/50"
                    >
                        {isDevExpanded ? 'কিঞ্চিৎ পড়ুন' : 'বিস্তারিত পড়ুন'}
                    </button>

                    <p className="text-[10px] text-slate-500 mt-4 opacity-60">© 2026 Developed for Supia Nuria Dakhil Madrasa</p>
                </div>
            </div>
        </div>
    )


    return (
        <div className="min-h-screen bg-slate-50 font-bengali text-slate-800 relative overscroll-contain" style={{ overscrollBehaviorY: 'contain' }}>

            {/* --- HEADER --- */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <img src={logo} className="w-8 h-8" />
                    <span className="font-black text-slate-800">Student Panel</span>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="px-4 py-6 max-w-md mx-auto md:max-w-4xl lg:max-w-7xl w-full">
                {activeTab === 'home' && renderHome()}
                {activeTab === 'homework' && renderHomework()}
                {activeTab === 'result' && renderResult()}
                {activeTab === 'class' && renderClass()}
                {activeTab === 'notes' && renderNotes()}
                {activeTab === 'support' && renderSupport()}
            </div>

            {/* --- BOTTOM NAVIGATION (FIXED) --- */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-40 pb-safe">
                <div className="flex justify-around items-center py-3 max-w-2xl mx-auto">
                    <NavBtn icon={<Home size={20} />} label="হোম" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <NavBtn icon={<Book size={20} />} label="হোমওয়ার্ক" active={activeTab === 'homework'} onClick={() => setActiveTab('homework')} />
                    <NavBtn icon={<FileText size={20} />} label="রেজাল্ট" active={activeTab === 'result'} onClick={() => setActiveTab('result')} />
                    <NavBtn icon={<ClipboardCheck size={20} />} label="নোট" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
                    <NavBtn icon={<Users size={20} />} label="ক্লাস" active={activeTab === 'class'} onClick={() => setActiveTab('class')} />
                    <NavBtn icon={<HelpCircle size={20} />} label="সাপোর্ট" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {/* Logout Confirm Dialog */}
                {showLogoutConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl">
                            <h3 className="text-xl font-black text-slate-800 mb-2">লগআউট করতে চান?</h3>
                            <p className="text-slate-500 text-sm mb-6">আপনি কি নিশ্চিত যে আপনি লগআউট করে বের হতে চান?</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl text-slate-700">না</button>
                                <button onClick={confirmLogout} className="flex-1 py-3 bg-rose-500 font-bold rounded-xl text-white shadow-lg shadow-rose-500/30">হ্যাঁ</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Notice Detail Modal */}
                {selectedNotice && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedNotice(null)}>
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-slate-800">{selectedNotice.title || selectedNotice.notice_title}</h3>
                                <button onClick={() => setSelectedNotice(null)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                            </div>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedNotice.description || selectedNotice.details || selectedNotice.content || 'বিস্তারিত তথ্য দেওয়া হয়নি।'}</p>
                            <div className="mt-6 pt-4 border-t text-xs text-slate-400 font-bold">
                                প্রকাশিত: {formatDate(selectedNotice.createdAt || selectedNotice.date)}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Result Detail Modal */}
                {selectedResultStudent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedResultStudent(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedResultStudent(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center font-black text-xl text-slate-400">
                                    {selectedResultStudent.roll}
                                </div>
                                <h3 className="text-xl font-black text-slate-800">{selectedResultStudent.name}</h3>
                                <p className="font-bold text-slate-500">GPA: <span className="text-emerald-600">{selectedResultStudent.gpa}</span></p>
                            </div>

                            {/* Subject Wise Marks - assuming 'subjects' array in student result object */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedResultStudent.subjects ? (
                                    selectedResultStudent.subjects.map((sub, i) => (
                                        <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-xl font-bold text-sm">
                                            <span className="text-slate-600">{sub.name}</span>
                                            <span className="text-slate-900">{sub.marks} ({sub.grade})</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-400 text-sm">বিষয়ভিত্তিক নম্বর পাওয়া যায়নি</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const NavBtn = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-amber-500 scale-110' : 'text-slate-400'}`}>
        {icon}
        <span className="text-[10px] font-bold">{label}</span>
    </button>
)

export default StudentDashboard
