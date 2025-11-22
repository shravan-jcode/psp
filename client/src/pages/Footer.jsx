// src/pages/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Icons from lucide-react for social links
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'; 

const Footer = () => {
    // Define your navigation groups
    const links = [
        {
            title: "Quick Links",
            items: [
                { name: "Home", href: "/" },
                { name: "Features", href: "/features" },
                { name: "Pricing", href: "#" }, // Placeholder
                { name: "Support", href: "#" }, // Placeholder
            ],
        },
        {
            title: "Account",
            items: [
                { name: "Login", href: "/login" },
                { name: "Sign Up", href: "/signup" },
                { name: "Teacher Dashboard", href: "/teacher/dashboard" },
                { name: "Student Dashboard", href: "/student/dashboard" },
            ],
        },
        {
            title: "Legal",
            items: [
                { name: "Privacy Policy", href: "#" }, // Placeholder
                { name: "Terms of Service", href: "#" }, // Placeholder
            ],
        },
    ];

    const socialLinks = [
        { icon: Twitter, href: "#" },
        { icon: Linkedin, href: "#" },
        { icon: Github, href: "#" },
        { icon: Mail, href: "mailto:support@lablink.com" },
    ];

    return (
        <footer className='bg-slate-700 text-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* --- Top Section: Links and Brand --- */}
                <div className='grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-slate-600 pb-8'>
                    {/* Brand / Logo (Takes 2 columns on mobile/small screens) */}
                    <div className='col-span-2 md:col-span-2'>
                        <h3 className='text-2xl font-bold mb-3'>
                            <span className='text-blue-300'>Lab</span>Link
                        </h3>
                        <p className='text-slate-300 text-sm'>
                            Streamlining practical submissions for modern education.
                        </p>
                    </div>

                    {/* Navigation Columns (Takes 1 column each) */}
                    {links.map((section, index) => (
                        <div key={index}>
                            <h4 className='text-base font-semibold text-white mb-4'>{section.title}</h4>
                            <ul className='space-y-3'>
                                {section.items.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            to={item.href}
                                            className='text-slate-300 hover:text-white transition duration-200 text-sm'
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- Bottom Section: Copyright & Socials --- */}
                <div className='flex flex-col md:flex-row items-center justify-between pt-8 space-y-4 md:space-y-0'>
                    {/* Copyright */}
                    <p className='text-sm text-slate-400'>
                        &copy; {new Date().getFullYear()} LabLink. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div className='flex space-x-6'>
                        {socialLinks.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <a 
                                    key={index}
                                    href={social.href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-slate-400 hover:text-white transition duration-200'
                                    aria-label={`Link to ${Icon.displayName || 'Social Media'}`}
                                >
                                    <Icon size={20} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;