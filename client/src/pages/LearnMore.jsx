// src/pages/LearnMore.jsx (Enhanced Visual Design)
import React from "react";
import { CheckCircle, Layers, FileUp, Shield, UserCheck, Users, XCircle, BarChart2 } from "lucide-react";

const LearnMore = () => {
    // --- Project Color Scheme ---
    const COLORS = {
        primary: '#2B2B2B',      // Primary text
        secondary: '#284B63',    // Buttons, dark accents
        accent: '#4c7cff',       // Illustrations, highlights
        hoverAccent: '#3C6E71',  // CTA hover
        softAccent: '#a6e6ff',   // Soft accents
        bgLight: '#f9fafb',      // Light background
        textMuted: '#374151',
    };

    // Data for the 'Our Solution' section
    const solutionFeatures = [
        {
            title: "Digital Submission",
            description: "Students upload practicals (PDF/Word) directly, eliminating printing costs and hassle.",
            icon: FileUp,
            color: COLORS.accent,
        },
        {
            title: "Streamlined Evaluation",
            description: "Teachers easily check, approve, or reject submissions and provide quick feedback.",
            icon: UserCheck,
            color: COLORS.hoverAccent,
        },
        {
            title: "Digital Approval & Lock",
            description: "Approved files receive a 'Digitally Approved' status and are immediately locked against editing.",
            icon: CheckCircle,
            color: COLORS.secondary,
        },
        {
            title: "Real-Time Status Tracking",
            description: "Monitor status (Pending, Approved, Rejected) and track overall submission progress instantly.",
            icon: BarChart2,
            color: COLORS.accent,
        },
        {
            title: "Role-Based Security",
            description: "Strict security ensures students and teachers only access their assigned data and subjects.",
            icon: Shield,
            color: COLORS.secondary,
        },
        {
            title: "Organized Filtering",
            description: "Teachers can filter submissions class-wise (FY/SY/TY) for efficient workload management.",
            icon: Users,
            color: COLORS.hoverAccent,
        },
    ];

    // Data for the 'Problem' section
    const problems = [
        { text: "Too much paper & money wasted", icon: XCircle, color: 'text-red-500' },
        { text: "Hard to track who submitted", icon: XCircle, color: 'text-red-500' },
        { text: "Slow manual checking and signing", icon: XCircle, color: 'text-red-500' },
        { text: "Difficult to store or find old practicals", icon: XCircle, color: 'text-red-500' },
    ];


    return (
        <section className="bg-white" id="learn-more">
            
            {/* 1. Hero Section (using the blue accent gradient) */}
            <div className={`bg-gradient-to-r from-blue-50/70 to-indigo-100/70 py-20 px-6 text-center border-b border-gray-200`}>
                <h1 className={`text-4xl md:text-6xl font-extrabold text-${COLORS.primary} leading-tight`}>
                    Revolutionize <span className={`text-[${COLORS.secondary}]`}>Lab Submissions</span>
                </h1>
                <p className={`mt-4 text-xl text-${COLORS.textMuted} max-w-3xl mx-auto`}>
                    LabLink is the digital platform designed to eliminate paper waste, streamline evaluation, and simplify practical work for colleges.
                </p>
            </div>

            {/* 2. The Problem vs. The Solution (Visual Comparison) */}
            <div className="container mx-auto px-6 py-20">
                <h2 className={`text-4xl font-extrabold text-${COLORS.primary} text-center mb-16`}>
                    Solving the Paperwork Pain
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: The Pain Point */}
                    <div className="p-8 bg-gray-100 rounded-xl shadow-inner border-l-4 border-red-500">
                        <h3 className={`text-2xl font-bold text-red-600 mb-6 flex items-center`}>
                            <Layers className="h-6 w-6 mr-3" />
                            Current Manual Process
                        </h3>
                        <ul className="space-y-4 text-lg text-gray-700">
                            <li>• Students print bulky Word files (more pages).</li>
                            <li>• Teachers manually check, sign, and manage paper piles.</li>
                            <li>• Archiving and retrieval are time-consuming physical tasks.</li>
                        </ul>
                        <div className="mt-8 space-y-3">
                            {problems.map((item, index) => (
                                <p key={index} className={`flex items-center font-semibold ${item.color}`}>
                                    <item.icon className={`h-5 w-5 mr-2 flex-shrink-0`} />
                                    {item.text}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Right: The Digital Solution */}
                    <div className="p-8 bg-white rounded-xl shadow-2xl border-l-4 border-green-500 transform transition duration-500 hover:shadow-xl">
                        <h3 className={`text-2xl font-bold text-green-600 mb-6 flex items-center`}>
                            <CheckCircle className="h-6 w-6 mr-3" />
                            LabLink Digital Solution
                        </h3>
                        <ul className="space-y-4 text-lg text-gray-700">
                            <li>• **Instant Submission:** Upload a PDF/Word file directly.</li>
                            <li>• **Digital Tracking:** Real-time status for every practical.</li>
                            <li>• **Efficient Evaluation:** Approve, reject, and comment instantly online.</li>
                            <li>• **Secured Archiving:** Digital records are easily searchable and stored.</li>
                        </ul>
                         <div className="mt-8 flex justify-center p-4 bg-[#f0f9ff] rounded-lg border-2 border-dashed border-[#4c7cff]">
                            <p className={`text-sm text-[${COLORS.textMuted}]`}>
                                Go **Paperless** and focus on **Learning**, not Logistics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Our Solution (Detailed Feature Grid) */}
            <div className={`bg-[${COLORS.bgLight}] py-20 px-6 border-t border-gray-200`}>
                <h2 className={`text-3xl font-bold text-${COLORS.primary} text-center mb-12`}>
                    Key Features of LabLink
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {solutionFeatures.map((feature, index) => (
                        <div key={index} className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-200">
                            <feature.icon className={`h-10 w-10 mb-4 text-[${feature.color}]`} />
                            <h3 className={`font-bold text-xl text-[${COLORS.secondary}] mb-2`}>{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 4. Workflow Section */}
            <div className="container mx-auto px-6 py-20">
                <h2 className={`text-3xl font-bold text-${COLORS.primary} mb-10 text-center`}>
                    <span className={`text-[${COLORS.secondary}]`}>🔄</span> The LabLink Workflow
                </h2>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line Connector */}
                    <div className={`absolute left-4 top-0 bottom-0 w-1 bg-gray-200 hidden sm:block`}></div>

                    <ol className="space-y-12 text-gray-700 text-lg">
                        <li className="relative flex items-start sm:pl-10">
                            <div className={`sm:absolute sm:left-0 sm:top-0 h-8 w-8 rounded-full bg-[${COLORS.accent}] flex items-center justify-center text-white font-bold flex-shrink-0`}>1</div>
                            <div className="sm:ml-6">
                                <h4 className={`font-semibold text-xl text-[${COLORS.secondary}]`}>Student Upload</h4>
                                <p>Select subject and practical number, then upload the file (PDF/Word). The status instantly becomes **Pending**.</p>
                            </div>
                        </li>

                        <li className="relative flex items-start sm:pl-10">
                            <div className={`sm:absolute sm:left-0 sm:top-0 h-8 w-8 rounded-full bg-[${COLORS.secondary}] flex items-center justify-center text-white font-bold flex-shrink-0`}>2</div>
                            <div className="sm:ml-6">
                                <h4 className={`font-semibold text-xl text-[${COLORS.secondary}]`}>Teacher Evaluation</h4>
                                <p>Teacher views the file, adds comments, and clicks **Approve** or **Reject**.</p>
                            </div>
                        </li>

                        <li className="relative flex items-start sm:pl-10">
                            <div className={`sm:absolute sm:left-0 sm:top-0 h-8 w-8 rounded-full bg-[${COLORS.hoverAccent}] flex items-center justify-center text-white font-bold flex-shrink-0`}>3</div>
                            <div className="sm:ml-6">
                                <h4 className={`font-semibold text-xl text-[${COLORS.secondary}]`}>Completion & Tracking</h4>
                                <p>If **Approved**, the file is locked and marked complete. If **Rejected**, the student is alerted to re-upload. Progress is tracked by both parties.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

        </section>
    );
};

export default LearnMore;