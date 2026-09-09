'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
    {
        icon: ShieldCheck,
        title: 'Garantált minőség',
        description: 'Minden jármű alapos műszaki átvizsgáláson esik át.',
    },
    {
        icon: Wrench,
        title: 'Szakszerű szerviz',
        description: 'Tapasztalt szerelők és modern diagnosztikai háttér.',
    },
    {
        icon: CheckCircle2,
        title: 'Teljes körű ügyintézés',
        description: 'Hitel, biztosítás és átírás sorban állás nélkül.',
    },
];

export function AboutSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Subtle background glow */}
            <div className="bg-teal/5 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left Column: Text & Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -40 }
                        }
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="flex flex-col items-center text-center lg:items-start lg:text-left"
                    >
                        {/* Pill badge */}
                        <span className="bg-muted text-muted-foreground mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                            Rólunk
                        </span>

                        {/* Heading */}
                        <h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight text-pretty sm:text-4xl lg:text-5xl">
                            Szenvedélyünk a motorozás,{' '}
                            <span className="text-teal">
                                garancia a szakértelem
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground mb-8 max-w-xl text-base leading-relaxed lg:text-lg">
                            Több mint 15 éve nyújtunk megbízható megoldásokat
                            motorkerékpárok és gépjárművek adásvételében,
                            szervizelésében és teljes körű ügyintézésében.
                            Nálunk a precizitás és az ügyfél-elégedettség az
                            első: nincsenek rejtett hibák vagy kellemetlen
                            meglepetések.
                        </p>

                        {/* Highlights List */}
                        <div className="mb-10 grid w-full gap-4 sm:grid-cols-1">
                            {highlights.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 20 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.2 + idx * 0.1,
                                    }}
                                    className="flex items-start gap-3.5 text-left"
                                >
                                    <div className="border-teal/20 bg-teal/10 text-teal flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Action Buttons */}
                        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            <Button
                                asChild
                                size="lg"
                                className="group bg-foreground text-background hover:bg-foreground/90 cursor-pointer px-6"
                            >
                                <a href="#features">
                                    Szolgáltatásaink
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-border hover:bg-accent cursor-pointer bg-transparent"
                            >
                                <a href="#cta">Kapcsolatfelvétel</a>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Column: 3-Photo Overlapping Mosaic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={
                            isInView
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0.95 }
                        }
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: 'easeOut',
                        }}
                        className="flex flex-col items-center justify-center"
                    >
                        <div className="relative aspect-[7/8] h-full min-h-[380px] w-full sm:min-h-[460px] lg:min-h-[520px]">
                            {/* Photo 1: Top Small Accent Photo */}
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className="border-border/80 bg-accent absolute top-[12%] right-[50%] flex aspect-square w-[26%] justify-center overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xs"
                            >
                                <img
                                    alt="Részletek és felszerelés"
                                    className="size-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                    src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"
                                    loading="lazy"
                                />
                            </motion.div>

                            {/* Photo 2: Left Middle Main Photo */}
                            <motion.div
                                whileHover={{ scale: 1.03, rotate: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className="border-border/80 bg-accent absolute top-[36%] right-[50%] flex aspect-[5/6] w-[42%] justify-center overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xs"
                            >
                                <img
                                    alt="Prémium motorkerékpár bemutató"
                                    className="size-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
                                    loading="lazy"
                                />
                            </motion.div>

                            {/* Photo 3: Right Bottom Overlapping Photo */}
                            <motion.div
                                whileHover={{ scale: 1.03, rotate: -1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className="border-border/80 bg-accent absolute bottom-[36%] left-[54%] flex aspect-[5/6] w-[42%] justify-center overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xs"
                            >
                                <img
                                    alt="Szerviz és karbantartás"
                                    className="size-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                    src="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80"
                                    loading="lazy"
                                />
                            </motion.div>

                            {/* Decorative floating badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="border-border/80 bg-card/90 absolute right-[8%] bottom-[12%] hidden rounded-2xl border p-3.5 shadow-xl backdrop-blur-md sm:flex sm:items-center sm:gap-3"
                            >
                                <div className="bg-teal/10 text-teal flex h-9 w-9 items-center justify-center rounded-xl">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-foreground text-xs font-semibold">
                                        100% Megbízhatóság
                                    </div>
                                    <div className="text-muted-foreground text-[11px]">
                                        Hivatalos szervizháttér
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
