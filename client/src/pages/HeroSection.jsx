import React from 'react';
import { Link } from 'react-router-dom';
// Using a simple inline Button structure since the original path was relative
// and the required styling uses standard Tailwind classes.
import { LogIn, Key, UserPlus, FileText, CheckCheck, LayoutDashboard, ArrowDown } from 'lucide-react';

// Simplified Button component based on Shadcn/Tailwind conventions for this single file
const Button = ({ children, size = 'md', variant = 'default', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const sizeClasses = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg",
    };

    const variantClasses = {
        default: "bg-slate-700 text-white hover:bg-slate-800 shadow-md",
        outline: "bg-white text-slate-700 border border-slate-300 hover:bg-gray-100 shadow-sm",
    };

    return (
        <button 
            className={`${baseStyle} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Component for a single step in the workflow diagram
const WorkflowStep = ({ icon: Icon, title, description, colorClass = 'text-slate-700', isLast = false }) => (
    <div className="flex">
        {/* Left: Indicator */}
        <div className="flex flex-col items-center mr-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 ${colorClass} shadow-md`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            {!isLast && (
                <div className="h-full w-0.5 bg-gray-300"></div>
            )}
        </div>
        {/* Right: Content */}
        <div className={`pb-8 pt-1 ${!isLast ? 'border-l-0' : ''}`}>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
        </div>
    </div>
);

const WorkflowDiagram = () => (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform hover:scale-[1.01] transition duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3 flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2 text-blue-600" />
            LabLink Workflow Overview
        </h2>
        
        <div className="space-y-4">
            <WorkflowStep
                icon={LogIn}
                title="Secure Login"
                description="Teachers and students log in securely to their respective portals."
                colorClass="text-blue-600 border-blue-100"
            />
            
            <WorkflowStep
                icon={Key}
                title="Class & Code Creation (Teacher)"
                description="Teachers create classes, generate a unique subject code, and share it with students."
                colorClass="text-purple-600 border-purple-100"
            />
            
            <WorkflowStep
                icon={UserPlus}
                title="Student Enrollment"
                description="Students use the unique code to join the specific subject class instantly."
                colorClass="text-indigo-600 border-indigo-100"
            />
            
            <WorkflowStep
                icon={FileText}
                title="Practical Submission (Student)"
                description="Students upload their practical reports or files directly via the platform."
                colorClass="text-green-600 border-green-100"
            />
            
            <WorkflowStep
                icon={CheckCheck}
                title="Evaluation & Feedback (Teacher)"
                description="Teachers review pending submissions, grade them, and provide direct feedback."
                colorClass="text-red-600 border-red-100"
            />
            
            <WorkflowStep
                icon={LayoutDashboard}
                title="Real-time Status Tracking"
                description="Attractive dashboards show real-time status, pending tasks, and submission history for both roles."
                colorClass="text-slate-700 border-slate-100"
                isLast={true}
            />
        </div>
    </div>
);


const HeroSection = () => {
    return (
        <section className='relative bg-gray-50 py-16 md:py-24 lg:py-32 overflow-hidden'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row **lg:items-start** justify-between gap-12'>
                {/* --- Content Column (Left on desktop) --- */}
                <div className='lg:w-1/2 text-center lg:text-left **mt-12 lg:mt-0**'>
                    <span className='inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 mb-4'>
                        Simplify Your Lab Work
                    </span>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6'>
                        Seamless Practical Submissions with{' '}
                        <span className='text-slate-700'>LabLink</span>
                    </h1>
                    <p className='text-lg sm:text-xl text-gray-700 mb-8 max-w-lg mx-auto lg:mx-0'>
                        LabLink streamlines the process of submitting and evaluating practical work for students and teachers in colleges. Focus on learning, not logistics.
                    </p>
                 
                </div>

                {/* --- Workflow Diagram Column (Right on desktop) --- */}
                <div className='lg:w-1/2 flex justify-center lg:justify-end **mt-12 lg:mt-0**'>
                    <WorkflowDiagram />
                </div>
            </div>

            {/* Optional: Subtle background gradient/shape for visual interest */}
            <div className="absolute inset-0 z-0 opacity-10 blur-3xl" aria-hidden="true">
                <div className="relative left-1/2 -top-1/4 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a6e6ff] to-[#4c7cff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[100rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }}></div>
            </div>
        </section>
    );
};

export default HeroSection;