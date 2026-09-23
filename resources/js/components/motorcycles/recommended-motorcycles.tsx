'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotorcycleSliderCard } from './motorcycle-slider-card';
import type { Motorcycle } from './motorcycle-card';

export interface RecommendedMotorcycleData extends Motorcycle {
    images?: string[];
}

export const RECOMMENDED_MOTORCYCLES: RecommendedMotorcycleData[] = [
    {
        id: 'rec-1',
        title: 'Yamaha MT-09 SP ABS',
        brand: 'Yamaha',
        category: 'Naked / Street',
        powerHp: 119,
        powerKw: 87.5,
        engineCc: 890,
        year: 2023,
        mileageKm: 6400,
        priceHuf: '4 490 000 Ft',
        image: 'https://www.markamotor.hu/storage/motors/main_image_6a9fed312a2be.jpg',
        images: ['https://www.markamotor.hu/storage/motors/main_image_6a9fed312a2be.jpg', 'https://www.markamotor.hu/storage/motors/590/image_6a9fed312b7b8.jpg', '/img/moto-2.png'],
        badge: 'Kiemelt ajánlat',
        badgeColor: 'teal',
    },
    {
        id: 'rec-2',
        title: 'Ducati Panigale V4 S',
        brand: 'Ducati',
        category: 'Sport / Supersport',
        powerHp: 215,
        powerKw: 158,
        engineCc: 1103,
        year: 2023,
        mileageKm: 3200,
        priceHuf: '8 890 000 Ft',
        image: '/img/moto-4.png',
        images: ['/img/moto-4.png', '/img/moto-1.png', '/img/moto-3.png'],
        badge: 'Prémium állapot',
        badgeColor: 'coral',
    },
    {
        id: 'rec-3',
        title: 'BMW R 1250 GS Adventure',
        brand: 'BMW',
        category: 'Touring / Adventure',
        powerHp: 136,
        powerKw: 100,
        engineCc: 1254,
        year: 2022,
        mileageKm: 14800,
        priceHuf: '7 190 000 Ft',
        image: '/img/moto-3.png',
        images: ['/img/moto-3.png', '/img/moto-2.png', '/img/moto-1.png'],
        badge: 'Azonnal vihető',
        badgeColor: 'teal',
    },
    {
        id: 'rec-4',
        title: 'HONDA VT 750 SHADOW IGAZOLHATÓ FUTÁSTELJESÍTMÉNY!',
        brand: 'Honda',
        category: 'Sport / Supersport',
        powerHp: 95,
        powerKw: 70,
        engineCc: 649,
        year: 2023,
        mileageKm: 4100,
        priceHuf: '3 690 000 Ft',
        image: '/img/moto-2.png',
        images: ['/img/moto-2.png', '/img/moto-3.png', '/img/moto-4.png'],
        badge: 'Népszerű választás',
        badgeColor: 'gold',
    },
];

interface RecommendedMotorcyclesSectionProps {
    content?: Record<string, string>;
}

export function RecommendedMotorcyclesSection({ content }: RecommendedMotorcyclesSectionProps = {}) {
    const handleViewAll = () => {
        const filterSection = document.getElementById('filter-section');
        if (filterSection) {
            filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="recommended-section" className="relative z-20 pb-16 sm:pb-20 bg-background/50">
            {/* Ambient background glow accents */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-teal/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-coral/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-6 lg:px-12">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="bg-muted text-muted-foreground mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                        {content?.badge ?? 'Ajánlott motorok'}
                    </span>
                    <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                        {content?.title ?? 'Kiemelt ajánlataink és'}{' '}
                        <span className="text-teal">
                            {content?.title_highlight ?? 'motorkerékpárjaink'}
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {content?.subtitle ??
                            'Gondosan átvizsgált, prémium állapotú motorkerékpárok azonnal elvihető szaloni raktárkészletünkből, teljes körű garanciával.'}
                    </p>
                </motion.div>

                {/* 4 Clean Motorcycle Cards with Image Slider */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {RECOMMENDED_MOTORCYCLES.map((bike, index) => (
                        <MotorcycleSliderCard
                            key={bike.id}
                            motorcycle={bike}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                {/* Bottom Center Action: View all motorcycles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 flex flex-col items-center justify-center gap-3 text-center"
                >
                    <Button
                        type="button"
                        size="lg"
                        onClick={handleViewAll}
                        className="bg-foreground text-background hover:bg-foreground/90 group shadow-foreground/10 hover:shadow-foreground/15 cursor-pointer px-8 shadow-lg transition-all hover:shadow-xl"
                    >
                        <span>
                            {content?.button_view_all ?? 'Összes motorkerékpár megtekintése'}
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
