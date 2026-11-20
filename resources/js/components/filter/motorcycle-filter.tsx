'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Search,
    RotateCcw,
    Sparkles,
    ArrowRight,
    Tag,
    Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { MotorData } from '@/components/catalog/catalog-motor-card';

export interface DBBrand {
    id: number;
    name: string;
    motors_count?: number;
}

export interface DBCategory {
    id: number;
    name: string;
    motors_count?: number;
}

interface MotorcycleFilterSectionProps {
    content?: Record<string, string>;
    brands?: DBBrand[];
    categories?: DBCategory[];
    motors?: MotorData[];
}

export function MotorcycleFilterSection({
    content,
    brands = [],
    categories = [],
    motors = [],
}: MotorcycleFilterSectionProps = {}) {
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedPerformance, setSelectedPerformance] = useState<string>('all');

    // Helper to check if bike fits A2 license (<= 35 kW)
    const isA2Motor = (bike: MotorData) => {
        const kw = parseFloat(String(bike.performance || ''));
        return !isNaN(kw) && kw > 0 && kw <= 35;
    };

    // Total count of A2 bikes in database
    const a2Count = useMemo(() => {
        return motors.filter(isA2Motor).length;
    }, [motors]);

    // Real-time filtered count of matching motorcycles
    const filteredMotorcycles = useMemo(() => {
        return motors.filter((bike) => {
            if (selectedBrand !== 'all' && String(bike.brand_id) !== String(selectedBrand)) {
                return false;
            }
            if (selectedCategory !== 'all' && String(bike.category_id) !== String(selectedCategory)) {
                return false;
            }
            if (selectedPerformance === 'a2') {
                if (!isA2Motor(bike)) return false;
            }
            return true;
        });
    }, [motors, selectedBrand, selectedCategory, selectedPerformance]);

    const isFilterActive =
        selectedBrand !== 'all' ||
        selectedCategory !== 'all' ||
        selectedPerformance !== 'all';

    const handleReset = () => {
        setSelectedBrand('all');
        setSelectedCategory('all');
        setSelectedPerformance('all');
    };

    // Forward to /motorok catalog page with chosen filters
    const catalogUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (selectedBrand !== 'all') params.set('brand_id', selectedBrand);
        if (selectedCategory !== 'all') params.set('category_id', selectedCategory);
        if (selectedPerformance === 'a2') params.set('a2', '1');
        const qs = params.toString();
        return qs ? `/motorok?${qs}` : '/motorok';
    }, [selectedBrand, selectedCategory, selectedPerformance]);

    // Popular brands for quick-select pills
    const popularBrands = useMemo(() => {
        return [...brands]
            .sort((a, b) => (b.motors_count ?? 0) - (a.motors_count ?? 0))
            .slice(0, 5);
    }, [brands]);

    // Popular categories for quick-select pills
    const popularCategories = useMemo(() => {
        return [...categories]
            .sort((a, b) => (b.motors_count ?? 0) - (a.motors_count ?? 0))
            .slice(0, 5);
    }, [categories]);

    return (
        <section
            id="filter-section"
            className="relative z-30 -mt-12 sm:-mt-16 lg:-mt-20 pb-16 pt-22"
        >
            <div className="container mx-auto">
                {/* Main Filter Glassmorphism Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative p-6 sm:p-8 lg:p-10"
                >
                    {/* Section header */}
                    <div className="relative z-10 mx-auto mb-6 max-w-3xl text-center">
                        <span className="bg-muted text-muted-foreground mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                            {content?.badge ?? 'Járműkereső'}
                        </span>
                        {/* <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                            {content?.title ?? 'Találd meg a stílusodhoz'}{' '}
                            <span className="text-teal">
                                {content?.title_highlight ?? 'illő motort'}
                            </span>
                        </h2> */}
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {content?.subtitle ??
                                'Válassz márkát, kategóriát és teljesítményt az aktuális készletünkből'}
                        </p>
                    </div>

                    {/* Filter Selectors Grid: 3 columns (1. Márka, 2. Kategória, 3. Teljesítmény) */}
                    <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* 1. MÁRKA (BRAND) */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="brand-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                {/* <span className="flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5 text-teal" />
                                    1. Márka (Gyártó)
                                </span> */}
                                {/* {selectedBrand !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )} */}
                            </label>

                            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                                <SelectTrigger
                                    id="brand-select"
                                    className="w-full h-auto min-h-[50px] data-[size=default]:h-auto rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus-visible:border-teal focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-teal/20 focus-visible:ring-teal/20 cursor-pointer shadow-xs justify-between [&>svg]:text-muted-foreground [&>svg]:opacity-100"
                                >
                                    <SelectValue placeholder="Összes márka" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/80 bg-popover/95 backdrop-blur-md p-1.5 shadow-xl max-h-72">
                                    <SelectItem
                                        value="all"
                                        className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                    >
                                        Összes márka
                                    </SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={String(brand.id)}
                                            className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                        >
                                            {brand.name}
                                            {typeof brand.motors_count === 'number' && (
                                                <span className="text-muted-foreground text-xs ml-1.5 font-normal">
                                                    ({brand.motors_count} db)
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Popular brand quick pills */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {popularBrands.map((brand) => {
                                    const isSelected = selectedBrand === String(brand.id);
                                    return (
                                        <button
                                            key={brand.id}
                                            type="button"
                                            onClick={() => setSelectedBrand(isSelected ? 'all' : String(brand.id))}
                                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${isSelected
                                                ? 'bg-teal text-white shadow-xs'
                                                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                        >
                                            {brand.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. KATEGÓRIA (CATEGORY / VID) */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="category-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                {/* <span className="flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-teal" />
                                    2. Kategória (Kivitel / Stílus)
                                </span> */}
                                {/* {selectedCategory !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )} */}
                            </label>

                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger
                                    id="category-select"
                                    className="w-full h-auto min-h-[50px] data-[size=default]:h-auto rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus-visible:border-teal focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-teal/20 focus-visible:ring-teal/20 cursor-pointer shadow-xs justify-between [&>svg]:text-muted-foreground [&>svg]:opacity-100"
                                >
                                    <SelectValue placeholder="Összes kategória" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/80 bg-popover/95 backdrop-blur-md p-1.5 shadow-xl max-h-72">
                                    <SelectItem
                                        value="all"
                                        className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                    >
                                        Összes kategória
                                    </SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                            className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                        >
                                            {c.name}
                                            {typeof c.motors_count === 'number' && (
                                                <span className="text-muted-foreground text-xs ml-1.5 font-normal">
                                                    ({c.motors_count} db)
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Popular category quick pills */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {popularCategories.map((c) => {
                                    const isSelected = selectedCategory === String(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedCategory(isSelected ? 'all' : String(c.id))}
                                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${isSelected
                                                ? 'bg-teal text-white shadow-xs'
                                                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. TELJESÍTMÉNY (PERFORMANCE) - ONLY A2 OPTION */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="performance-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                {/* <span className="flex items-center gap-1.5">
                                    <Gauge className="h-3.5 w-3.5 text-teal" />
                                    3. Teljesítmény
                                </span> */}
                                {/* {selectedPerformance !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )} */}
                            </label>

                            <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
                                <SelectTrigger
                                    id="performance-select"
                                    className="w-full h-auto min-h-[50px] data-[size=default]:h-auto rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus-visible:border-teal focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-teal/20 focus-visible:ring-teal/20 cursor-pointer shadow-xs justify-between [&>svg]:text-muted-foreground [&>svg]:opacity-100"
                                >
                                    <SelectValue placeholder="Összes teljesítmény" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/80 bg-popover/95 backdrop-blur-md p-1.5 shadow-xl max-h-72">
                                    <SelectItem
                                        value="all"
                                        className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                    >
                                        Összes teljesítmény
                                    </SelectItem>
                                    <SelectItem
                                        value="a2"
                                        className="rounded-xl py-2.5 pl-3 pr-8 text-sm cursor-pointer focus:bg-teal/10 focus:text-teal font-medium"
                                    >
                                        A2-es kategória (35 kW-ig)
                                        {a2Count > 0 && (
                                            <span className="text-muted-foreground text-xs ml-1.5 font-normal">
                                                ({a2Count} db)
                                            </span>
                                        )}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* A2 quick pill */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPerformance(selectedPerformance === 'a2' ? 'all' : 'a2')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${selectedPerformance === 'a2'
                                        ? 'bg-teal text-white shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    A2-es kategória (35 kW-ig) {a2Count > 0 ? `(${a2Count})` : ''}
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Bottom Action Area: Only 1 black button with Search icon */}
                    <div className="relative z-10 mt-8 flex justify-center pt-3">
                        <Button
                            asChild
                            size="lg"
                            className="bg-foreground text-background hover:bg-foreground/90 group shadow-foreground/10 hover:shadow-foreground/15 w-full sm:w-auto min-w-auto cursor-pointer px-8 shadow-lg transition-all hover:shadow-xl"
                        >
                            <Link href={catalogUrl}>
                                <span className="relative z-10 flex items-center justify-center gap-2.5">
                                    {/* <Search className="h-4 w-4 transition-transform group-hover:scale-110" /> */}
                                    <span>Keresés</span>
                                    {/* <span className="ml-1 rounded-full bg-background/20 px-2 py-0.5 text-xs font-bold text-background">
                                        {filteredMotorcycles.length} db
                                    </span> */}
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
