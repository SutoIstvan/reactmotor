import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    Bike,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleSlash,
    Clock,
    DollarSign,
    ExternalLink,
    Eye,
    Filter,
    Gauge,
    ImageIcon,
    Layers,
    Pencil,
    Plus,
    RefreshCw,
    RotateCcw,
    Search,
    Sparkles,
    Trash2,
    Video,
    X,
    Zap,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

export interface BrandItem {
    id: number;
    name: string;
}

export interface CategoryItem {
    id: number;
    name: string;
}

export interface MotorItem {
    id: number;
    name: string;
    price: number;
    discount_price: number | null;
    description: string;
    short_description: string;
    cylinders: number;
    cylinders_cm3: number;
    year: number;
    km: number;
    performance: string;
    condition: string | null;
    top: string | boolean;
    driver_license: string | null;
    main_image: string | null;
    video: string | null;
    images_id: string | null;
    category_id: number;
    brand_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    brand?: BrandItem;
    category?: CategoryItem;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMotors {
    data: MotorItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface MotorsIndexProps {
    motors: PaginatedMotors;
    brands: BrandItem[];
    categories: CategoryItem[];
    filters: {
        search?: string;
        brand_id?: string;
        category_id?: string;
        condition?: string;
        top?: string;
        status?: string;
        sort?: string;
    };
    stats: {
        total: number;
        active: number;
        archived: number;
        featured: number;
    };
}

export default function MotorsIndex({
    motors,
    brands = [],
    categories = [],
    filters = {},
    stats = { total: 0, active: 0, archived: 0, featured: 0 },
}: MotorsIndexProps) {
    // Local filter state with type guards (avoids Array.prototype.sort or undefined errors)
    const [search, setSearch] = useState(typeof filters?.search === 'string' ? filters.search : '');
    const [brandId, setBrandId] = useState(typeof filters?.brand_id === 'string' ? filters.brand_id : 'all');
    const [categoryId, setCategoryId] = useState(typeof filters?.category_id === 'string' ? filters.category_id : 'all');
    const [condition, setCondition] = useState(typeof filters?.condition === 'string' ? filters.condition : 'all');
    const [status, setStatus] = useState(typeof filters?.status === 'string' ? filters.status : 'all');
    const [sort, setSort] = useState(typeof filters?.sort === 'string' ? filters.sort : 'latest');

    // Dialogs state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isForceDelete, setIsForceDelete] = useState(false);
    const [editingMotor, setEditingMotor] = useState<MotorItem | null>(null);
    const [targetMotor, setTargetMotor] = useState<MotorItem | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form setup
    const form = useForm({
        name: '',
        brand_id: brands[0]?.id?.toString() || '',
        category_id: categories[0]?.id?.toString() || '',
        price: '',
        discount_price: '',
        year: new Date().getFullYear().toString(),
        km: '0',
        cylinders: '2',
        cylinders_cm3: '650',
        performance: '50 kW / 68 LE',
        condition: 'Normál',
        driver_license: 'A',
        top: false,
        short_description: '',
        description: '',
        main_image: '',
        main_image_file: null as File | null,
        video: '',
    });

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (search) count++;
        if (brandId !== 'all') count++;
        if (categoryId !== 'all') count++;
        if (condition !== 'all') count++;
        if (status !== 'all') count++;
        if (sort !== 'latest') count++;
        return count;
    }, [search, brandId, categoryId, condition, status, sort]);

