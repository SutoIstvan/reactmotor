'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    RotateCcw,
    Gauge,
    Sparkles,
    ChevronDown,
    SlidersHorizontal,
    ArrowUpRight,
    Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotorcycleCard } from '@/components/motorcycles/motorcycle-card';

// Brands available for filtering
export const BRANDS = [
    { value: 'all', label: 'Összes márka (Mind)', origin: 'Bármely gyártó' },
    { value: 'Honda', label: 'Honda', origin: 'Japán' },
    { value: 'Yamaha', label: 'Yamaha', origin: 'Japán' },
    { value: 'Kawasaki', label: 'Kawasaki', origin: 'Japán' },
    { value: 'Suzuki', label: 'Suzuki', origin: 'Japán' },
    { value: 'BMW', label: 'BMW', origin: 'Németország' },
    { value: 'Ducati', label: 'Ducati', origin: 'Olaszország' },
    { value: 'KTM', label: 'KTM', origin: 'Ausztria' },
    { value: 'Harley-Davidson', label: 'Harley-Davidson', origin: 'USA' },
    { value: 'Aprilia', label: 'Aprilia', origin: 'Olaszország' },
    { value: 'Triumph', label: 'Triumph', origin: 'Egyesült Királyság' },
] as const;

// Design / Body style categories
export const DESIGNS = [
    {
        value: 'all',
        label: 'Összes dizájn (Mind)',
        description: 'Bármely felépítés és kategória',
    },
    {
        value: 'Sport',
        label: 'Sport / Supersport',
        description: 'Aerodinamikus idomok, versenypálya DNS',
    },
    {
        value: 'Naked',
        label: 'Naked / Street',
        description: 'Agresszív csupasz forma, dinamikus városi élmény',
    },
    {
        value: 'Touring',
        label: 'Touring / Adventure',
        description: 'Hosszútávú túrakomfort és terepállóság',
    },
    {
        value: 'Cruiser',
        label: 'Cruiser / Chopper',
        description: 'Klasszikus króm stílus, alacsony üléspozíció',
    },
    {
        value: 'Scooter',
        label: 'Robogó / Maxi Scooter',
        description: 'Automata kényelem a mindennapi mobilitáshoz',
    },
    {
        value: 'Cafe-Racer',
        label: 'Cafe Racer / Retro',
        description: 'Időtlen vintage elegancia modern technológiával',
    },
] as const;

// Performance / Power brackets
export const PERFORMANCES = [
    {
        value: 'all',
        label: 'Összes teljesítmény (Mind)',
        range: 'Bármely hengerűrtartalom és erő',
    },
    {
        value: 'entry',
        label: 'Belépő & A2 kategória',
        range: '≤ 35 kW (48 LE-ig) • 125–400 cm³',
        maxKw: 35,
    },
    {
        value: 'mid',
        label: 'Középkategória (Kiegyensúlyozott)',
        range: '35–70 kW (48–95 LE) • 500–750 cm³',
        minKw: 35,
        maxKw: 70,
    },
    {
        value: 'high',
        label: 'Nagy teljesítmény (Sport & Túra)',
        range: '70–100 kW (95–136 LE) • 750–1000 cm³',
        minKw: 70,
        maxKw: 100,
    },
    {
        value: 'extreme',
        label: 'Superbike & Extrém erő',
        range: '100+ kW (136+ LE felett) • 1000+ cm³',
        minKw: 100,
    },
] as const;

// Sample motorcycle inventory for interactive results preview
export interface MotorcycleItem {
    id: string;
    title: string;
    brand: string;
    design: string;
    designLabel: string;
    powerKw: number;
    powerHp: number;
    engineCc: number;
    year: number;
    mileageKm: number;
    priceHuf: string;
    image: string;
    status: 'Azonnal vihető' | 'Foglalható' | 'Újszerű állapot';
    badgeColor: 'teal' | 'coral' | 'gold';
}

