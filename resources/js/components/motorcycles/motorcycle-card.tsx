'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Gauge, Calendar, Navigation, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Motorcycle {
    id: string;
    title: string;
    brand: string;
    category?: string;
    design?: string;
    designLabel?: string;
    powerHp: number;
    powerKw: number;
    engineCc?: number;
    year: number;
    mileageKm: number;
    priceHuf: string;
    image: string;
    badge?: string;
    status?: string;
    badgeColor?: 'teal' | 'coral' | 'gold';
    highlight?: string;
}

export interface MotorcycleCardProps {
    motorcycle: Motorcycle;
    className?: string;
    delay?: number;
    layout?: boolean;
    ctaHref?: string;
    ctaText?: string;
    showBadge?: boolean;
    showCategory?: boolean;
    showSpecs?: boolean;
    showPrice?: boolean;
    showCta?: boolean;
}

export function MotorcycleCard({
    motorcycle,
    className = '',
    delay = 0,
    layout = false,
    ctaHref = '#cta',
    ctaText = 'Érdekel a motor',
    showBadge = true,
    showCategory = true,
    showSpecs = true,
    showPrice = true,
    showCta = true,
}: MotorcycleCardProps) {
    const badgeText = motorcycle.badge || motorcycle.status;
    const badgeVariant = motorcycle.badgeColor || 'teal';

    const getBadgeClasses = (variant: 'teal' | 'coral' | 'gold') => {
        switch (variant) {
            case 'coral':
                return 'bg-coral/15 text-coral border-coral/30';
            case 'gold':
                return 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30';
            case 'teal':
            default:
                return 'bg-teal/15 text-teal border-teal/30';
        }
    };

    const categoryText =
        motorcycle.category ||
        motorcycle.designLabel ||
        motorcycle.design ||
        'Motorkerékpár';

    const formattedMileage =
        motorcycle.mileageKm >= 1000
            ? `${motorcycle.mileageKm.toLocaleString('hu-HU')} km`
            : `${motorcycle.mileageKm} km`;

    return (
        <motion.div
            layout={layout}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/90 dark:bg-card/75 backdrop-blur-md p-5 shadow-lg transition-all duration-300 hover:border-teal/50 hover:shadow-2xl hover:shadow-teal/10 ${className}`}
        >
            <div>
                {/* Top Badge & Year/Status */}
                {(showBadge || motorcycle.year) && (
                    <div className="flex items-center justify-between gap-2">
                        {showBadge && badgeText && (
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClasses(
                                    badgeVariant,
                                )}`}
                            >
                                {badgeText}
                            </span>
                        )}

                        {motorcycle.year && (
                            <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md ml-auto">
                                {motorcycle.year}
                            </span>
                        )}
                    </div>
                )}

                {/* Motorcycle Image Container with smooth hover zoom */}
                <div className="relative my-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-muted/40 p-3">
                    <img
                        src={motorcycle.image}
                        alt={motorcycle.title}
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
                        loading="lazy"
                    />
                </div>

                {/* Brand & Category */}
                {showCategory && (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {motorcycle.brand} • {categoryText}
                    </div>
                )}

                {/* Title */}
                <h3 className="mt-1 text-lg font-bold text-foreground line-clamp-1 group-hover:text-teal transition-colors">
                    {motorcycle.title}
                </h3>

                {/* Highlight line if provided */}
                {motorcycle.highlight ? (
                    <div className="mt-1 text-xs text-teal/90 font-medium line-clamp-1 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span>{motorcycle.highlight}</span>
                    </div>
                ) : (
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {motorcycle.engineCc
                            ? `${motorcycle.engineCc} cm³ hengerűrtartalom`
                            : 'Gondosan bevizsgált állapot'}
                    </div>
                )}

                {/* Specs Grid */}
                {showSpecs && (
                    <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-muted/50 p-2.5 text-center text-xs">
                        <div className="flex flex-col items-center">
                            <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-0.5">
                                <Gauge className="h-3 w-3" />
                                Erő
                            </div>
                            <div className="font-bold text-foreground mt-0.5">
                                {motorcycle.powerHp} LE
                            </div>
                            <div className="text-[9px] text-muted-foreground">
                                ({motorcycle.powerKw} kW)
                            </div>
                        </div>
                        <div className="flex flex-col items-center border-x border-border/60">
                            <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" />
                                Évjárat
                            </div>
                            <div className="font-bold text-foreground mt-0.5">
                                {motorcycle.year}
                            </div>
                            <div className="text-[9px] text-muted-foreground">
                                Modellév
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-muted-foreground text-[10px] uppercase font-medium flex items-center gap-0.5">
                                <Navigation className="h-3 w-3" />
                                Futás
                            </div>
                            <div className="font-bold text-foreground mt-0.5">
                                {motorcycle.mileageKm >= 1000
                                    ? `${(motorcycle.mileageKm / 1000).toFixed(1)}e km`
                                    : `${motorcycle.mileageKm} km`}
                            </div>
                            <div className="text-[9px] text-muted-foreground">
                                {formattedMileage}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer: Price and CTA */}
            {(showPrice || showCta) && (
                <div className="mt-5 pt-3 border-t border-border/60">
                    {showPrice && (
                        <div className="mb-3 flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground font-medium">
                                Ár (bruttó):
                            </span>
                            <span className="text-lg font-extrabold tracking-tight text-foreground">
                                {motorcycle.priceHuf}
                            </span>
                        </div>
                    )}

                    {showCta && (
                        <Button
                            asChild
                            className="w-full bg-foreground text-background hover:bg-foreground/90 cursor-pointer rounded-xl font-medium text-sm transition-all group/btn shadow-xs hover:shadow-md"
                        >
                            <a href={ctaHref}>
                                <span>{ctaText}</span>
                                <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </a>
                        </Button>
                    )}
                </div>
            )}
        </motion.div>
    );
}
