'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link } from '@inertiajs/react';

const footerLinks = {
    Product: [
        'Features',
        'Pricing',
        'Integrations',
        'Changelog',
        'Documentation',
    ],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    Resources: ['Community', 'Contact', 'Support', 'Status', 'API Reference'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
    return (
        <footer className="bg-foreground text-background pt-20 pb-8">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Main footer content */}
                <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
                    {/* Brand column */}
                    <div className="col-span-2 mb-8 md:col-span-3 lg:col-span-1 lg:mb-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Logo */}
                            <Link
                                href="/"
                                className="mb-4 flex items-center gap-2"
                            >
                                <div className="bg-teal flex h-8 w-8 items-center justify-center rounded-lg">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="text-foreground h-5 w-5"
                                        fill="currentColor"
                                    >
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">
                                    DataFlow
                                </span>
                            </Link>
                            <p className="text-background/60 mb-6 max-w-xs text-sm leading-relaxed">
                                Build, deploy, and scale your data
                                infrastructure with confidence.
                            </p>
                            {/* Social links */}
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="bg-background/10 text-background/60 hover:bg-background/20 hover:text-background flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(
                        ([category, links], index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <h4 className="text-background mb-4 text-sm font-semibold">
                                    {category}
                                </h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-background/60 hover:text-teal text-sm transition-colors"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ),
                    )}
                </div>

                {/* Divider */}
                <div className="border-background/10 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-background/50 text-sm">
                            &copy; {new Date().getFullYear()} DataFlow. All
                            rights reserved.
                        </p>
                        <div className="text-background/50 flex items-center gap-6 text-sm">
                            <a
                                href="#"
                                className="hover:text-background transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-background transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-background transition-colors"
                            >
                                Cookie Settings
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