const MOTORCYCLE_INVENTORY: MotorcycleItem[] = [
    {
        id: '1',
        title: 'Yamaha MT-09 SP ABS',
        brand: 'Yamaha',
        design: 'Naked',
        designLabel: 'Naked / Street',
        powerKw: 87.5,
        powerHp: 119,
        engineCc: 890,
        year: 2023,
        mileageKm: 6400,
        priceHuf: '4 490 000 Ft',
        image: '/img/moto-1.png',
        status: 'Újszerű állapot',
        badgeColor: 'teal',
    },
    {
        id: '2',
        title: 'Ducati Panigale V4 S',
        brand: 'Ducati',
        design: 'Sport',
        designLabel: 'Sport / Supersport',
        powerKw: 158,
        powerHp: 215,
        engineCc: 1103,
        year: 2023,
        mileageKm: 3200,
        priceHuf: '8 890 000 Ft',
        image: '/img/moto-4.png',
        status: 'Azonnal vihető',
        badgeColor: 'coral',
    },
    {
        id: '3',
        title: 'BMW R 1250 GS Adventure Triple Black',
        brand: 'BMW',
        design: 'Touring',
        designLabel: 'Touring / Adventure',
        powerKw: 100,
        powerHp: 136,
        engineCc: 1254,
        year: 2022,
        mileageKm: 14800,
        priceHuf: '7 190 000 Ft',
        image: '/img/moto-3.png',
        status: 'Azonnal vihető',
        badgeColor: 'teal',
    },
    {
        id: '4',
        title: 'Honda CBR 650R ABS E-Clutch',
        brand: 'Honda',
        design: 'Sport',
        designLabel: 'Sport / Supersport',
        powerKw: 70,
        powerHp: 95,
        engineCc: 649,
        year: 2023,
        mileageKm: 4100,
        priceHuf: '3 690 000 Ft',
        image: '/img/moto-2.png',
        status: 'Foglalható',
        badgeColor: 'gold',
    },
    {
        id: '5',
        title: 'Kawasaki Ninja 400 KRT Edition',
        brand: 'Kawasaki',
        design: 'Sport',
        designLabel: 'Sport / Supersport',
        powerKw: 33.4,
        powerHp: 45,
        engineCc: 399,
        year: 2022,
        mileageKm: 8900,
        priceHuf: '2 350 000 Ft',
        image: '/img/moto-1.png',
        status: 'Azonnal vihető',
        badgeColor: 'teal',
    },
    {
        id: '6',
        title: 'KTM 890 Duke R Super Scalpel',
        brand: 'KTM',
        design: 'Naked',
        designLabel: 'Naked / Street',
        powerKw: 89,
        powerHp: 121,
        engineCc: 889,
        year: 2023,
        mileageKm: 5200,
        priceHuf: '4 290 000 Ft',
        image: '/img/moto-4.png',
        status: 'Újszerű állapot',
        badgeColor: 'coral',
    },
];

