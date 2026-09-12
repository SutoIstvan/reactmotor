'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, Gauge, Calendar, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Motorcycle } from './motorcycle-card';

export interface MotorcycleSliderCardProps {
    motorcycle: Motorcycle & {
        images?: string[];
    };
    className?: string;
    delay?: number;
    layout?: boolean;
    ctaHref?: string;
    ctaText?: string;
}

export function MotorcycleSliderCard({
    motorcycle,
    className = '',
    delay = 0,
    layout = false,
    ctaHref = '#cta',
    ctaText = 'Érdekel a motor',
}: MotorcycleSliderCardProps) {
    const slideImages =
        motorcycle.images && motorcycle.images.length > 0
            ? motorcycle.images
            : [motorcycle.image];

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const nextSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndex((prev) => (prev + 1) % slideImages.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
    };

    const categoryText =
        motorcycle.category ||
        motorcycle.designLabel ||
        motorcycle.design ||
        'Motorkerékpár';

    const formattedMileage = motorcycle.mileageKm.toLocaleString('hu-HU');

    const badgeText = motorcycle.badge || motorcycle.status;

    return (
        <motion.div
            layout={layout}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card/90 dark:bg-card/75 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-teal/50 hover:shadow-xl hover:shadow-teal/5 ${className}`}
        >
            {/* Top: Full-bleed edge-to-edge image slider (Horizontal Carousel Slide) */}
            <div className="group/slider relative w-full h-52 sm:h-56 overflow-hidden bg-muted/40 select-none">
                <div
                    className="flex h-full w-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                    {slideImages.map((src, i) => (
                        <div key={i} className="h-full w-full shrink-0 grow-0 basis-full overflow-hidden">
                            <img
                                src={src}
                                alt={`${motorcycle.title} - ${i + 1}`}
                                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/slider:scale-105"
                                loading={i === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                    ))}
                </div>

                {/* Floating Badges over the photo */}
                <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
                    {badgeText ? (
                        <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            {badgeText}
                        </span>
                    ) : (
                        <span />
                    )}
                    <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        {motorcycle.year}
                    </span>
                </div>

                {/* Navigation Arrows on Hover (only if > 1 image) */}
                {slideImages.length > 1 && (
                    <div className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-10">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Előző kép"
                            className="pointer-events-auto h-7 w-7 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm shadow-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Következő kép"
                            className="pointer-events-auto h-7 w-7 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm shadow-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Subtle Dots Indicator */}
                {slideImages.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center z-10 pointer-events-auto">
                        <div className="flex items-center gap-1 rounded-full px-2 py-0.5">
                            {slideImages.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveImageIndex(i);
                                    }}
                                    aria-label={`Kép ${i + 1}`}
                                    className="p-0.5 cursor-pointer"
                                >
                                    <span
                                        className={`block size-1.5 rounded-full transition-all ${activeImageIndex === i
                                            ? 'bg-teal w-3.5'
                                            : 'bg-white/50 hover:bg-white'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Card Content with Padding */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Brand & Category */}
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {motorcycle.brand} • {categoryText}
                    </div>

                    {/* Model Title */}
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground line-clamp-1 group-hover:text-teal transition-colors">
                        {motorcycle.title}
                    </h3>

                    {/* Key Specs: Full-width edge-to-edge strip */}
                    <div className="-mx-5 my-4 border-y border-border/60 bg-muted/30 py-3">
                        <div className="grid grid-cols-3 divide-x divide-border/60 text-center text-xs">
                            <div className="flex flex-col items-center px-1">
                                <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-1">
                                    <Gauge className="size-3 text-teal" />
                                    Erő
                                </div>
                                <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">
                                    {motorcycle.powerHp} LE
                                </div>
                            </div>

                            <div className="flex flex-col items-center px-1">
                                <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-1">
                                    <Calendar className="size-3 text-teal" />
                                    Évjárat
                                </div>
                                <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">
                                    {motorcycle.year}
                                </div>

                            </div>

                            <div className="flex flex-col items-center px-1">
                                <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-1">
                                    <Navigation className="size-3 text-teal" />
                                    KM
                                </div>
                                <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">
                                    {formattedMileage}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-1">
                    <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">Ár:</span>
                        <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
                            {motorcycle.priceHuf}
                        </span>
                    </div>

                    {/* <Button
                        asChild
                        className="w-full bg-foreground text-background hover:bg-foreground/90 cursor-pointer rounded-xl font-medium text-sm transition-all group/btn"
                    >
                        <a href={ctaHref}>
                            <span>{ctaText}</span>
                            <ArrowUpRight className="ml-1.5 size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                    </Button> */}
                </div>
            </div>
        </motion.div>
    );
}
