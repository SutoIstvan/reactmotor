"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { register } from "@/routes"

// Magnetic floating stat card with parallax
function FloatingStatCard({
  position,
  label,
  value,
  subtext,
  color,
  delay,
}: {
  position: "top-left" | "bottom-right"
  label: string
  value: string
  subtext: string
  color: "teal" | "coral"
  delay: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Inverse parallax - cards drift opposite to cursor
  const cardX = useTransform(x, [-200, 200], [15, -15])
  const cardY = useTransform(y, [-200, 200], [10, -10])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const positionClasses = {
    "top-left": "top-10 -left-4 lg:left-0",
    "bottom-right": "bottom-20 -right-4 lg:right-0",
  }

  const colorClasses = {
    teal: "text-teal",
    coral: "text-coral",
  }

  return (
    <motion.div
      ref={cardRef}
      className={`absolute ${positionClasses[position]} bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg shadow-foreground/5 z-20`}
      initial={{ opacity: 0, x: position === "top-left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 100 }}
      style={{ x: cardX, y: cardY }}
    >
      {/* Sine wave bobbing */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: position === "top-left" ? 0 : 0.5,
        }}
      >
        <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">
          {label}
        </div>
        <div className={`text-2xl font-bold ${colorClasses[color]} tracking-tight`}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{subtext}</div>
      </motion.div>
    </motion.div>
  )
}

const heroBackgroundImage = "https://vexora-nextjs.vercel.app/images/hero/bg-1.png"
// const heroBackgroundImage = "https://www.markamotor.hu/assets/images/banner-background.png"
// const heroBackgroundImage = "bg.png"

const heroSlides = [
  "https://markamotor.hu/assets/images/banner_right_image3.png",
  "https://markamotor.hu/assets/images/banner_right_image8.png",
  "https://www.markamotor.hu/assets/images/banner_right_image9.png",
]

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next")

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlideDirection("next")
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section
      className="relative min-h-[700px] flex items-center overflow-hidden bg-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, var(--background) 10%, transparent), color-mix(in srgb, var(--background) 55%, transparent)), url(${heroBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ultra-thin dotted grid with radial mask */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, color-mix(in srgb, var(--background) 15%, transparent) 90%),
            radial-gradient(circle, color-mix(in srgb, var(--foreground) 8%, transparent) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "100% 100%, 40px 40px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center min-h-[700px] pt-24">
          {/* Left content - 2 columns */}
          <div className="lg:col-span-2 space-y-8 relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 text-teal border border-teal/20 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
                </span>
                Üdvözöljük honlapunkon!
              </span>
            </motion.div>

            {/* Headline with tighter letter-spacing */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] text-balance"
              style={{ letterSpacing: "-0.05em" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Találd meg a hozzád illő {" "}
              <span className="relative inline-block">
                {/* Gradient text with glow */}
                <span
                  className="relative z-10 bg-gradient-to-r from-teal to-red-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: "0 0 40px hsl(0 72% 56% / 0.3)",
                  }}
                >
                  motort!
                </span>
                {/* Underline highlight */}
                <motion.span
                  className="absolute bottom-1 left-0 h-3 w-full bg-gradient-to-r from-teal/20 to-red-400/20 -z-0 rounded-sm"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{ originX: 0 }}
                />
              </span>{" "}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Vállalkozásunk használt nagy motorokkal, új robogókkal, teljes körű szerviz, műszaki és eredetiség vizsga, biztosítás, átírás lebonyolításával várja ügyfeleit!
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 group px-8 shadow-lg shadow-foreground/10 transition-all hover:shadow-xl hover:shadow-foreground/15"
              >
                <Link href={register()}>
                  Részletek
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-border hover:bg-muted group bg-transparent transition-all hover:border-teal/30"
              >
                <a href="#features">
                  <Play className="mr-2 h-4 w-4" />
                  Elérhetőségek
                </a>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex -space-x-2">
                {[
                  "bg-coral",
                  "bg-teal",
                  "bg-gold",
                  "bg-foreground",
                ].map((color, i) => (
                  <motion.div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-xs font-medium text-background shadow-xs`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                  >
                    {String.fromCharCode(65 + i)}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,400+</span>{" "}
                teams building
              </div>
            </motion.div>
          </div>

          {/* Right content - Slider - 3 columns */}
          <motion.div
            className="lg:col-span-3 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-[600px] mx-auto">
              <div className="relative flex h-full min-h-[420px] items-center justify-center overflow-hidden rounded-3xl p-8">
                <AnimatePresence initial={false} mode="sync" custom={slideDirection}>
                  <motion.img
                    key={heroSlides[activeSlide]}
                    src={heroSlides[activeSlide]}
                    alt={`Data infrastructure illustration ${activeSlide + 1}`}
                    custom={slideDirection}
                    initial={{ x: slideDirection === "next" ? "100%" : "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: slideDirection === "next" ? "-100%" : "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute max-h-[100%] w-auto max-w-[100%] object-contain"
                  />
                </AnimatePresence>
                <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-background/70 px-3 py-2 backdrop-blur-sm">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      aria-current={activeSlide === index}
                      onClick={() => {
                        setSlideDirection(index > activeSlide ? "next" : "previous")
                        setActiveSlide(index)
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${activeSlide === index ? "w-6 bg-teal" : "w-2 bg-muted-foreground/50"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Magnetic Floating stat cards with parallax */}
              <FloatingStatCard
                position="top-left"
                label="Processing"
                value="2.4M"
                subtext="events/sec"
                color="teal"
                delay={1.5}
              />

              <FloatingStatCard
                position="bottom-right"
                label="Uptime"
                value="99.99%"
                subtext="guaranteed"
                color="coral"
                delay={1.8}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
