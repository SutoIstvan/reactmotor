'use client';

import * as React from 'react';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
            />
        </svg>
    );
}

export type Testimonial = {
    id?: number;
    quote: string;
    image?: string | null;
    name: string;
    rating: number;
    date: string;
};

const defaultTestimonials: Testimonial[] = [
    {
        quote: 'Nagyon korrekt, segítőkész csapat! Gyors átírás és hibátlan műszaki állapotú motor. Csak ajánlani tudom őket mindenkinek.',
        image: '',
        name: 'Kovács Bence',
        rating: 5,
        date: '2 hete',
    },
    {
        quote: 'A szerviz gyors és precíz volt, rejtett költségek nélkül. Részletesen elmagyarázták, mit és miért cseréltek a motoron.',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        name: 'Tóth Gábor',
        rating: 5,
        date: '1 hónapja',
    },
    {
        quote: 'Itt vettem meg az első nagymotoromat. Minden kérdésemre készségesen válaszoltak, a hitelügyintézés is gördülékenyen lezajlott.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        name: 'Németh Zoltán',
        rating: 5,
        date: '3 hete',
    },
    {
        quote: 'Kiváló állapotú Yamaha MT-07-et vásároltam náluk. Minden papírmunkát elintéztek helyettem, 2 napon belül elvihettem a motort.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        name: 'Szabó Balázs',
        rating: 5,
        date: '1 hete',
    },
    {
        quote: 'Műszaki vizsga és eredetiségvizsgálat egy helyen, sorban állás nélkül. Igazi profi szakemberek dolgoznak itt!',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        name: 'Varga Péter',
        rating: 5,
        date: '2 hónapja',
    },
    {
        quote: 'Rendkívül megbízható kereskedés. Nem árulnak zsákbamacskát, a valóságban pontosan olyan volt a motor, mint a képeken.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
        name: 'Molnár Tamás',
        rating: 5,
        date: '3 hete',
    },
    {
        quote: 'Profi hozzáállás, korrekt árak és tiszta tájékoztatás. A következő motoromat is garantáltan náluk fogom megvásárolni.',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        name: 'Farkas Dávid',
        rating: 5,
        date: '4 napja',
    },
    {
        quote: 'Az átírás és a biztosítás megkötése meglepően gyors volt. Külön köszönet a szervizes kollégáknak a felkészítésért!',
        image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80',
        name: 'Horváth Attila',
        rating: 5,
        date: '1 hónapja',
    },
    {
        quote: 'Barátságos, motorosbarát légkör. Robogót vásároltam városi közlekedésre, minden technikai részletet alaposan átbeszéltünk.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
        name: 'Kiss László',
        rating: 5,
        date: '2 hete',
    },
    {
        quote: 'Hatalmas választék és prémium állapotú motorok. A próbaút során azonnal meggyőzött a gép műszaki állapota.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        name: 'Simon Gergely',
        rating: 5,
        date: '1 hónapja',
    },
    {
        quote: 'Korrekt beszámítási ajánlatot kaptam a régi motoromra. Korrekt, becsületes hozzáállás, ritka manapság az ilyen szalon.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        name: 'Balogh Zsolt',
        rating: 5,
        date: '5 napja',
    },
    {
        quote: 'Gyors szervizidőpont, precíz átvizsgálás és gyári minőségű alkatrészek. Csak ajánlani tudom a szervizüket is!',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        name: 'Takács Ferenc',
        rating: 5,
        date: '2 hete',
    },
];

interface TestimonialsSectionProps {
    content?: Record<string, string>;
    testimonials?: Testimonial[];
}