export function MotorcycleFilterSection() {
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [selectedDesign, setSelectedDesign] = useState<string>('all');
    const [selectedPerformance, setSelectedPerformance] = useState<string>('all');
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Calculate matching count in real time
    const filteredMotorcycles = useMemo(() => {
        return MOTORCYCLE_INVENTORY.filter((bike) => {
            // Brand check
            if (selectedBrand !== 'all' && bike.brand !== selectedBrand) {
                return false;
            }
            // Design check
            if (selectedDesign !== 'all' && bike.design !== selectedDesign) {
                return false;
            }
            // Performance check
            if (selectedPerformance !== 'all') {
                if (selectedPerformance === 'entry' && bike.powerKw > 35) return false;
                if (
                    selectedPerformance === 'mid' &&
                    (bike.powerKw <= 35 || bike.powerKw > 70)
                )
                    return false;
                if (
                    selectedPerformance === 'high' &&
                    (bike.powerKw <= 70 || bike.powerKw > 100)
                )
                    return false;
                if (selectedPerformance === 'extreme' && bike.powerKw < 100) return false;
            }
            return true;
        });
    }, [selectedBrand, selectedDesign, selectedPerformance]);

    const isFilterActive =
        selectedBrand !== 'all' ||
        selectedDesign !== 'all' ||
        selectedPerformance !== 'all';

    const handleReset = () => {
        setSelectedBrand('all');
        setSelectedDesign('all');
        setSelectedPerformance('all');
        setHasSearched(false);
    };

    const handleSearch = () => {
        setHasSearched(true);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

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

                    {/* Header Row */}
                    <div className="relative z-10 mb-8 flex flex-col items-center text-center pb-3">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Járműkereső & Szűrő
                            </span>

                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Találd meg a stílusodhoz illő motort
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                            Válassz márkát, karosszéria dizájnt és motorteljesítményt az aktuális készletünkből
                        </p>
                    </div>

                    {/* Filter Selectors Grid: 3 columns (Márka, Dizájn, Teljesítmény) */}
                    <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* 1. MÁRKA (BRAND) */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="brand-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Tag className="h-4 w-4 text-teal" />
                                    1. Márka (Gyártó)
                                </span>
                                {selectedBrand !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )}
                            </label>

                            <div className="relative">
                                <select
                                    id="brand-select"
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 pr-10 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 cursor-pointer shadow-xs"
                                >
                                    {BRANDS.map((brand) => (
                                        <option key={brand.value} value={brand.value} className="bg-card text-foreground py-1">
                                            {brand.label} {brand.value !== 'all' ? `• ${brand.origin}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>

                            {/* Popular brand quick pills */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {['Honda', 'Yamaha', 'BMW', 'Ducati', 'KTM'].map((brand) => (
                                    <button
                                        key={brand}
                                        type="button"
                                        onClick={() => setSelectedBrand(selectedBrand === brand ? 'all' : brand)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${selectedBrand === brand
                                            ? 'bg-teal text-white shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. DIZÁJN & STÍLUS (DESIGN / STYLE) */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="design-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-teal" />
                                    2. Dizájn & Karosszéria
                                </span>
                                {selectedDesign !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )}
                            </label>

                            <div className="relative">
                                <select
                                    id="design-select"
                                    value={selectedDesign}
                                    onChange={(e) => setSelectedDesign(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 pr-10 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 cursor-pointer shadow-xs"
                                >
                                    {DESIGNS.map((d) => (
                                        <option key={d.value} value={d.value} className="bg-card text-foreground py-1">
                                            {d.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>

                            {/* Popular styles quick pills */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {[
                                    { id: 'Sport', short: 'Sport' },
                                    { id: 'Naked', short: 'Naked' },
                                    { id: 'Touring', short: 'Túra / Adventure' },
                                    { id: 'Cruiser', short: 'Cruiser' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedDesign(selectedDesign === item.id ? 'all' : item.id)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${selectedDesign === item.id
                                            ? 'bg-teal text-white shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {item.short}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. TELJESÍTMÉNY (PERFORMANCE / POWER) */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="performance-select"
                                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Gauge className="h-4 w-4 text-teal" />
                                    3. Teljesítmény & Erő
                                </span>
                                {selectedPerformance !== 'all' && (
                                    <span className="text-teal font-bold text-[11px]">Kiválasztva</span>
                                )}
                            </label>

                            <div className="relative">
                                <select
                                    id="performance-select"
                                    value={selectedPerformance}
                                    onChange={(e) => setSelectedPerformance(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-border/80 bg-background/80 px-4 py-3.5 pr-10 text-sm font-medium text-foreground transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 cursor-pointer shadow-xs"
                                >
                                    {PERFORMANCES.map((p) => (
                                        <option key={p.value} value={p.value} className="bg-card text-foreground py-1">
                                            {p.label} {p.value !== 'all' ? `(${p.range})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>

                            {/* Performance quick brackets */}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {[
                                    { id: 'entry', short: 'A2 (≤ 35 kW)' },
                                    { id: 'mid', short: '35–70 kW' },
                                    { id: 'high', short: '70–100 kW' },
                                    { id: 'extreme', short: '100+ kW' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedPerformance(selectedPerformance === item.id ? 'all' : item.id)
                                        }
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${selectedPerformance === item.id
                                            ? 'bg-teal text-white shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {item.short}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Selected Tags Summary */}
                    {isFilterActive && (
                        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
                            <span className="text-xs font-medium text-muted-foreground">Kiválasztott feltételek:</span>
                            {selectedBrand !== 'all' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 text-teal border border-teal/30 px-3 py-1 text-xs font-medium">
                                    Márka: {selectedBrand}
                                    <button
                                        onClick={() => setSelectedBrand('all')}
                                        className="ml-1 hover:text-foreground cursor-pointer"
                                        aria-label="Remove brand filter"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedDesign !== 'all' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 text-teal border border-teal/30 px-3 py-1 text-xs font-medium">
                                    Dizájn: {DESIGNS.find((d) => d.value === selectedDesign)?.label}
                                    <button
                                        onClick={() => setSelectedDesign('all')}
                                        className="ml-1 hover:text-foreground cursor-pointer"
                                        aria-label="Remove design filter"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedPerformance !== 'all' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 text-teal border border-teal/30 px-3 py-1 text-xs font-medium">
                                    Erő: {PERFORMANCES.find((p) => p.value === selectedPerformance)?.label}
                                    <button
                                        onClick={() => setSelectedPerformance('all')}
                                        className="ml-1 hover:text-foreground cursor-pointer"
                                        aria-label="Remove performance filter"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {/* Reset action button */}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1 text-xs font-medium border border-border/50"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Szűrők törlése
                            </button>
                        </div>
                    )}

                    {/* Bottom Action Area: Centered Search Button */}
                    <div className="relative z-10 mt-8 flex justify-center pt-3">
                        <Button
                            type="button"
                            size="lg"
                            onClick={handleSearch}
                            className="group relative w-full sm:w-auto min-w-[260px] cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-teal to-teal/90 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-teal/25 transition-all hover:shadow-2xl hover:shadow-teal/35 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2.5">
                                <Search className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                                <span>Keresés indítása</span>
                                <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                                    {filteredMotorcycles.length} db
                                </span>
                            </span>
                        </Button>
                    </div>
                </motion.div>

                {/* Interactive Results Section Displayed on Search or Filter Selection */}
                <div ref={resultsRef} className="mt-10">
                    <AnimatePresence>
                        {hasSearched && (
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 25 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">
                                            Találatok a keresésed alapján
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {filteredMotorcycles.length > 0
                                                ? `${filteredMotorcycles.length} ellenőrzött jármű található azonnali készletünkön`
                                                : 'Sajnos a megadott feltételekkel nem találtunk járművet, próbálj tágabb szűrést!'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReset}
                                            className="text-xs cursor-pointer"
                                        >
                                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                            Összes mutatása
                                        </Button>
                                    </div>
                                </div>

                                {filteredMotorcycles.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                            <Search className="h-7 w-7" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-foreground">Nincs pontos egyezés</h4>
                                        <p className="mt-1 max-w-md mx-auto text-sm text-muted-foreground">
                                            Próbálj más márkát vagy teljesítménykategóriát választani, vagy érdeklődj
                                            személyesen hamarosan érkező készletünkről!
                                        </p>
                                        <Button
                                            onClick={handleReset}
                                            variant="outline"
                                            className="mt-5 cursor-pointer"
                                        >
                                            Szűrők alaphelyzetbe állítása
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredMotorcycles.map((bike, index) => (
                                            <MotorcycleCard
                                                key={bike.id}
                                                motorcycle={bike}
                                                layout
                                                delay={index * 0.05}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
