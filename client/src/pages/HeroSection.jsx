// src/pages/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Adjust path as needed

// Optional: Placeholder for an illustrative image
// You might want to replace this with an actual SVG or image in src/assets
import heroImage from '../assets/hero-illustration.svg'; // Create this file or replace path

const HeroSection = () => {
    return (
        <section className='relative bg-gray-50 py-16 md:py-24 lg:py-32 overflow-hidden'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12'>
                {/* --- Content Column (Left on desktop) --- */}
                <div className='md:w-1/2 text-center md:text-left'>
                    <span className='inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 mb-4'>
                        Simplify Your Lab Work
                    </span>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6'>
                        Seamless Practical Submissions with{' '}
                        <span className='text-slate-700'>LabLink</span>
                    </h1>
                    <p className='text-lg sm:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0'>
                        LabLink streamlines the process of submitting and evaluating practical work for students and teachers in colleges. Focus on learning, not logistics.
                    </p>
                    <div className='flex justify-center md:justify-start space-x-4'>
                        <Link to='/signup'>
                            <Button size='lg'>Get Started</Button>
                        </Link>
                        <Link to='/features'>
                            <Button size='lg' variant='outline'>Learn More</Button>
                        </Link>
                    </div>
                </div>

                {/* --- Image Column (Right on desktop) --- */}
                <div className='md:w-1/2 flex justify-center md:justify-end'>
                    {/* Placeholder image. Replace with a real illustration. */}
                    <img
                        src={heroImage} 
                        alt='Practical Submission Illustration'
                        className='max-w-full h-auto rounded-lg shadow-xl'
                        style={{ maxHeight: '450px' }} // Limit image height
                    />
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