export function TestimonialsSection({
    content,
    testimonials: dbTestimonials,
}: TestimonialsSectionProps = {}) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    const activeList =
        dbTestimonials && dbTestimonials.length > 0
            ? dbTestimonials
            : defaultTestimonials;

    // Ensure sufficient items for smooth infinite sliding
    const displayList =
        activeList.length < 8 ? [...activeList, ...activeList] : activeList;

    const firstColumn = displayList.filter((_, i) => i % 4 === 0);
    const secondColumn = displayList.filter((_, i) => i % 4 === 1);
    const thirdColumn = displayList.filter((_, i) => i % 4 === 2);
    const fourthColumn = displayList.filter((_, i) => i % 4 === 3);

    return (
        <section
            id="testimonials"
            className="relative overflow-hidden pb-10 lg:pb-10 mt-10"
        >
            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                {/* Section header styled identically to Features block */}
                <motion.div
                    ref={sectionRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                    }
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="bg-muted text-muted-foreground mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                        {content?.badge ?? 'Vélemények'}
                    </span>
                    <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                        {content?.title ?? 'Ügyfeleink'}{' '}
                        <span className="text-teal">
                            {content?.title_highlight ?? 'mondták'}
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {content?.subtitle ??
                            'Nézze meg, mit mondanak ügyfeleink a tapasztalataikról.'}
                    </p>

                    {/* Google Reviews Button & Rating */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="bg-card border-border hover:bg-muted text-foreground hover:border-teal/30 group shadow-foreground/5 cursor-pointer px-6 border shadow-md transition-all hover:shadow-lg"
                        >
                            <a
                                href={content?.button_url ?? 'https://www.google.com/maps/search/M%C3%A1rka+Motor'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GoogleIcon className="mr-2.5 h-4 w-4 shrink-0" />
                                <span>{content?.button_text ?? 'Vélemény írása a Google-on'}</span>
                                <ExternalLink className="ml-2 h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </Button>

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3.5 py-2 rounded-full border border-border/50">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                ))}
                            </div>
                            <span className="font-semibold text-foreground text-xs">5.0</span>
                            <span className="text-xs text-muted-foreground">• Google Vélemények</span>
                        </div>
                    </div>
                </motion.div>

                {/* Full-width Testimonials Grid matching Features block layout */}
                <div
                    className={cn(
                        'grid h-[600px] w-full grid-cols-1 gap-6 overflow-hidden md:grid-cols-2 lg:h-[680px] lg:grid-cols-4',
                        'mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]',
                        '[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]',
                        '[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]',
                    )}
                >
                    <InfiniteSlider
                        className="w-full"
                        direction="vertical"
                        speed={30}
                        speedOnHover={15}
                    >
                        {firstColumn.map((testimonial) => (
                            <TestimonialsCard
                                key={testimonial.name}
                                testimonial={testimonial}
                            />
                        ))}
                    </InfiniteSlider>
                    <InfiniteSlider
                        className="hidden w-full md:block"
                        direction="vertical"
                        speed={48}
                        speedOnHover={24}
                    >
                        {secondColumn.map((testimonial) => (
                            <TestimonialsCard
                                key={testimonial.name}
                                testimonial={testimonial}
                            />
                        ))}
                    </InfiniteSlider>
                    <InfiniteSlider
                        className="hidden w-full lg:block"
                        direction="vertical"
                        speed={36}
                        speedOnHover={18}
                    >
                        {thirdColumn.map((testimonial) => (
                            <TestimonialsCard
                                key={testimonial.name}
                                testimonial={testimonial}
                            />
                        ))}
                    </InfiniteSlider>
                    <InfiniteSlider
                        className="hidden w-full lg:block"
                        direction="vertical"
                        speed={42}
                        speedOnHover={21}
                    >
                        {fourthColumn.map((testimonial) => (
                            <TestimonialsCard
                                key={testimonial.name}
                                testimonial={testimonial}
                            />
                        ))}
                    </InfiniteSlider>
                </div>
            </div>
        </section>
    );
}

function TestimonialsCard({
    testimonial,
    className,
    ...props
}: React.ComponentProps<'figure'> & {
    testimonial: Testimonial;
}) {
    const { quote, image, name, rating = 5, date } = testimonial;
    return (
        <figure
            className={cn(
                'group border-border bg-card hover:border-teal/30 dark:bg-card/40 relative w-full rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:shadow-xl',
                className,
            )}
            {...props}
        >
            <blockquote className="text-foreground/90 text-base leading-relaxed font-normal">
                "{quote}"
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
                <Avatar className="border-border/60 size-10 shrink-0 rounded-full border">
                    {image && (
                        <AvatarImage
                            alt={`${name}'s profile picture`}
                            src={image}
                        />
                    )}
                    <AvatarFallback className="bg-teal/10 text-teal font-semibold text-xs">
                        {name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                        <cite className="text-foreground text-sm font-semibold tracking-tight not-italic">
                            {name}
                        </cite>
                        <GoogleIcon className="h-3.5 w-3.5 shrink-0 opacity-85" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex text-amber-400">
                            {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                        </div>
                        {date && (
                            <span className="text-muted-foreground text-[11px] leading-none">
                                • {date}
                            </span>
                        )}
                    </div>
                </div>
            </figcaption>
        </figure>
    );
}
