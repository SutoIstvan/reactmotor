'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Gauge, Calendar, Navigation, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MotorData {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    description?: string;
    short_description?: string;
    cylinders?: number;
    cylinders_cm3?: number;
    year: number;
    km: number;
    performance?: string;
    condition?: string | null;
    top?: string | boolean;
    driver_license?: string | null;
    main_image?: string | null;
    brand_id?: number;
    category_id?: number;
    brand?: { id: number; name: string };
    category?: { id: number; name: string };
    images?: Array<{ id: number; url: string; position?: number }>;
}

export function formatImageUrl(path: string | null | undefined): string {
    if (!path || path === 'NULL' || path === 'null') return '/img/moto-1.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/^\/+/, '');
    return `/${clean}`;
}

export function formatHuf(amount: number | string | null | undefined): string {
    if (!amount && amount !== 0) return '0 Ft';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('hu-HU').format(num) + ' Ft';
}

interface CatalogMotorCardProps {
    motor: MotorData;
    onQuickView?: (motor: MotorData) => void;
    delay?: number;
    layout?: 'grid' | 'list';
}

export function CatalogMotorCard({ motor, onQuickView, delay = 0, layout = 'grid' }: CatalogMotorCardProps) {
    const MAX_CARD_IMAGES = 5;

    // Limit card slider preview to at most 5 images to keep the page lightweight and fast
    const slideImages = useMemo(() => {
        const list: string[] = [];
        if (motor.main_image) {
            list.push(formatImageUrl(motor.main_image));
        }
        if (motor.images && motor.images.length > 0) {
            for (const img of motor.images) {
                if (list.length >= MAX_CARD_IMAGES) break;
                const url = typeof img === 'string' ? img : img.url;
                const formatted = formatImageUrl(url);
                if (formatted && !list.includes(formatted)) {
                    list.push(formatted);
                }
            }
        }
        if (list.length === 0) {
            list.push('/img/moto-1.png');
        }
        return list.slice(0, MAX_CARD_IMAGES);
    }, [motor]);

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

    const isTop = motor.top === '1' || motor.top === true;
    const hasDiscount = Boolean(motor.discount_price && motor.discount_price > 0 && motor.discount_price < motor.price);
    const categoryName = motor.category?.name || 'Motorkerékpár';
    const brandName = motor.brand?.name || '';
    const formattedMileage = (motor.km || 0).toLocaleString('hu-HU');

    // Power text: LE or cm3
    const powerText = motor.performance
        ? `${motor.performance} LE`
        : motor.cylinders_cm3
            ? `${motor.cylinders_cm3} cm³`
            : '-';

    if (layout === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay }}
                className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/70 bg-card/90 dark:bg-card/75 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-teal/50 hover:shadow-xl hover:shadow-teal/5"
            >
                {/* Left: Image Carousel Slider */}
                <div className="group/slider relative w-full sm:w-72 md:w-80 h-56 sm:h-auto min-h-[220px] shrink-0 overflow-hidden bg-muted/40 select-none">
                    <div
                        className="flex h-full w-full transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                    >
                        {slideImages.map((src, i) => (
                            <div key={i} className="h-full w-full shrink-0 grow-0 basis-full overflow-hidden">
                                <img
                                    src={src}
                                    alt={`${motor.name} - ${i + 1}`}
                                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/slider:scale-105"
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/img/moto-1.png';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Floating Badges */}
                    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {isTop && (
                                <span className="rounded-full border border-teal/40 bg-teal/80 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    Kiemelt
                                </span>
                            )}
                            {motor.condition && (
                                <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    {motor.condition}
                                </span>
                            )}
                        </div>
                        <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                            {motor.year}
                        </span>
                    </div>

                    {/* Left/Right Arrows */}
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

                    {/* Dots */}
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

                {/* Right: Info & Specs & Actions */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {brandName} • {categoryName}
                            </div>
                            {motor.driver_license && (
                                <span className="text-[11px] text-muted-foreground font-medium">
                                    Jogosítvány: <span className="text-foreground font-semibold">{motor.driver_license}</span>
                                </span>
                            )}
                        </div>

                        <h3
                            onClick={() => onQuickView?.(motor)}
                            className="mt-1 text-lg sm:text-xl font-bold text-foreground hover:text-teal transition-colors cursor-pointer"
                            title={motor.name}
                        >
                            {motor.name}
                        </h3>

                        {(motor.short_description || motor.description) && (
                            <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {motor.short_description || motor.description}
                            </p>
                        )}

                        {/* Specs strip */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-6 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-xs">
                            <div className="flex items-center gap-1.5">
                                <Gauge className="size-3.5 text-teal shrink-0" />
                                <span className="text-muted-foreground">Erő:</span>
                                <span className="font-bold text-foreground">{powerText}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-teal shrink-0" />
                                <span className="text-muted-foreground">Évjárat:</span>
                                <span className="font-bold text-foreground">{motor.year}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Navigation className="size-3.5 text-teal shrink-0" />
                                <span className="text-muted-foreground">KM:</span>
                                <span className="font-bold text-foreground">{formattedMileage} km</span>
                            </div>
                            {motor.cylinders_cm3 && (
                                <div className="hidden md:flex items-center gap-1.5">
                                    <span className="text-muted-foreground">Lökettérfogat:</span>
                                    <span className="font-bold text-foreground">{motor.cylinders_cm3} cm³</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                            {hasDiscount ? (
                                <>
                                    <span className="text-xs text-muted-foreground line-through">
                                        {formatHuf(motor.price)}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-teal">
                                        {formatHuf(motor.discount_price)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs text-muted-foreground">Ár:</span>
                                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                                        {formatHuf(motor.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => onQuickView?.(motor)}
                            className="bg-foreground text-background hover:bg-foreground/90 rounded-xl font-medium text-xs px-4 py-2 cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                            <Eye className="size-3.5" />
                            <span>Részletek megtekintése</span>
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/90 dark:bg-card/75 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-teal/50 hover:shadow-xl hover:shadow-teal/5"
        >
            {/* Top: Image Carousel Slider matching Ajánlott motorok */}
            <div className="group/slider relative w-full h-52 sm:h-56 overflow-hidden bg-muted/40 select-none">
                <div
                    className="flex h-full w-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                    {slideImages.map((src, i) => (
                        <div key={i} className="h-full w-full shrink-0 grow-0 basis-full overflow-hidden">
                            <img
                                src={src}
                                alt={`${motor.name} - ${i + 1}`}
                                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/slider:scale-105"
                                loading={i === 0 ? 'eager' : 'lazy'}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/img/moto-1.png';
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Floating Badges over photo */}
                <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {isTop && (
                            <span className="rounded-full border border-teal/40 bg-teal/80 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                                Kiemelt
                            </span>
                        )}
                        {motor.condition && (
                            <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                                {motor.condition}
                            </span>
                        )}
                    </div>
                    <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                        {motor.year}
                    </span>
                </div>

                {/* Left/Right Arrows on hover (if multiple images) */}
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

                {/* Dots Indicator */}
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
                        {brandName} • {categoryName}
                    </div>

                    {/* Model Title */}
                    <h3
                        onClick={() => onQuickView?.(motor)}
                        className="mt-1 text-base sm:text-lg font-bold text-foreground line-clamp-1 group-hover:text-teal transition-colors cursor-pointer"
                        title={motor.name}
                    >
                        {motor.name}
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
                                    {powerText}
                                </div>
                            </div>

                            <div className="flex flex-col items-center px-1">
                                <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-1">
                                    <Calendar className="size-3 text-teal" />
                                    Évjárat
                                </div>
                                <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">
                                    {motor.year}
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

                {/* Price & CTA Button */}
                <div className="mt-1 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="text-[11px] text-muted-foreground line-through">
                                    {formatHuf(motor.price)}
                                </span>
                                <span className="text-base sm:text-lg font-extrabold tracking-tight text-teal">
                                    {formatHuf(motor.discount_price)}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-[11px] text-muted-foreground">Ár:</span>
                                <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
                                    {formatHuf(motor.price)}
                                </span>
                            </>
                        )}
                    </div>

                    {/* <Button
                        type="button"
                        size="sm"
                        onClick={() => onQuickView?.(motor)}
                        className="bg-foreground text-background hover:bg-foreground/90 rounded-xl font-medium text-xs px-3.5 py-1.5 cursor-pointer flex items-center gap-1.5"
                    >
                        <Eye className="size-3.5" />
                        <span>Részletek</span>
                    </Button> */}
                </div>
            </div>
        </motion.div>
    );
}