    // Apply filters
    const applyFilters = (newParams?: Record<string, string>) => {
        const query: Record<string, string> = {
            ...(search ? { search } : {}),
            ...(brandId !== 'all' ? { brand_id: brandId } : {}),
            ...(categoryId !== 'all' ? { category_id: categoryId } : {}),
            ...(condition !== 'all' ? { condition } : {}),
            ...(status !== 'all' ? { status } : {}),
            ...(sort !== 'latest' ? { sort } : {}),
            ...newParams,
        };

        // Clean out empty/default values
        Object.keys(query).forEach((key) => {
            if (query[key] === 'all' || query[key] === '') {
                delete query[key];
            }
        });

        router.get('/admin/motors', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleResetFilters = () => {
        setSearch('');
        setBrandId('all');
        setCategoryId('all');
        setCondition('all');
        setStatus('all');
        setSort('latest');
        router.get('/admin/motors', {}, { preserveState: true, replace: true });
    };

    // Open Create Dialog
    const openCreateDialog = () => {
        setEditingMotor(null);
        setImagePreview(null);
        form.clearErrors();
        form.reset();
        form.setData({
            name: '',
            brand_id: brands[0]?.id?.toString() || '',
            category_id: categories[0]?.id?.toString() || '',
            price: '',
            discount_price: '',
            year: new Date().getFullYear().toString(),
            km: '0',
            cylinders: '2',
            cylinders_cm3: '650',
            performance: '50 kW / 68 LE',
            condition: 'Normál',
            driver_license: 'A',
            top: false,
            short_description: '',
            description: '',
            main_image: '',
            main_image_file: null,
            video: '',
        });
        setIsFormOpen(true);
    };

    // Open Edit Dialog
    const openEditDialog = (motor: MotorItem) => {
        setEditingMotor(motor);
        setImagePreview(formatImageUrl(motor.main_image));
        form.clearErrors();
        form.setData({
            name: motor.name || '',
            brand_id: motor.brand_id?.toString() || '',
            category_id: motor.category_id?.toString() || '',
            price: motor.price?.toString() || '',
            discount_price: motor.discount_price ? motor.discount_price.toString() : '',
            year: motor.year?.toString() || new Date().getFullYear().toString(),
            km: motor.km?.toString() || '0',
            cylinders: motor.cylinders?.toString() || '1',
            cylinders_cm3: motor.cylinders_cm3?.toString() || '',
            performance: motor.performance || '',
            condition: motor.condition || 'Normál',
            driver_license: motor.driver_license || 'A',
            top: motor.top === '1' || motor.top === true,
            short_description: motor.short_description || '',
            description: motor.description || '',
            main_image: motor.main_image || '',
            main_image_file: null,
            video: motor.video && motor.video !== 'NULL' ? motor.video : '',
        });
        setIsFormOpen(true);
    };

    // Handle Image file select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('main_image_file', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit form (create or edit)
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingMotor) {
            router.post(
                `/admin/motors/${editingMotor.id}`,
                {
                    _method: 'put',
                    ...form.data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setIsFormOpen(false);
                        form.reset();
                    },
                }
            );
        } else {
            router.post('/admin/motors', form.data, {
                forceFormData: true,
                onSuccess: () => {
                    setIsFormOpen(false);
                    form.reset();
                },
            });
        }
    };

    // Delete actions
    const openDeleteDialog = (motor: MotorItem, force = false) => {
        setTargetMotor(motor);
        setIsForceDelete(force);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!targetMotor) return;

        const url = isForceDelete
            ? `/admin/motors/${targetMotor.id}?force=1`
            : `/admin/motors/${targetMotor.id}`;

        router.delete(url, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setTargetMotor(null);
            },
        });
    };

    // Restore action
    const handleRestore = (motor: MotorItem) => {
        router.post(`/admin/motors/${motor.id}/restore`, {}, {
            preserveScroll: true,
        });
    };

    // Helper: format image url
    function formatImageUrl(path: string | null | undefined): string | null {
        if (!path || path === 'NULL') return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const clean = path.replace(/^\/+/, '');
        return `/${clean}`;
    }

    // Helper: format HUF currency
    function formatHuf(amount: number | string | null | undefined): string {
        if (!amount && amount !== 0) return '0 Ft';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('hu-HU').format(num) + ' Ft';
    }

    return (
        <>
            <Head title="Motorkerékpárok kezelése | Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header & Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Bike className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Motorkerékpárok
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                            Készletkezelés, importált motorok szerkesztése, keresés, szűrés és új hirdetések feladása.
                        </p>
                    </div>

                    <Button onClick={openCreateDialog} className="shadow-sm gap-2">
                        <Plus className="h-4 w-4" />
                        Új motorkerékpár
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <Card
                        className={`cursor-pointer transition-all hover:border-primary/50 ${
                            status === 'all' ? 'border-primary/50 bg-primary/5' : ''
                        }`}
                        onClick={() => {
                            setStatus('all');
                            applyFilters({ status: 'all' });
                        }}
                    >
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-xs uppercase font-medium">Összes motor</CardDescription>
                            <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <span className="text-xs text-muted-foreground">Teljes adatbázis</span>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:border-emerald-500/50 ${
                            status === 'active' ? 'border-emerald-500/50 bg-emerald-500/5' : ''
                        }`}
                        onClick={() => {
                            setStatus('active');
                            applyFilters({ status: 'active' });
                        }}
                    >
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-xs uppercase font-medium text-emerald-600 dark:text-emerald-400">
                                Aktív motorok
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.active}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <span className="text-xs text-muted-foreground">Elérhető a weboldalon</span>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:border-amber-500/50 ${
                            status === 'archived' ? 'border-amber-500/50 bg-amber-500/5' : ''
                        }`}
                        onClick={() => {
                            setStatus('archived');
                            applyFilters({ status: 'archived' });
                        }}
                    >
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-xs uppercase font-medium text-amber-600 dark:text-amber-400">
                                Archivált / Törölt
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {stats.archived}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <span className="text-xs text-muted-foreground">Soft-deleted elemek</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-xs uppercase font-medium text-purple-600 dark:text-purple-400">
                                Kiemelt ajánlatok
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.featured}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <span className="text-xs text-muted-foreground">Főoldali Top kiemelt</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <Card className="border shadow-xs">
                    <CardContent className="p-4 md:p-5 flex flex-col gap-4">
                        {/* Search + Action Buttons */}
                        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Keresés név, leírás vagy felszereltség alapján..."
                                    className="pl-9 w-full"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            applyFilters({ search: '' });
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" variant="secondary" className="gap-2 shrink-0">
                                    <Search className="h-4 w-4" />
                                    Keresés
                                </Button>

                                {activeFilterCount > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResetFilters}
                                        className="gap-2 text-muted-foreground shrink-0"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Szűrők törlése ({activeFilterCount})
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Dropdown Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t">
                            {/* Brand Filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Márka</Label>
                                <Select
                                    value={brandId}
                                    onValueChange={(val) => {
                                        setBrandId(val);
                                        applyFilters({ brand_id: val });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Összes márka" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Összes márka</SelectItem>
                                        {brands.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Kategória</Label>
                                <Select
                                    value={categoryId}
                                    onValueChange={(val) => {
                                        setCategoryId(val);
                                        applyFilters({ category_id: val });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Összes kategória" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Összes kategória</SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Állapot (Státusz)</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => {
                                        setStatus(val);
                                        applyFilters({ status: val });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Státusz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Összes ({stats.total})</SelectItem>
                                        <SelectItem value="active">Csak aktív ({stats.active})</SelectItem>
                                        <SelectItem value="archived">Csak archivált ({stats.archived})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Condition Filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Műszaki állapot</Label>
                                <Select
                                    value={condition}
                                    onValueChange={(val) => {
                                        setCondition(val);
                                        applyFilters({ condition: val });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Összes állapot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Összes állapot</SelectItem>
                                        <SelectItem value="Új">Új</SelectItem>
                                        <SelectItem value="Újszerű">Újszerű</SelectItem>
                                        <SelectItem value="Normál">Normál</SelectItem>
                                        <SelectItem value="Sérült">Sérült</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Rendezés</Label>
                                <Select
                                    value={sort}
                                    onValueChange={(val) => {
                                        setSort(val);
                                        applyFilters({ sort: val });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Rendezés" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Legújabb elöl</SelectItem>
                                        <SelectItem value="oldest">Legrégebbi elöl</SelectItem>
                                        <SelectItem value="price_asc">Ár: növekvő</SelectItem>
                                        <SelectItem value="price_desc">Ár: csökkenő</SelectItem>
                                        <SelectItem value="year_desc">Évjárat: legújabb</SelectItem>
                                        <SelectItem value="km_asc">Km: legkevesebb</SelectItem>
                                        <SelectItem value="name_asc">Név: A-Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Motorcycle List / Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                        <span>
                            Találatok: <strong className="text-foreground">{motors.total}</strong> motorkerékpár
                            {motors.total > 0 && ` (oldal: ${motors.current_page} / ${motors.last_page})`}
                        </span>
                    </div>

                    {motors.data.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                                <Bike className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold">Nincs találat a megadott feltételekkel</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto mt-1 mb-5">
                                Próbáljon meg más keresőszót vagy módosítsa a szűrési feltételeket, esetleg váltson a &quot;Összes&quot; státuszra.
                            </p>
                            <Button variant="outline" onClick={handleResetFilters}>
                                Szűrők visszaállítása
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {motors.data.map((motor) => {
                                const imgUrl = formatImageUrl(motor.main_image);
                                const isArchived = Boolean(motor.deleted_at);
                                const isTop = motor.top === '1' || motor.top === true;

                                return (
                                    <Card
                                        key={motor.id}
                                        className={`overflow-hidden border flex flex-col justify-between transition-all hover:shadow-md ${
                                            isArchived ? 'opacity-75 bg-muted/20 border-dashed' : ''
                                        }`}
                                    >
                                        <div>
                                            {/* Image & Badges */}
                                            <div className="relative aspect-16/10 bg-muted/60 overflow-hidden group">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={motor.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => {
                                                            // Fallback to placeholder if broken image
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                                        <Bike className="h-12 w-12 stroke-[1.2]" />
                                                        <span className="text-xs mt-1">Nincs kép feltöltve</span>
                                                    </div>
                                                )}

                                                {/* Top Badges */}
                                                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                                                    {motor.brand && (
                                                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs font-semibold shadow-xs">
                                                            {motor.brand.name}
                                                        </Badge>
                                                    )}
                                                    {motor.category && (
                                                        <Badge variant="outline" className="bg-background/80 backdrop-blur-xs text-xs">
                                                            {motor.category.name}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                                                    {isTop && (
                                                        <Badge className="bg-purple-600 text-white hover:bg-purple-700 shadow-xs gap-1 text-[11px]">
                                                            <Sparkles className="h-3 w-3" />
                                                            Kiemelt
                                                        </Badge>
                                                    )}
                                                    {isArchived ? (
                                                        <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] gap-1">
                                                            <Archive className="h-3 w-3" />
                                                            Archivált
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] gap-1">
                                                            <Check className="h-3 w-3" />
                                                            Aktív
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Details Header */}
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <CardTitle className="text-base font-bold line-clamp-1">
                                                        {motor.name}
                                                    </CardTitle>
                                                </div>

                                                {/* Price row */}
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-lg font-extrabold text-primary">
                                                        {formatHuf(motor.price)}
                                                    </span>
                                                    {motor.discount_price && motor.discount_price > 0 && motor.discount_price !== motor.price && (
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            {formatHuf(motor.discount_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </CardHeader>

                                            {/* Specs pills */}
                                            <CardContent className="p-4 pt-1 pb-3 space-y-3">
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                                        <span>{motor.year || '—'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Gauge className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                                        <span>{motor.km ? `${new Intl.NumberFormat('hu-HU').format(motor.km)} km` : '0 km'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                                        <span className="truncate">{motor.performance || '—'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Layers className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                                        <span>{motor.cylinders_cm3 ? `${motor.cylinders_cm3} cm³` : '—'}</span>
                                                    </div>
                                                </div>

                                                {motor.short_description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                                        &quot;{motor.short_description}&quot;
                                                    </p>
                                                )}
                                            </CardContent>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="p-4 pt-2 border-t flex items-center justify-between gap-2 bg-muted/10">
                                            <div className="text-[11px] text-muted-foreground">
                                                ID: #{motor.id}
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {/* Restore button if archived */}
                                                {isArchived ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRestore(motor)}
                                                            className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1"
                                                            title="Visszaállítás aktívvá"
                                                        >
                                                            <RefreshCw className="h-3.5 w-3.5" />
                                                            Visszaállítás
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openDeleteDialog(motor, true)}
                                                            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                                            title="Végleges törlés"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openDeleteDialog(motor, false)}
                                                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                                        title="Archiválás / Törlés"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}

                                                {/* Edit button */}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => openEditDialog(motor)}
                                                    className="h-8 px-3 text-xs gap-1.5"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Szerkesztés
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {motors.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                            <div className="text-xs text-muted-foreground">
                                Megjelenítve: {motors.from} - {motors.to} / összesen {motors.total}
                            </div>

                            <div className="flex flex-wrap items-center gap-1">
                                {motors.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 text-xs text-muted-foreground/50 border rounded-md"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground font-semibold border-primary'
                                                    : 'hover:bg-muted text-foreground'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bike className="h-5 w-5 text-primary" />
                            {editingMotor ? 'Motorkerékpár szerkesztése' : 'Új motorkerékpár hozzáadása'}
                        </DialogTitle>
                        <DialogDescription>
                            Adja meg a motorkerékpár részletes műszaki adatait, árát és leírását.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-6 pt-2">
                        {/* Section: Alapadatok */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-primary border-b pb-1">
                                1. Alapadatok és Besorolás
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3 space-y-1.5">
                                    <Label htmlFor="motor_name">Modell megnevezése *</Label>
                                    <Input
                                        id="motor_name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="pl. BMW F 800 ST ABS"
                                        required
                                    />
                                    {form.errors.name && (
                                        <p className="text-xs text-destructive">{form.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_brand">Márka *</Label>
                                    <Select
                                        value={form.data.brand_id}
                                        onValueChange={(val) => form.setData('brand_id', val)}
                                    >
                                        <SelectTrigger id="motor_brand" className="w-full">
                                            <SelectValue placeholder="Válasszon márkát" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((b) => (
                                                <SelectItem key={b.id} value={b.id.toString()}>
                                                    {b.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.brand_id && (
                                        <p className="text-xs text-destructive">{form.errors.brand_id}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_category">Kategória *</Label>
                                    <Select
                                        value={form.data.category_id}
                                        onValueChange={(val) => form.setData('category_id', val)}
                                    >
                                        <SelectTrigger id="motor_category" className="w-full">
                                            <SelectValue placeholder="Válasszon kategóriát" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.category_id && (
                                        <p className="text-xs text-destructive">{form.errors.category_id}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_condition">Állapot</Label>
                                    <Select
                                        value={form.data.condition}
                                        onValueChange={(val) => form.setData('condition', val)}
                                    >
                                        <SelectTrigger id="motor_condition" className="w-full">
                                            <SelectValue placeholder="Állapot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Új">Új</SelectItem>
                                            <SelectItem value="Újszerű">Újszerű</SelectItem>
                                            <SelectItem value="Normál">Normál</SelectItem>
                                            <SelectItem value="Sérült">Sérült</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Ár & Kiemelés */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-primary border-b pb-1">
                                2. Árak és Kiemelés
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_price">Vételár (Ft) *</Label>
                                    <Input
                                        id="motor_price"
                                        type="number"
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', e.target.value)}
                                        placeholder="pl. 1399999"
                                        required
                                    />
                                    {form.errors.price && (
                                        <p className="text-xs text-destructive">{form.errors.price}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_discount_price">Akciós ár / Eredeti ár (Ft)</Label>
                                    <Input
                                        id="motor_discount_price"
                                        type="number"
                                        value={form.data.discount_price}
                                        onChange={(e) => form.setData('discount_price', e.target.value)}
                                        placeholder="pl. 1499999 (opcionális)"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-6">
                                    <Checkbox
                                        id="motor_top"
                                        checked={Boolean(form.data.top)}
                                        onCheckedChange={(checked) => form.setData('top', Boolean(checked))}
                                    />
                                    <Label htmlFor="motor_top" className="cursor-pointer text-sm font-medium">
                                        Kiemelt ajánlat (Főoldali Top)
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Section: Műszaki adatok */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-primary border-b pb-1">
                                3. Műszaki paraméterek
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_year">Évjárat *</Label>
                                    <Input
                                        id="motor_year"
                                        type="number"
                                        value={form.data.year}
                                        onChange={(e) => form.setData('year', e.target.value)}
                                        placeholder="2018"
                                        required
                                    />
                                    {form.errors.year && (
                                        <p className="text-xs text-destructive">{form.errors.year}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_km">Futásteljesítmény (km) *</Label>
                                    <Input
                                        id="motor_km"
                                        type="number"
                                        value={form.data.km}
                                        onChange={(e) => form.setData('km', e.target.value)}
                                        placeholder="25000"
                                        required
                                    />
                                    {form.errors.km && (
                                        <p className="text-xs text-destructive">{form.errors.km}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_cm3">Hengerűrtartalom (cm³) *</Label>
                                    <Input
                                        id="motor_cm3"
                                        type="number"
                                        value={form.data.cylinders_cm3}
                                        onChange={(e) => form.setData('cylinders_cm3', e.target.value)}
                                        placeholder="798"
                                        required
                                    />
                                    {form.errors.cylinders_cm3 && (
                                        <p className="text-xs text-destructive">{form.errors.cylinders_cm3}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_cylinders">Hengerek száma</Label>
                                    <Input
                                        id="motor_cylinders"
                                        type="number"
                                        value={form.data.cylinders}
                                        onChange={(e) => form.setData('cylinders', e.target.value)}
                                        placeholder="2"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_performance">Teljesítmény *</Label>
                                    <Input
                                        id="motor_performance"
                                        value={form.data.performance}
                                        onChange={(e) => form.setData('performance', e.target.value)}
                                        placeholder="pl. 62 kW vagy 84 LE"
                                        required
                                    />
                                    {form.errors.performance && (
                                        <p className="text-xs text-destructive">{form.errors.performance}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_license">Jogosítvány kategória</Label>
                                    <Input
                                        id="motor_license"
                                        value={form.data.driver_license}
                                        onChange={(e) => form.setData('driver_license', e.target.value)}
                                        placeholder="pl. A, A2, A1 vagy B"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Kép & Média */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-primary border-b pb-1">
                                4. Képek és Média
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="motor_file">Új kép feltöltése a számítógépről</Label>
                                        <Input
                                            id="motor_file"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="motor_image_url">Vagy kép URL megadása</Label>
                                        <Input
                                            id="motor_image_url"
                                            value={form.data.main_image}
                                            onChange={(e) => {
                                                form.setData('main_image', e.target.value);
                                                setImagePreview(formatImageUrl(e.target.value));
                                            }}
                                            placeholder="pl. storage/motors/pelda.jpg vagy https://..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="motor_video">Videó link (YouTube / videó link)</Label>
                                        <Input
                                            id="motor_video"
                                            value={form.data.video}
                                            onChange={(e) => form.setData('video', e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>
                                </div>

                                {/* Preview box */}
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 h-48 bg-muted/20">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Előnézet"
                                            className="h-full w-full object-contain rounded"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                                            <ImageIcon className="h-8 w-8 stroke-[1.2]" />
                                            <span>Kép előnézete itt jelenik meg</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section: Leírás */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-primary border-b pb-1">
                                5. Leírás és Felszereltség
                            </h4>

                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_short_desc">Rövid leírás / Kiemelt extrák</Label>
                                    <Input
                                        id="motor_short_desc"
                                        value={form.data.short_description}
                                        onChange={(e) => form.setData('short_description', e.target.value)}
                                        placeholder="pl. Gyári kulcs, Önindító, Tárcsafék, Friss szerviz"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="motor_desc">Részletes leírás</Label>
                                    <Textarea
                                        id="motor_desc"
                                        rows={6}
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        placeholder="Részletes leírás az állapotról, szervizmúltról, okmányokról..."
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                            >
                                Mégse
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Mentés...' : editingMotor ? 'Változtatások mentése' : 'Hozzáadás'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            {isForceDelete ? 'Végleges törlés megerősítése' : 'Motorkerékpár archiválása / törlése'}
                        </DialogTitle>
                        <DialogDescription>
                            {isForceDelete ? (
                                <>
                                    Biztosan <strong>véglegesen törölni</strong> szeretné a(z) &quot;{targetMotor?.name}&quot; motorkerékpárt az adatbázisból?
                                    Ez a művelet nem vonható vissza.
                                </>
                            ) : (
                                <>
                                    Biztosan archiválni (törölni) szeretné a(z) &quot;{targetMotor?.name}&quot; motorkerékpárt?
                                    Az elem nem jelenik meg többé az aktív listában, de a törölt elemek közül bármikor visszaállítható.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Mégse
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            {isForceDelete ? 'Végleges törlés' : 'Törlés / Archiválás'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

MotorsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Motorkerékpárok',
            href: '/admin/motors',
        },
    ] as BreadcrumbItem[],
};
