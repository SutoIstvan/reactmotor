'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    Bike,
    Search,
    SlidersHorizontal,
    X,
    RotateCcw,
    ChevronDown,
    Phone,
    Mail,
    Check,
    Gauge,
    Calendar,
    Navigation,
    ShieldCheck,
    ArrowUpDown,
    Tag,
    LayoutGrid,
    List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
    CatalogMotorCard,
    CatalogMotorCardSkeleton,
    MotorData,
    formatHuf,
    formatImageUrl,
} from '@/components/catalog/catalog-motor-card';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMotors {
    data: MotorData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface BrandItem {
    id: number;
    name: string;
    motors_count?: number;
}

interface CategoryItem {
    id: number;
    name: string;
    motors_count?: number;
}

interface MotorokProps {
    motors: PaginatedMotors;
    brands: BrandItem[];
    categories: CategoryItem[];
    priceRange: {
        min: number;
        max: number;
    };
    yearRange?: {
        min: number;
        max: number;
    };
    ccRange?: {
        min: number;
        max: number;
    };
    filters: {
        search?: string;
        brand_id?: string;
        category_id?: string;
        min_price?: string;
        max_price?: string;
        min_year?: string;
        max_year?: string;
        min_cc?: string;
        max_cc?: string;
        sort?: string;
        per_page?: string;
        view?: string;
    };
}

export default function Motorok({
    motors,
    brands = [],
    categories = [],
    priceRange = { min: 500000, max: 6000000 },
    yearRange = { min: 2000, max: 2025 },
    ccRange = { min: 50, max: 1300 },
    filters = {},
}: MotorokProps) {
    // Round bounds for price slider
    const sliderMin = useMemo(() => {
        const m = priceRange.min || 500000;
        return Math.floor(m / 100000) * 100000;
    }, [priceRange.min]);

    const sliderMax = useMemo(() => {
        const m = priceRange.max || 6000000;
        return Math.ceil(m / 100000) * 100000;
    }, [priceRange.max]);

    const sliderStep = 50000; // 50 000 Ft per step

    // Year bounds
    const sliderYearMin = useMemo(() => yearRange.min || 2000, [yearRange.min]);
    const sliderYearMax = useMemo(() => yearRange.max || new Date().getFullYear(), [yearRange.max]);

    // CC bounds
    const sliderCcMin = useMemo(() => {
        const m = ccRange.min || 50;
        return Math.floor(m / 50) * 50;
    }, [ccRange.min]);

    const sliderCcMax = useMemo(() => {
        const m = ccRange.max || 1300;
        return Math.ceil(m / 50) * 50;
    }, [ccRange.max]);

    const sliderCcStep = 25;

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [brandId, setBrandId] = useState(filters.brand_id || 'all');
    const [categoryId, setCategoryId] = useState(filters.category_id || 'all');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [minYear, setMinYear] = useState(filters.min_year || '');
    const [maxYear, setMaxYear] = useState(filters.max_year || '');
    const [minCc, setMinCc] = useState(filters.min_cc || '');
    const [maxCc, setMaxCc] = useState(filters.max_cc || '');

    // Sort order: synced with URL filters
    const [sort, setSort] = useState(filters.sort || 'featured');

    // Per page: 24, 48, or 'all', synced with URL filters
    const [perPage, setPerPage] = useState(filters.per_page || '24');

    // View mode: 'grid' or 'list' (instant UI toggle stored in localStorage)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Restore viewMode from localStorage on mount (0ms, no network request)
    useEffect(() => {
        const savedView = localStorage.getItem('motorok_view_mode');
        if (savedView === 'grid' || savedView === 'list') {
            setViewMode(savedView);
        }
    }, []);

    // Slider range states [from, to]
    const [sliderValues, setSliderValues] = useState<[number, number]>([
        filters.min_price ? parseInt(filters.min_price, 10) : sliderMin,
        filters.max_price ? parseInt(filters.max_price, 10) : sliderMax,
    ]);

    const [yearSliderValues, setYearSliderValues] = useState<[number, number]>([
        filters.min_year ? parseInt(filters.min_year, 10) : sliderYearMin,
        filters.max_year ? parseInt(filters.max_year, 10) : sliderYearMax,
    ]);

    const [ccSliderValues, setCcSliderValues] = useState<[number, number]>([
        filters.min_cc ? parseInt(filters.min_cc, 10) : sliderCcMin,
        filters.max_cc ? parseInt(filters.max_cc, 10) : sliderCcMax,
    ]);

    // Keep sliders & controls in sync with filters prop
    useEffect(() => {
        const nextMin = filters.min_price ? parseInt(filters.min_price, 10) : sliderMin;
        const nextMax = filters.max_price ? parseInt(filters.max_price, 10) : sliderMax;
        setSliderValues([nextMin, nextMax]);
        setMinPrice(filters.min_price || '');
        setMaxPrice(filters.max_price || '');

        const nextYearMin = filters.min_year ? parseInt(filters.min_year, 10) : sliderYearMin;
        const nextYearMax = filters.max_year ? parseInt(filters.max_year, 10) : sliderYearMax;
        setYearSliderValues([nextYearMin, nextYearMax]);
        setMinYear(filters.min_year || '');
        setMaxYear(filters.max_year || '');

        const nextCcMin = filters.min_cc ? parseInt(filters.min_cc, 10) : sliderCcMin;
        const nextCcMax = filters.max_cc ? parseInt(filters.max_cc, 10) : sliderCcMax;
        setCcSliderValues([nextCcMin, nextCcMax]);
        setMinCc(filters.min_cc || '');
        setMaxCc(filters.max_cc || '');

        setSearch(filters.search || '');
        setBrandId(filters.brand_id || 'all');
        setCategoryId(filters.category_id || 'all');
        setPerPage(filters.per_page || '24');
        setSort(filters.sort || 'featured');
    }, [
        filters.search,
        filters.brand_id,
        filters.category_id,
        filters.min_price,
        filters.max_price,
        filters.min_year,
        filters.max_year,
        filters.min_cc,
        filters.max_cc,
        filters.sort,
        filters.per_page,
        sliderMin,
        sliderMax,
        sliderYearMin,
        sliderYearMax,
        sliderCcMin,
        sliderCcMax,
    ]);

    // Brand search filter in sidebar
    const [brandSearch, setBrandSearch] = useState('');

    // Mobile filter drawer state
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Quick View Dialog
    const [selectedMotor, setSelectedMotor] = useState<MotorData | null>(null);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    // Track page transitions for skeleton display
    const [isPageLoading, setIsPageLoading] = useState(false);

    useEffect(() => {
        const unbindStart = router.on('start', () => setIsPageLoading(true));
        const unbindFinish = router.on('finish', () => setIsPageLoading(false));
        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Apply filters to backend
    const applyFilters = (overrides: Record<string, string> = {}) => {
        const queryParams: Record<string, string> = {
            search,
            brand_id: brandId,
            category_id: categoryId,
            min_price: minPrice,
            max_price: maxPrice,
            min_year: minYear,
            max_year: maxYear,
            min_cc: minCc,
            max_cc: maxCc,
            sort,
            per_page: perPage,
            ...overrides,
        };

        // Remove empty keys, and only omit 'all' for brand_id and category_id
        const cleaned: Record<string, string> = {};
        Object.entries(queryParams).forEach(([k, v]) => {
            if (v && v.trim() !== '') {
                if (v === 'all' && (k === 'brand_id' || k === 'category_id')) {
                    return;
                }
                cleaned[k] = v;
            }
        });

        router.get('/motorok', cleaned, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });

        setIsMobileFilterOpen(false);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearch('');
        setBrandId('all');
        setCategoryId('all');
        setMinPrice('');
        setMaxPrice('');
        setMinYear('');
        setMaxYear('');
        setMinCc('');
        setMaxCc('');
        setSliderValues([sliderMin, sliderMax]);
        setYearSliderValues([sliderYearMin, sliderYearMax]);
        setCcSliderValues([sliderCcMin, sliderCcMax]);
        setSort('featured');
        setPerPage('24');

        router.get('/motorok', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });

        setIsMobileFilterOpen(false);
    };

    // Filter brands by search in sidebar
    const filteredBrands = useMemo(() => {
        if (!brandSearch.trim()) return brands;
        return brands.filter((b) =>
            b.name.toLowerCase().includes(brandSearch.toLowerCase()),
        );
    }, [brands, brandSearch]);

    // Active filter count (excluding sort)
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.brand_id && filters.brand_id !== 'all') count++;
        if (filters.category_id && filters.category_id !== 'all') count++;
        if (filters.min_price || filters.max_price) count++;
        if (filters.min_year || filters.max_year) count++;
        if (filters.min_cc || filters.max_cc) count++;
        return count;
    }, [filters]);

    // Handle Quick View Modal images
    const modalImages = useMemo(() => {
        if (!selectedMotor) return [];
        const list: string[] = [];
        if (selectedMotor.main_image) {
            list.push(formatImageUrl(selectedMotor.main_image));
        }
        if (selectedMotor.images && selectedMotor.images.length > 0) {
            selectedMotor.images.forEach((img) => {
                const url = typeof img === 'string' ? img : img.url;
                const formatted = formatImageUrl(url);
                if (formatted && !list.includes(formatted)) {
                    list.push(formatted);
                }
            });
        }
        if (list.length === 0) list.push('/img/moto-1.png');
        return list;
    }, [selectedMotor]);

    const activeBrandName = useMemo(() => {
        if (!filters.brand_id || filters.brand_id === 'all') return null;
        return brands.find((b) => String(b.id) === String(filters.brand_id))?.name;
    }, [filters.brand_id, brands]);

    const activeCategoryName = useMemo(() => {
        if (!filters.category_id || filters.category_id === 'all') return null;
        return categories.find((c) => String(c.id) === String(filters.category_id))?.name;
    }, [filters.category_id, categories]);

    return (
        <>
            <Head title="Motorok | Márka Motor - Eladó motorkerékpárok">
                <meta
                    name="description"
                    content="Keresse meg álmai motorkerékpárját! Minőségi átvizsgált használt és új motorok nagy választékban, szakszerű kiszolgálással."
                />
            </Head>

            <main className="bg-background text-foreground relative flex min-h-screen flex-col justify-between overflow-x-hidden">
                <Navbar />

                {/* Ambient glow backgrounds */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="bg-teal/5 absolute top-20 left-1/4 h-96 w-96 rounded-full blur-3xl" />
                    <div className="bg-teal/5 absolute top-1/2 right-1/4 h-96 w-96 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto flex-1 px-4 pt-24 pb-16 sm:px-6 lg:px-12 lg:pt-32 lg:pb-24">
                    {/* Header Banner */}
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            {/* <div>
                                <span className="bg-muted text-muted-foreground mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                                    Motorkerékpár Kínálat
                                </span>
                                <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                    Motorkerékpárok
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
                                    Minőségi, átvizsgált motorkerékpárok azonnal elvihető szalon készletünkből, teljes körű ügyintézéssel és garanciával.
                                </p>
                            </div> */}

                            {/* Mobile Filter Toggle Button */}
                            <div className="flex items-center gap-3 lg:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="flex w-full items-center justify-center gap-2 border-border/80 bg-card py-2.5 font-medium shadow-sm"
                                >
                                    <SlidersHorizontal className="h-4 w-4 text-teal" />
                                    <span>Szűrők</span>
                                    {activeFilterCount > 0 && (
                                        <Badge variant="default" className="bg-teal text-white ml-1 px-1.5 py-0.2 text-xs">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Catalog Content Layout: Left Sidebar + Right Grid */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
                        {/* ────────────────────────────────────────────────────────
                            LEFT SIDEBAR: Filters (Desktop)
                        ──────────────────────────────────────────────────────── */}
                        <aside className="hidden lg:block lg:col-span-1 sticky top-28 space-y-6 rounded-2xl backdrop-blur-md p-2">
                            <div className="flex items-center justify-between mt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-teal" />
                                    <h2 className="text-base font-bold text-foreground">Szűrők</h2>
                                </div>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        Alaphelyzet
                                    </button>
                                )}
                            </div>

                            {/* Search Filter */}
                            {/* <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Keresés modellre
                                </Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Pl. CBR, MT-09, GS..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="pl-9 pr-8 text-sm bg-background/60"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters({ search: '' });
                                            }}
                                            className="text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div> */}

                            {/* Brand Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Márka
                                    </Label>
                                    {brandId !== 'all' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBrandId('all');
                                                applyFilters({ brand_id: 'all' });
                                            }}
                                            className="text-teal hover:underline text-[11px]"
                                        >
                                            Mind
                                        </button>
                                    )}
                                </div>

                                {/* {brands.length > 7 && (
                                    <Input
                                        type="text"
                                        placeholder="Márka keresése..."
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        className="h-8 text-xs bg-background/50"
                                    />
                                )} */}

                                <div className="overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBrandId('all');
                                            applyFilters({ brand_id: 'all' });
                                        }}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${brandId === 'all'
                                            ? 'bg-teal/15 text-teal font-semibold'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                            }`}
                                    >
                                        <span>Összes márka</span>
                                    </button>

                                    {filteredBrands.map((b) => {
                                        const isSelected = String(brandId) === String(b.id);
                                        return (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => {
                                                    const next = isSelected ? 'all' : String(b.id);
                                                    setBrandId(next);
                                                    applyFilters({ brand_id: next });
                                                }}
                                                className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${isSelected
                                                    ? 'bg-teal/15 text-teal font-semibold'
                                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                    }`}
                                            >
                                                <span>{b.name}</span>
                                                {typeof b.motors_count === 'number' && (
                                                    <span className="text-[11px] opacity-75 font-normal">
                                                        ({b.motors_count})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-3 border-t border-border/60 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Kategória
                                    </Label>
                                    {categoryId !== 'all' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoryId('all');
                                                applyFilters({ category_id: 'all' });
                                            }}
                                            className="text-teal hover:underline text-[11px]"
                                        >
                                            Mind
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCategoryId('all');
                                            applyFilters({ category_id: 'all' });
                                        }}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${categoryId === 'all'
                                            ? 'bg-teal/15 text-teal font-semibold'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                            }`}
                                    >
                                        <span>Összes kategória</span>
                                    </button>

                                    {categories.map((c) => {
                                        const isSelected = String(categoryId) === String(c.id);
                                        return (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    const next = isSelected ? 'all' : String(c.id);
                                                    setCategoryId(next);
                                                    applyFilters({ category_id: next });
                                                }}
                                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${isSelected
                                                    ? 'bg-teal/15 text-teal font-semibold'
                                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                    }`}
                                            >
                                                <span>{c.name}</span>
                                                {typeof c.motors_count === 'number' && (
                                                    <span className="text-[11px] opacity-75 font-normal">
                                                        ({c.motors_count})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Slider Filter */}
                            <div className="space-y-4 border-t border-border/60 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Ár (HUF)
                                    </Label>
                                    {(minPrice || maxPrice) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSliderValues([sliderMin, sliderMax]);
                                                setMinPrice('');
                                                setMaxPrice('');
                                                applyFilters({ min_price: '', max_price: '' });
                                            }}
                                            className="text-teal hover:underline text-[11px]"
                                        >
                                            Alaphelyzet
                                        </button>
                                    )}
                                </div>

                                {/* From / To Badges */}
                                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                        {formatHuf(sliderValues[0])}
                                    </div>
                                    <span className="text-muted-foreground font-normal">—</span>
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                        {formatHuf(sliderValues[1])}
                                    </div>
                                </div>

                                {/* Dual Slider */}
                                <div className="px-1 pt-1.5 pb-1">
                                    <Slider
                                        min={sliderMin}
                                        max={sliderMax}
                                        step={sliderStep}
                                        value={[sliderValues[0], sliderValues[1]]}
                                        onValueChange={(val: number[]) => {
                                            const newMin = val[0];
                                            const newMax = val[1];
                                            setSliderValues([newMin, newMax]);
                                            setMinPrice(newMin <= sliderMin ? '' : String(newMin));
                                            setMaxPrice(newMax >= sliderMax ? '' : String(newMax));
                                        }}
                                        onValueCommit={(val: number[]) => {
                                            const newMin = val[0] <= sliderMin ? '' : String(val[0]);
                                            const newMax = val[1] >= sliderMax ? '' : String(val[1]);
                                            applyFilters({ min_price: newMin, max_price: newMax });
                                        }}
                                    />
                                </div>

                                {/* Quick Price Presets */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSliderValues([sliderMin, 1500000]);
                                            setMinPrice('');
                                            setMaxPrice('1500000');
                                            applyFilters({ min_price: '', max_price: '1500000' });
                                        }}
                                        className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${maxPrice === '1500000' && !minPrice
                                            ? 'bg-teal text-white font-semibold'
                                            : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        &lt; 1.5M Ft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSliderValues([1500000, 3000000]);
                                            setMinPrice('1500000');
                                            setMaxPrice('3000000');
                                            applyFilters({ min_price: '1500000', max_price: '3000000' });
                                        }}
                                        className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${minPrice === '1500000' && maxPrice === '3000000'
                                            ? 'bg-teal text-white font-semibold'
                                            : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        1.5M - 3M Ft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSliderValues([3000000, sliderMax]);
                                            setMinPrice('3000000');
                                            setMaxPrice('');
                                            applyFilters({ min_price: '3000000', max_price: '' });
                                        }}
                                        className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${minPrice === '3000000' && !maxPrice
                                            ? 'bg-teal text-white font-semibold'
                                            : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        &gt; 3M Ft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSliderValues([sliderMin, sliderMax]);
                                            setMinPrice('');
                                            setMaxPrice('');
                                            applyFilters({ min_price: '', max_price: '' });
                                        }}
                                        className="px-2 py-1 rounded bg-muted/60 hover:bg-muted text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        Összes
                                    </button>
                                </div>
                            </div>

                            {/* Year Slider Filter */}
                            <div className="space-y-4 border-t border-border/60 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Évjárat
                                    </Label>
                                    {(minYear || maxYear) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setYearSliderValues([sliderYearMin, sliderYearMax]);
                                                setMinYear('');
                                                setMaxYear('');
                                                applyFilters({ min_year: '', max_year: '' });
                                            }}
                                            className="text-teal hover:underline text-[11px]"
                                        >
                                            Alaphelyzet
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                        {yearSliderValues[0]}
                                    </div>
                                    <span className="text-muted-foreground font-normal">—</span>
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                        {yearSliderValues[1]}
                                    </div>
                                </div>

                                <div className="px-1 pt-1.5 pb-1">
                                    <Slider
                                        min={sliderYearMin}
                                        max={sliderYearMax}
                                        step={1}
                                        value={[yearSliderValues[0], yearSliderValues[1]]}
                                        onValueChange={(val: number[]) => {
                                            const newMin = val[0];
                                            const newMax = val[1];
                                            setYearSliderValues([newMin, newMax]);
                                            setMinYear(newMin <= sliderYearMin ? '' : String(newMin));
                                            setMaxYear(newMax >= sliderYearMax ? '' : String(newMax));
                                        }}
                                        onValueCommit={(val: number[]) => {
                                            const newMin = val[0] <= sliderYearMin ? '' : String(val[0]);
                                            const newMax = val[1] >= sliderYearMax ? '' : String(val[1]);
                                            applyFilters({ min_year: newMin, max_year: newMax });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Displacement / CC Slider Filter */}
                            <div className="space-y-4 border-t border-border/60 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Hengerűrtartalom (cm³)
                                    </Label>
                                    {(minCc || maxCc) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCcSliderValues([sliderCcMin, sliderCcMax]);
                                                setMinCc('');
                                                setMaxCc('');
                                                applyFilters({ min_cc: '', max_cc: '' });
                                            }}
                                            className="text-teal hover:underline text-[11px]"
                                        >
                                            Alaphelyzet
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                        {ccSliderValues[0]} cm³
                                    </div>
                                    <span className="text-muted-foreground font-normal">—</span>
                                    <div className="flex-1 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                        <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                        {ccSliderValues[1]} cm³
                                    </div>
                                </div>

                                <div className="px-1 pt-1.5 pb-1">
                                    <Slider
                                        min={sliderCcMin}
                                        max={sliderCcMax}
                                        step={sliderCcStep}
                                        value={[ccSliderValues[0], ccSliderValues[1]]}
                                        onValueChange={(val: number[]) => {
                                            const newMin = val[0];
                                            const newMax = val[1];
                                            setCcSliderValues([newMin, newMax]);
                                            setMinCc(newMin <= sliderCcMin ? '' : String(newMin));
                                            setMaxCc(newMax >= sliderCcMax ? '' : String(newMax));
                                        }}
                                        onValueCommit={(val: number[]) => {
                                            const newMin = val[0] <= sliderCcMin ? '' : String(val[0]);
                                            const newMax = val[1] >= sliderCcMax ? '' : String(val[1]);
                                            applyFilters({ min_cc: newMin, max_cc: newMax });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Apply Button */}
                            <Button
                                onClick={() => applyFilters()}
                                className="w-full bg-teal text-white hover:bg-teal/90 rounded-xl font-medium text-xs py-2.5 transition-all shadow-md shadow-teal/20"
                            >
                                Szűrés alkalmazása
                            </Button>
                        </aside>

                        {/* ────────────────────────────────────────────────────────
                            RIGHT CONTENT: Results & Grid
                        ──────────────────────────────────────────────────────── */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Top Controls Bar: Count, Active Filter Pills, Sort */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs p-4 shadow-xs">
                                <div>
                                    <span className="text-sm font-medium text-foreground">
                                        Összesen <span className="font-bold text-teal">{motors.total}</span> motorkerékpár
                                    </span>
                                </div>

                                {/* Controls: Sort + Per Page */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">Rendezés:</span>
                                        <Select
                                            value={sort}
                                            onValueChange={(val) => {
                                                setSort(val);
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('motorok_sort', val);
                                                }
                                                applyFilters({ sort: val });
                                            }}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-44 sm:w-48 bg-background">
                                                <SelectValue placeholder="Rendezés..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="featured">Kiemelt ajánlatok</SelectItem>
                                                <SelectItem value="latest">Legújabbak</SelectItem>
                                                <SelectItem value="price_asc">Ár: növekvő</SelectItem>
                                                <SelectItem value="price_desc">Ár: csökkenő</SelectItem>
                                                <SelectItem value="year_desc">Évjárat: újabbak</SelectItem>
                                                <SelectItem value="km_asc">Futásteljesítmény: kevesebb</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Per Page Dropdown */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">Megjelenítés:</span>
                                        <Select
                                            value={perPage}
                                            onValueChange={(val) => {
                                                setPerPage(val);
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('motorok_per_page', val);
                                                }
                                                applyFilters({ per_page: val });
                                            }}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-28 bg-background">
                                                <SelectValue placeholder="24 / oldal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="24">24 / oldal</SelectItem>
                                                <SelectItem value="48">48 / oldal</SelectItem>
                                                <SelectItem value="all">Mind (Összes)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* View Mode Toggle: Grid or List */}
                                    <div className="flex items-center rounded-lg border border-border/70 bg-background/80 p-0.5 shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setViewMode('grid');
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('motorok_view_mode', 'grid');
                                                }
                                            }}
                                            aria-label="Rács nézet"
                                            title="Rács nézet"
                                            className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer',
                                                viewMode === 'grid'
                                                    ? 'bg-teal text-white shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            <LayoutGrid className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setViewMode('list');
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('motorok_view_mode', 'list');
                                                }
                                            }}
                                            aria-label="Lista nézet"
                                            title="Lista nézet"
                                            className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer',
                                                viewMode === 'list'
                                                    ? 'bg-teal text-white shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            <List className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Pill Bar */}
                            {activeFilterCount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-xs text-muted-foreground">Aktív szűrők:</span>

                                    {filters.search && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Keresés: &quot;{filters.search}&quot;
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setSearch('');
                                                    applyFilters({ search: '' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    {activeBrandName && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Márka: {activeBrandName}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setBrandId('all');
                                                    applyFilters({ brand_id: 'all' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    {activeCategoryName && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Kategória: {activeCategoryName}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setCategoryId('all');
                                                    applyFilters({ category_id: 'all' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    {(filters.min_price || filters.max_price) && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Ár: {filters.min_price ? formatHuf(filters.min_price) : '0 Ft'} -{' '}
                                            {filters.max_price ? formatHuf(filters.max_price) : 'bármennyi'}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setMinPrice('');
                                                    setMaxPrice('');
                                                    applyFilters({ min_price: '', max_price: '' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    {(filters.min_year || filters.max_year) && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Évjárat: {filters.min_year || sliderYearMin} - {filters.max_year || sliderYearMax}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setMinYear('');
                                                    setMaxYear('');
                                                    setYearSliderValues([sliderYearMin, sliderYearMax]);
                                                    applyFilters({ min_year: '', max_year: '' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    {(filters.min_cc || filters.max_cc) && (
                                        <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5">
                                            Hengerűrtartalom: {filters.min_cc || sliderCcMin} cm³ - {filters.max_cc || sliderCcMax} cm³
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-foreground"
                                                onClick={() => {
                                                    setMinCc('');
                                                    setMaxCc('');
                                                    setCcSliderValues([sliderCcMin, sliderCcMax]);
                                                    applyFilters({ min_cc: '', max_cc: '' });
                                                }}
                                            />
                                        </Badge>
                                    )}

                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-teal hover:underline text-xs ml-1 cursor-pointer font-medium"
                                    >
                                        Összes törlése
                                    </button>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────
                                MOTORS GRID: Styled as Ajánlott motorok Cards
                            ──────────────────────────────────────────────────────── */}
                            {motors.data.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                                        <Bike className="h-7 w-7 text-teal" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Nincs találat a megadott szűrési feltételekkel
                                    </h3>
                                    <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                                        Próbálja meg tágítani a szűrési feltételeket, törölni a keresőszót vagy megtekinteni a teljes kínálatot.
                                    </p>
                                    <Button
                                        onClick={resetFilters}
                                        className="bg-foreground text-background hover:bg-foreground/90 font-medium"
                                    >
                                        Szűrők törlése és összes motor
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                            : 'flex flex-col gap-4',
                                        isPageLoading && 'opacity-60 pointer-events-none transition-opacity duration-200'
                                    )}
                                >
                                    {motors.data.map((motor, index) => (
                                        <CatalogMotorCard
                                            key={motor.id}
                                            motor={motor}
                                            priority={index < 6}
                                            layout={viewMode}
                                            onQuickView={(m) => {
                                                setSelectedMotor(m);
                                                setModalImageIndex(0);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {motors.last_page > 1 && (
                                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-8 border-t border-border/60">
                                    {motors.links.map((link, i) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={i}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className="px-3.5 py-1.5 text-xs text-muted-foreground opacity-50 cursor-not-allowed select-none rounded-lg"
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${link.active
                                                    ? 'bg-teal text-white font-semibold shadow-xs'
                                                    : 'bg-card border border-border/70 text-foreground hover:bg-muted'
                                                    }`}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>

            {/* ────────────────────────────────────────────────────────
                MOBILE FILTER DIALOG (Slide-in Sheet)
            ──────────────────────────────────────────────────────── */}
            <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-teal" />
                            Szűrők
                        </DialogTitle>
                        <DialogDescription>
                            Finomítsa a keresést márka, kategória és ár alapján.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 pt-3">
                        {/* Search input */}
                        <div>
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Keresés</Label>
                            <Input
                                placeholder="Modell megnevezése..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        {/* Brand Select */}
                        <div>
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Márka</Label>
                            <Select value={brandId} onValueChange={setBrandId}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Összes márka" />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                    <SelectItem value="all">Összes márka</SelectItem>
                                    {brands.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>
                                            {b.name} {typeof b.motors_count === 'number' ? `(${b.motors_count})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Select */}
                        <div>
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Kategória</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Összes kategória" />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                    <SelectItem value="all">Összes kategória</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name} {typeof c.motors_count === 'number' ? `(${c.motors_count})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Slider Filter */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Ár (HUF)
                                </Label>
                                {(minPrice || maxPrice) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSliderValues([sliderMin, sliderMax]);
                                            setMinPrice('');
                                            setMaxPrice('');
                                        }}
                                        className="text-teal hover:underline text-[11px]"
                                    >
                                        Alaphelyzet
                                    </button>
                                )}
                            </div>

                            {/* From / To Badges */}
                            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                    {formatHuf(sliderValues[0])}
                                </div>
                                <span className="text-muted-foreground font-normal">—</span>
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                    {formatHuf(sliderValues[1])}
                                </div>
                            </div>

                            {/* Dual Slider */}
                            <div className="px-1 pt-1.5 pb-1">
                                <Slider
                                    min={sliderMin}
                                    max={sliderMax}
                                    step={sliderStep}
                                    value={[sliderValues[0], sliderValues[1]]}
                                    onValueChange={(val: number[]) => {
                                        const newMin = val[0];
                                        const newMax = val[1];
                                        setSliderValues([newMin, newMax]);
                                        setMinPrice(newMin <= sliderMin ? '' : String(newMin));
                                        setMaxPrice(newMax >= sliderMax ? '' : String(newMax));
                                    }}
                                />
                            </div>
                        </div>

                        {/* Year Slider Filter */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Évjárat
                                </Label>
                                {(minYear || maxYear) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setYearSliderValues([sliderYearMin, sliderYearMax]);
                                            setMinYear('');
                                            setMaxYear('');
                                        }}
                                        className="text-teal hover:underline text-[11px]"
                                    >
                                        Alaphelyzet
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                    {yearSliderValues[0]}
                                </div>
                                <span className="text-muted-foreground font-normal">—</span>
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                    {yearSliderValues[1]}
                                </div>
                            </div>

                            <div className="px-1 pt-1.5 pb-1">
                                <Slider
                                    min={sliderYearMin}
                                    max={sliderYearMax}
                                    step={1}
                                    value={[yearSliderValues[0], yearSliderValues[1]]}
                                    onValueChange={(val: number[]) => {
                                        const newMin = val[0];
                                        const newMax = val[1];
                                        setYearSliderValues([newMin, newMax]);
                                        setMinYear(newMin <= sliderYearMin ? '' : String(newMin));
                                        setMaxYear(newMax >= sliderYearMax ? '' : String(newMax));
                                    }}
                                />
                            </div>
                        </div>

                        {/* CC Slider Filter */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Hengerűrtartalom (cm³)
                                </Label>
                                {(minCc || maxCc) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCcSliderValues([sliderCcMin, sliderCcMax]);
                                            setMinCc('');
                                            setMaxCc('');
                                        }}
                                        className="text-teal hover:underline text-[11px]"
                                    >
                                        Alaphelyzet
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Tól:</span>
                                    {ccSliderValues[0]} cm³
                                </div>
                                <span className="text-muted-foreground font-normal">—</span>
                                <div className="flex-1 rounded-lg bg-background border border-border/60 px-2.5 py-1 text-foreground shadow-2xs text-right">
                                    <span className="text-[10px] text-muted-foreground block font-normal">Ig:</span>
                                    {ccSliderValues[1]} cm³
                                </div>
                            </div>

                            <div className="px-1 pt-1.5 pb-1">
                                <Slider
                                    min={sliderCcMin}
                                    max={sliderCcMax}
                                    step={sliderCcStep}
                                    value={[ccSliderValues[0], ccSliderValues[1]]}
                                    onValueChange={(val: number[]) => {
                                        const newMin = val[0];
                                        const newMax = val[1];
                                        setCcSliderValues([newMin, newMax]);
                                        setMinCc(newMin <= sliderCcMin ? '' : String(newMin));
                                        setMaxCc(newMax >= sliderCcMax ? '' : String(newMax));
                                    }}
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="flex-1"
                            >
                                Törlés
                            </Button>
                            <Button
                                onClick={() => applyFilters()}
                                className="flex-1 bg-teal text-white hover:bg-teal/90"
                            >
                                Szűrés
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ────────────────────────────────────────────────────────
                QUICK VIEW DIALOG (Motor Details Modal)
            ──────────────────────────────────────────────────────── */}
            <Dialog open={Boolean(selectedMotor)} onOpenChange={(open) => !open && setSelectedMotor(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                    {selectedMotor && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <div className="text-xs font-semibold uppercase tracking-wider text-teal">
                                    {selectedMotor.brand?.name} • {selectedMotor.category?.name}
                                </div>
                                <DialogTitle className="text-2xl font-bold sm:text-3xl text-foreground">
                                    {selectedMotor.name}
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    {selectedMotor.name} részletes adatai
                                </DialogDescription>
                            </DialogHeader>

                            {/* Main Image & Carousel Preview */}
                            <div className="space-y-3">
                                <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-muted/50 border border-border/70">
                                    <img
                                        src={modalImages[modalImageIndex] || '/img/moto-1.png'}
                                        alt={selectedMotor.name}
                                        className="h-full w-full object-cover object-center"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/img/moto-1.png';
                                        }}
                                    />
                                </div>

                                {modalImages.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                        {modalImages.map((src, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setModalImageIndex(i)}
                                                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${modalImageIndex === i
                                                    ? 'border-teal scale-105'
                                                    : 'border-transparent opacity-65 hover:opacity-100'
                                                    }`}
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Kép ${i + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price Bar */}
                            <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4 border border-border/60">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Vételár:</span>
                                    <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                        {formatHuf(selectedMotor.price)}
                                    </span>
                                </div>
                                {selectedMotor.condition && (
                                    <Badge variant="outline" className="text-sm px-3 py-1 font-semibold border-teal/40 text-teal bg-teal/10">
                                        {selectedMotor.condition}
                                    </Badge>
                                )}
                            </div>

                            {/* Tech Specs Grid */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                    Műszaki adatok
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Évjárat</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {selectedMotor.year}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Futásteljesítmény</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {(selectedMotor.km || 0).toLocaleString('hu-HU')} km
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Teljesítmény</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {selectedMotor.performance ? `${selectedMotor.performance} LE` : '-'}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Hengerűrtartalom</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {selectedMotor.cylinders_cm3 ? `${selectedMotor.cylinders_cm3} cm³` : '-'}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Hengerek száma</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {selectedMotor.cylinders || '-'}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-card p-3">
                                        <span className="text-xs text-muted-foreground block">Jogosítvány típus</span>
                                        <span className="font-bold text-foreground mt-0.5 block">
                                            {selectedMotor.driver_license || 'A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description if present */}
                            {(selectedMotor.short_description || selectedMotor.description) && (
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                        Leírás és felszereltség
                                    </h4>
                                    {selectedMotor.short_description && (
                                        <p className="text-sm font-medium text-foreground mb-2">
                                            {selectedMotor.short_description}
                                        </p>
                                    )}
                                    {selectedMotor.description && (
                                        <div
                                            className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-h-48 overflow-y-auto rounded-xl bg-muted/20 p-4 border border-border/40 scrollbar-thin"
                                            dangerouslySetInnerHTML={{ __html: selectedMotor.description }}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Action CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border/60">
                                <Button
                                    asChild
                                    className="flex-1 bg-teal text-white hover:bg-teal/90 rounded-xl py-2.5 font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <a href="tel:+36301234567">
                                        <Phone className="h-4 w-4" />
                                        <span>Érdeklődés telefonon</span>
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1 rounded-xl py-2.5 font-semibold text-sm flex items-center justify-center gap-2 border-border/80"
                                >
                                    <Link href="/elerhetosegek">
                                        <Mail className="h-4 w-4" />
                                        <span>Kapcsolatfelvétel</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
