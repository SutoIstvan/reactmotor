'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Gauge,
    Calendar,
    Navigation,
    ShieldCheck,
    Phone,
    Mail,
    Tag,
    Bike,
    CheckCircle2,
    ArrowLeft,
    ZoomIn,
    FileText,
    Star,
    Info,
} from 'lucide-react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MotorData } from '@/components/catalog/catalog-motor-card';
import { formatHuf, formatImageUrl } from '@/components/catalog/catalog-motor-card';

interface MotorShowProps {
    motor: MotorData & {
        video?: string | null;
        created_at?: string;
    };
    relatedMotors?: MotorData[];
}

export default function MotorShow({ motor, relatedMotors = [] }: MotorShowProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Build full image list
    const allImages = useMemo(() => {
        const list: string[] = [];
        if (motor.main_image) {
            list.push(formatImageUrl(motor.main_image));
        }
        if (motor.images && motor.images.length > 0) {
            motor.images.forEach((img) => {
                const url = typeof img === 'string' ? img : img.url;
                const formatted = formatImageUrl(url);
                if (formatted && !list.includes(formatted)) {
                    list.push(formatted);
                }
            });
        }
        if (list.length === 0) list.push('/img/moto-1.png');
        return list;
    }, [motor]);

    const isTop = motor.top === '1' || motor.top === true;
    const hasDiscount = Boolean(
        motor.discount_price && motor.discount_price > 0 && motor.discount_price < motor.price,
    );
    const categoryName = motor.category?.name || 'Motorkerékpár';
    const brandName = motor.brand?.name || '';
    const formattedMileage = (motor.km || 0).toLocaleString('hu-HU');
    const powerText = motor.performance
        ? `${motor.performance} LE`
        : motor.cylinders_cm3
            ? `${motor.cylinders_cm3} cm³`
            : null;

    // Cleanup Fancybox on unmount
    useEffect(() => {
        return () => {
            Fancybox.destroy();
        };
    }, []);

    const openFancybox = (index: number) => {
        Fancybox.show(
            allImages.map((src, i) => ({
                src,
                thumb: src,
                caption: `${motor.name} (${i + 1} / ${allImages.length})`,
            })),
            {
                startIndex: index,
                theme: 'dark',
            },
        );
    };

    const nextImage = () =>
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () =>
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    return (
        <>
            <Head title={`${motor.name} | Márka Motor`}>
                <meta
                    name="description"
                    content={
                        motor.short_description ||
                        motor.description ||
                        `${motor.name} – ${brandName} ${categoryName}, ${motor.year}, ${formattedMileage} km`
                    }
                />
            </Head>

            <main className="bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden">
                <Navbar />

                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="bg-teal/5 absolute top-20 left-1/4 h-96 w-96 rounded-full blur-3xl" />
                    <div className="bg-teal/5 absolute top-1/2 right-1/4 h-80 w-80 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto flex-1 px-4 pt-24 pb-20 sm:px-6 lg:px-12 lg:pt-32">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Főoldal
                        </Link>
                        <span>/</span>
                        <Link href="/motorok" className="hover:text-foreground transition-colors">
                            Motorok
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium line-clamp-1 max-w-xs">
                            {motor.name}
                        </span>
                    </nav>

                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            href="/motorok"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Vissza a katalógusba
                        </Link>
                    </div>

                    {/* ── Main Product Layout ── */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-16">
                        {/* ── LEFT: Image Gallery ── */}
                        <div className="space-y-4">
                            {/* Main image */}
                            <div
                                onClick={() => openFancybox(activeImageIndex)}
                                className="relative overflow-hidden rounded-2xl bg-muted/40 border border-border/70 shadow-sm aspect-[4/3] group cursor-pointer"
                                title="Kattintson a képre a nagyításhoz"
                            >
                                <img
                                    src={allImages[activeImageIndex]}
                                    alt={`${motor.name} - ${activeImageIndex + 1}`}
                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/img/moto-1.png';
                                    }}
                                />

                                {/* Badges */}
                                <div className="absolute inset-x-3 top-3 flex items-center justify-between pointer-events-none z-10">
                                    <div className="flex gap-2">
                                        {isTop && (
                                            <Badge className="bg-teal/90 text-white border-teal/40 backdrop-blur-md shadow-sm">
                                                <Star className="h-3 w-3 mr-1" />
                                                Kiemelt
                                            </Badge>
                                        )}
                                        {motor.condition && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-black/60 text-white border-white/20 backdrop-blur-md"
                                            >
                                                {motor.condition}
                                            </Badge>
                                        )}
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-black/60 text-white border-white/20 backdrop-blur-md"
                                    >
                                        {motor.year}
                                    </Badge>
                                </div>

                                {/* Zoom button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openFancybox(activeImageIndex);
                                    }}
                                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md text-white px-3 py-1.5 text-xs font-medium hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                    Nagyítás
                                </button>

                                {/* Prev/Next arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevImage();
                                            }}
                                            aria-label="Előző kép"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextImage();
                                            }}
                                            aria-label="Következő kép"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs text-white font-medium">
                                        {activeImageIndex + 1} / {allImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                    {allImages.map((src, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                if (i === activeImageIndex) {
                                                    openFancybox(i);
                                                } else {
                                                    setActiveImageIndex(i);
                                                }
                                            }}
                                            title={i === activeImageIndex ? 'Kattintson a nagyításhoz' : `Kép ${i + 1}`}
                                            className={cn(
                                                'shrink-0 h-16 w-20 md:h-20 md:w-24 overflow-hidden rounded-xl border-2 transition-all cursor-pointer',
                                                i === activeImageIndex
                                                    ? 'border-teal shadow-md shadow-teal/5'
                                                    : 'border-border/60 opacity-70 hover:opacity-100 hover:border-border',
                                            )}
                                        >
                                            <img
                                                src={src}
                                                alt={`${motor.name} - ${i + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        '/img/moto-1.png';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Video embed */}
                            {motor.video && (
                                <div className="rounded-2xl overflow-hidden border border-border/70 aspect-video">
                                    <iframe
                                        src={motor.video.replace('watch?v=', 'embed/')}
                                        title={`${motor.name} videó`}
                                        allowFullScreen
                                        className="h-full w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT: Details ── */}
                        <div className="flex flex-col gap-6">
                            {/* Title & Brand */}
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                    <span>{brandName}</span>
                                    {categoryName && (
                                        <>
                                            <span>•</span>
                                            <span>{categoryName}</span>
                                        </>
                                    )}
                                    {/* {motor.driver_license && (
                                        <>
                                            <span>•</span>
                                            <span className="text-teal">
                                                {motor.driver_license} jogosítvány
                                            </span>
                                        </>
                                    )} */}
                                </div>
                                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                                    {motor.name}
                                </h1>
                                {motor.short_description && (
                                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {motor.short_description}
                                    </p>
                                )}
                            </div>

                            {/* Price block */}
                            <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-5 shadow-sm">
                                {hasDiscount ? (
                                    <div className="flex flex-col gap-1">
                                        {/* <span className="text-sm text-muted-foreground line-through">
                                            Eredeti ár: {formatHuf(motor.price)}
                                        </span> */}
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-3xl sm:text-4xl font-extrabold text-teal tracking-tight">
                                                {formatHuf(motor.discount_price)}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through">
                                                Eredeti ár: {formatHuf(motor.price)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-muted-foreground">Ár:</span>
                                        <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                                            {formatHuf(motor.price)}
                                        </span>
                                    </div>
                                )}
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Az ár tájékoztató jellegű, az ÁFA-t tartalmazza.
                                </p>
                            </div>

                            {/* Key Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    {
                                        icon: <Calendar className="h-4 w-4 text-teal" />,
                                        label: 'Évjárat',
                                        value: motor.year,
                                    },
                                    {
                                        icon: <Navigation className="h-4 w-4 text-teal" />,
                                        label: 'Futásteljesítmény',
                                        value: `${formattedMileage} km`,
                                    },
                                    powerText && {
                                        icon: <Gauge className="h-4 w-4 text-teal" />,
                                        label: 'Teljesítmény',
                                        value: powerText,
                                    },
                                    motor.cylinders_cm3 && {
                                        icon: <Bike className="h-4 w-4 text-teal" />,
                                        label: 'Lökettérfogat',
                                        value: `${motor.cylinders_cm3} cm³`,
                                    },
                                    motor.cylinders && {
                                        icon: <Info className="h-4 w-4 text-teal" />,
                                        label: 'Hengerek száma',
                                        value: `${motor.cylinders} db`,
                                    },
                                    categoryName && {
                                        icon: <CheckCircle2 className="h-4 w-4 text-teal" />,
                                        label: 'Kivitel',
                                        value: categoryName,
                                    },
                                ]
                                    .filter(Boolean)
                                    .map((spec: any, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs"
                                        >
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                {spec.icon}
                                                {spec.label}
                                            </div>
                                            <div className="text-sm font-bold text-foreground">
                                                {spec.value}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="tel:+36301234567"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal text-white font-semibold px-5 py-3 hover:bg-teal/90 transition-all shadow-md shadow-teal/20 text-sm"
                                >
                                    <Phone className="h-4 w-4" />
                                    Hívjon minket!
                                </a>
                                <a
                                    href="mailto:info@markamotor.hu"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground font-semibold px-5 py-3 hover:bg-muted transition-all text-sm"
                                >
                                    <Mail className="h-4 w-4" />
                                    Érdeklődöm e-mailben
                                </a>
                            </div>

                            {/* Trust badges */}
                            {/* <div className="grid grid-cols-2 gap-2.5">
                                {[
                                    { icon: <ShieldCheck className="h-4 w-4 text-teal" />, text: 'Átvizsgálva, garanciával' },
                                    { icon: <FileText className="h-4 w-4 text-teal" />, text: 'Teljes körű ügyintézés' },
                                    { icon: <Tag className="h-4 w-4 text-teal" />, text: 'Hitel és lízing lehetőség' },
                                    { icon: <CheckCircle2 className="h-4 w-4 text-teal" />, text: 'Eredetiségvizsgálat' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-xs font-medium text-foreground"
                                    >
                                        {item.icon}
                                        {item.text}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </div>

                    {/* ── Description section ── */}
                    {(motor.description || motor.short_description) && (
                        <section className="mt-14">
                            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-teal" />
                                    Leírás
                                </h2>
                                {/* {motor.short_description && (
                                    <p className="text-base font-medium text-foreground mb-3 leading-relaxed">
                                        {motor.short_description}
                                    </p>
                                )} */}
                                {motor.description && (
                                    <div
                                        className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: motor.description }}
                                    />
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── Full specs table ── */}
                    <section className="mt-8">
                        <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                                <Info className="h-5 w-5 text-teal" />
                                Műszaki adatok
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0 divide-y divide-border/50 sm:divide-y-0">
                                {[
                                    { label: 'Márka', value: brandName || '—' },
                                    { label: 'Kategória', value: categoryName || '—' },
                                    { label: 'Évjárat', value: motor.year || '—' },
                                    { label: 'Futásteljesítmény', value: motor.km ? `${formattedMileage} km` : '—' },
                                    { label: 'Teljesítmény', value: powerText || '—' },
                                    { label: 'Lökettérfogat', value: motor.cylinders_cm3 ? `${motor.cylinders_cm3} cm³` : '—' },
                                    { label: 'Hengerek száma', value: motor.cylinders ? `${motor.cylinders} db` : '—' },
                                    { label: 'Állapot', value: motor.condition || '—' },
                                    { label: 'Szükséges jogosítvány', value: motor.driver_license || '—' },
                                ].map((row, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center py-3 border-b border-border/40 last:border-0"
                                    >
                                        <span className="text-sm text-muted-foreground font-medium">
                                            {row.label}
                                        </span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Related motors ── */}
                    {relatedMotors.length > 0 && (
                        <section className="mt-14">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Bike className="h-5 w-5 text-teal" />
                                Hasonló motorok
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {relatedMotors.slice(0, 4).map((m) => {
                                    const img = m.main_image
                                        ? formatImageUrl(m.main_image)
                                        : '/img/moto-1.png';
                                    const mHasDiscount = Boolean(
                                        m.discount_price &&
                                        m.discount_price > 0 &&
                                        m.discount_price < m.price,
                                    );
                                    return (
                                        <Link
                                            key={m.id}
                                            href={`/motorok/${m.id}`}
                                            className="group block rounded-2xl border border-border/70 bg-card/80 overflow-hidden shadow-sm hover:border-teal/50 hover:shadow-xl hover:shadow-teal/5 transition-all duration-300"
                                        >
                                            <div className="relative h-44 overflow-hidden bg-muted/40">
                                                <img
                                                    src={img}
                                                    alt={m.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            '/img/moto-1.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {m.brand?.name} • {m.category?.name}
                                                </div>
                                                <h3 className="mt-1 text-sm font-bold text-foreground line-clamp-1 group-hover:text-teal transition-colors">
                                                    {m.name}
                                                </h3>
                                                <div className="mt-2 text-sm font-extrabold text-foreground">
                                                    {mHasDiscount
                                                        ? formatHuf(m.discount_price)
                                                        : formatHuf(m.price)}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="mt-6 text-center">
                                <Link
                                    href="/motorok"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Összes motor megtekintése
                                </Link>
                            </div>
                        </section>
                    )}
                </div>

                <Footer />
            </main>
        </>
    );
}
