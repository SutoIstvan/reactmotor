'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

const navLinks = [
    { label: 'Rólunk', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Stats', href: '#stats' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#cta' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { name?: string } } })?.auth;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-background/80 border-border/50 border-b shadow-xs backdrop-blur-lg'
                        : 'bg-transparent',
                )}
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <nav className="flex h-16 items-center justify-between lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-10 w-auto object-contain lg:h-10"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 lg:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTAs */}
                        <div className="hidden items-center gap-4 lg:flex">
                            {auth?.user ? (
                                <Button
                                    asChild
                                    className="bg-foreground text-background hover:bg-foreground/90"
                                >
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <Link href={login()}>Sign In</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        <Link href={register()}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-foreground p-2 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </nav>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-background fixed inset-0 z-40 pt-20 lg:hidden"
                    >
                        <div className="container mx-auto px-6 py-8">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="text-foreground border-border border-b py-3 text-lg font-medium"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-8 flex flex-col gap-4">
                                {auth?.user ? (
                                    <Button
                                        asChild
                                        className="bg-foreground text-background w-full justify-center"
                                    >
                                        <Link href={dashboard()}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full justify-center bg-transparent"
                                        >
                                            <Link href={login()}>Sign In</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            className="bg-foreground text-background w-full justify-center"
                                        >
                                            <Link href={register()}>
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
