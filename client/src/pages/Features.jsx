// src/pages/Features.jsx
import React from 'react';
// Icon imports (use lucide-react, which is commonly used with shadcn/ui)
import { Users, FileText, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100'>
        <div className={`flex items-center justify-center h-12 w-12 rounded-full mb-4 ${color.bg} ${color.text}`}>
            {/* The Icon component passed as a prop */}
            <Icon size={24} />
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-3'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
    </div>
);

const Features = () => {
    // Define the features data
    const featuresData = [
        {
            icon: Users,
            title: "Teacher Efficiency: Simplify Grading",
            description: "Easily create classes, manage subjects, and review all pending practical submissions in one centralized dashboard. Spend less time organizing, more time teaching.",
            color: { bg: 'bg-slate-100', text: 'text-slate-700' },
        },
        {
            icon: FileText,
            title: "Student Experience: Effortless Submission",
            description: "Students can join classes instantly with a code, submit practicals (PDF/DOCX) quickly, and track their submission status (Pending, Approved, Rejected) in real-time.",
            color: { bg: 'bg-blue-100', text: 'text-blue-600' },
        },
        {
            icon: CheckCircle,
            title: "Secure & Cloud-Based Storage",
            description: "All documents are securely stored on Cloudinary, ensuring data safety and easy accessibility from any device. Never lose a practical again.",
            color: { bg: 'bg-green-100', text: 'text-green-600' },
        },
    ];

    return (
        <section className='py-16 md:py-24 bg-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* --- Section Header --- */}
                <div className='text-center mb-12 md:mb-16'>
                    <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
                        Key Features of <span className='text-slate-700'>LabLink</span>
                    </h2>
                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                        Designed to streamline every step of the practical submission and evaluation workflow.
                    </p>
                </div>

                {/* --- Features Grid (Responsive) --- */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {featuresData.map((feature, index) => (
                        <FeatureCard 
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;