"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { dashboard, login, register } from "@/routes"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Stats", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#cta" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const page = usePage()
  const auth = (page.props as { auth?: { user?: { name?: string } } })?.auth

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-xs"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 lg:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              {auth?.user ? (
                <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
                  <Link href={dashboard()}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Link href={login()}>Sign In</Link>
                  </Button>
                  <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
                    <Link href={register()}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-40 bg-background pt-20 lg:hidden"
          >
            <div className="container mx-auto px-6 py-8">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground py-3 border-b border-border"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-4 mt-8">
                {auth?.user ? (
                  <Button asChild className="w-full justify-center bg-foreground text-background">
                    <Link href={dashboard()}>Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full justify-center bg-transparent">
                      <Link href={login()}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full justify-center bg-foreground text-background">
                      <Link href={register()}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
