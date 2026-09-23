import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    MessageSquarePlus,
    MessageSquareQuote,
    Pencil,
    Plus,
    Search,
    Star,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { destroy, store, update } from '@/routes/admin/testimonials';
import type { BreadcrumbItem } from '@/types';

export interface TestimonialItem {
    id: number;
    name: string;
    quote: string;
    rating: number;
    date: string;
    image: string | null;
    is_active: boolean;
    order: number;
    created_at?: string;
}

interface TestimonialsIndexProps {
    testimonials: TestimonialItem[];
}

export default function TestimonialsIndex({
    testimonials,
}: TestimonialsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<TestimonialItem | null>(null);

    // Form setup for create & edit
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        quote: '',
        rating: 5,
        date: 'Nemrég',
        image: '',
        is_active: true,
        order: 0,
    });

    const openCreateDialog = () => {
        setEditingItem(null);
        clearErrors();
        reset();
        setData({
            name: '',
            quote: '',
            rating: 5,
            date: 'Nemrég',
            image: '',
            is_active: true,
            order: (testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.order)) + 1 : 1),
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: TestimonialItem) => {
        setEditingItem(item);
        clearErrors();
        setData({
            name: item.name,
            quote: item.quote,
            rating: item.rating,
            date: item.date,
            image: item.image ?? '',
            is_active: Boolean(item.is_active),
            order: item.order,
        });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (item: TestimonialItem) => {
        setDeletingItem(item);
        setIsDeleteDialogOpen(false); // reset
        setTimeout(() => setIsDeleteDialogOpen(true), 10);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(update.url({ testimonial: editingItem.id }), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(store.url(), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        router.delete(destroy.url({ testimonial: deletingItem.id }), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setDeletingItem(null);
            },
        });
    };

    const toggleActive = (item: TestimonialItem) => {
        router.put(
            update.url({ testimonial: item.id }),
            {
                name: item.name,
                quote: item.quote,
                rating: item.rating,
                date: item.date,
                image: item.image,
                is_active: !item.is_active,
                order: item.order,
            },
            {
                preserveScroll: true,
            }
        );
    };

    // Filtered testimonials
    const filteredTestimonials = useMemo(() => {
        return testimonials.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.quote.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (statusFilter === 'active') return item.is_active;
            if (statusFilter === 'inactive') return !item.is_active;
            return true;
        });
    }, [testimonials, searchTerm, statusFilter]);

    // Statistics
    const totalCount = testimonials.length;
    const activeCount = testimonials.filter((t) => t.is_active).length;
    const avgRating =
        totalCount > 0
            ? (
                  testimonials.reduce((acc, t) => acc + t.rating, 0) /
                  totalCount
              ).toFixed(1)
            : '5.0';

    return (
        <>
            <Head title="Vélemények kezelése" />

            <div className="container max-w-6xl py-6 px-4 md:px-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Vélemények kezelése
                            </h1>
                            <Badge variant="secondary" className="text-xs">
                                Google Értékelések
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Itt kezelheti a főoldalon megjelenő vásárlói értékeléseket, szerkesztheti vagy új véleményt adhat hozzá.
                        </p>
                    </div>

                    <Button onClick={openCreateDialog} className="shrink-0">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Új vélemény hozzáadása
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Összes vélemény
                            </CardTitle>
                            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-6 pb-4">
                            <div className="text-2xl font-bold">{totalCount} db</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Az adatbázisban tárolt értékelések száma
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Megjelenő (Aktív)
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="px-6 pb-4">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {activeCount} db
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Látható a weboldal látogatói számára
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Átlagos értékelés
                            </CardTitle>
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        </CardHeader>
                        <CardContent className="px-6 pb-4">
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <span>{avgRating}</span>
                                <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Google vásárlói elégedettségi mutató
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Keresés név vagy szöveg alapján..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                        >
                            Mind ({totalCount})
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                        >
                            Aktív ({activeCount})
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                        >
                            Rejtett ({totalCount - activeCount})
                        </Button>
                    </div>
                </div>

                {/* Testimonials List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTestimonials.length === 0 ? (
                        <div className="col-span-full py-12 text-center border rounded-xl bg-card">
                            <MessageSquarePlus className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
                            <h3 className="text-base font-semibold">Nincs találat</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Nem található vélemény a megadott keresési feltételek alapján.
                            </p>
                        </div>
                    ) : (
                        filteredTestimonials.map((item) => (
                            <Card
                                key={item.id}
                                className={`transition-all ${
                                    !item.is_active ? 'opacity-60 bg-muted/30' : ''
                                }`}
                            >
                                <CardHeader className="p-5 pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border">
                                                {item.image && (
                                                    <AvatarImage src={item.image} alt={item.name} />
                                                )}
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                                    {item.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .slice(0, 2)
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    {item.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex text-amber-400">
                                                        {[...Array(item.rating)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="h-3 w-3 fill-current"
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        • {item.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant={item.is_active ? 'default' : 'secondary'}
                                                className="text-[11px]"
                                            >
                                                {item.is_active ? 'Aktív' : 'Rejtett'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-5 pb-4">
                                    <p className="text-sm text-foreground/90 leading-relaxed italic line-clamp-3">
                                        "{item.quote}"
                                    </p>

                                    <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                                        <span className="font-mono text-[11px]">
                                            Sorrend: #{item.order}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2"
                                                onClick={() => toggleActive(item)}
                                                title={item.is_active ? 'Elrejtés' : 'Megjelenítés'}
                                            >
                                                {item.is_active ? (
                                                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-primary hover:text-primary"
                                                onClick={() => openEditDialog(item)}
                                                title="Szerkesztés"
                                            >
                                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                                Szerkesztés
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => openDeleteDialog(item)}
                                                title="Törlés"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                Törlés
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Create / Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem
                                    ? 'Vélemény szerkesztése'
                                    : 'Új vélemény hozzáadása'}
                            </DialogTitle>
                            <DialogDescription>
                                Töltse ki az alábbi adatokat a vásárlói értékelés rögzítéséhez.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="form-name">Ügyfél neve *</Label>
                                <Input
                                    id="form-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="pl. Kovács Bence"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Quote */}
                            <div className="space-y-1.5">
                                <Label htmlFor="form-quote">Vélemény szövege *</Label>
                                <Textarea
                                    id="form-quote"
                                    rows={3}
                                    value={data.quote}
                                    onChange={(e) => setData('quote', e.target.value)}
                                    placeholder="Írja le a vásárló tapasztalatát..."
                                    required
                                />
                                {errors.quote && (
                                    <p className="text-xs text-destructive">{errors.quote}</p>
                                )}
                            </div>

                            {/* Rating (Stars) and Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Értékelés (Csillagok) *</Label>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[1, 2, 3, 4, 5].map((starValue) => (
                                            <button
                                                type="button"
                                                key={starValue}
                                                onClick={() => setData('rating', starValue)}
                                                className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${
                                                        starValue <= data.rating
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-muted-foreground/30'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-xs font-semibold ml-2">
                                            {data.rating} / 5
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="text-xs text-destructive">{errors.rating}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="form-date">Időpont / Dátum *</Label>
                                    <Input
                                        id="form-date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        placeholder="pl. 2 hete, 1 hónapja"
                                        required
                                    />
                                    {errors.date && (
                                        <p className="text-xs text-destructive">{errors.date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Image and Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="form-image">Profilkép URL (Opcionális)</Label>
                                    <Input
                                        id="form-image"
                                        type="url"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.image && (
                                        <p className="text-xs text-destructive">{errors.image}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="form-order">Sorrend száma</Label>
                                    <Input
                                        id="form-order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData('order', parseInt(e.target.value) || 0)
                                        }
                                        placeholder="0"
                                    />
                                    {errors.order && (
                                        <p className="text-xs text-destructive">{errors.order}</p>
                                    )}
                                </div>
                            </div>

                            {/* Active Checkbox */}
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                    id="form-is-active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', Boolean(checked))
                                    }
                                />
                                <Label
                                    htmlFor="form-is-active"
                                    className="text-sm font-normal cursor-pointer select-none"
                                >
                                    Megjelenjen a weboldalon (Aktív)
                                </Label>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={processing}
                                >
                                    Mégse
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mentés...' : editingItem ? 'Frissítés' : 'Hozzáadás'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Vélemény törlése</DialogTitle>
                            <DialogDescription>
                                Biztosan törölni szeretné a következő véleményt? Ez a művelet nem vonható vissza.
                            </DialogDescription>
                        </DialogHeader>

                        {deletingItem && (
                            <div className="p-3 rounded-lg border bg-muted/40 text-sm space-y-1">
                                <div className="font-semibold">{deletingItem.name}</div>
                                <div className="text-muted-foreground italic text-xs line-clamp-2">
                                    "{deletingItem.quote}"
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Mégse
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Törlés megerősítése
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

TestimonialsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Vélemények kezelése',
            href: '/admin/testimonials',
        },
    ] as BreadcrumbItem[],
};
