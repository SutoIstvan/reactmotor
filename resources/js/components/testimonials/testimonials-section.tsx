'use client';

import * as React from 'react';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Testimonial = {
    quote: string;
    image: string;
    name: string;
    role: string;
    company?: string;
};

const testimonials: Testimonial[] = [
    {
        quote: 'Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.',
        image: 'https://github.com/shadcn.png',
        name: 'Shadcn',
        role: 'Founder',
        company: 'Shadcn UI',
    },
    {
        quote: 'Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.',
        image: 'https://github.com/rauchg.png',
        name: 'Guillermo Rauch',
        role: 'CEO',
        company: 'Vercel',
    },
    {
        quote: "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
        image: 'https://unavatar.io/x/elonmusk',
        name: 'Elon Musk',
        role: 'CEO',
        company: 'X.com',
    },
    {
        quote: "We just acquired Efferd for 3 gazillion dollars. We're calling it iEfferd. It's our best product yet.",
        image: 'https://unavatar.io/x/tim_cook',
        name: 'Tim Cook',
        role: 'CEO',
        company: 'Apple',
    },
    {
        quote: "I'm considering shipping Efferd components with Prime delivery. 2-day shipping on beautiful UIs? Done.",
        image: 'https://unavatar.io/x/JeffBezos',
        name: 'Jeff Bezos',
        role: 'Founder',
        company: 'Amazon',
    },
    {
        quote: "We're rewriting OpenAI's entire frontend in Efferd. The AGI told us it's the only logical choice.",
        image: 'https://unavatar.io/x/sama',
        name: 'Sam Altman',
        role: 'CEO',
        company: 'OpenAI',
    },
    {
        quote: "We processed 100 petabytes of data to find the perfect UI library. The algorithm returned 'Efferd' with 99.9% confidence.",
        image: 'https://unavatar.io/x/sundarpichai',
        name: 'Sundar Pichai',
        role: 'CEO',
        company: 'Google',
    },
    {
        quote: 'Our links might 404 sometimes, but thanks to Efferd, at least the 404 page looks absolutely stunning.',
        image: 'https://github.com/steven-tey.png',
        name: 'Steven Tey',
        role: 'Founder',
        company: 'Dub.co',
    },
    {
        quote: "It's so fast, I finished my UI sprint before my next meeting even started. Open source for the win.",
        image: 'https://unavatar.io/x/peer_rich',
        name: 'Peer Richelsen',
        role: 'Co-Founder',
        company: 'Cal.com',
    },
    {
        quote: 'Deploying this was smoother than my morning espresso. Our team velocity doubled overnight.',
        image: 'https://unavatar.io/x/leeerob',
        name: 'Lee Robinson',
        role: 'VP of Product',
        company: 'Vercel',
    },
    {
        quote: 'The attention to detail and interaction design is unreal. Truly setting the standard for modern web apps.',
        image: 'https://unavatar.io/x/satyanadella',
        name: 'Satya Nadella',
        role: 'CEO',
        company: 'Microsoft',
    },
    {
        quote: 'The more components you render, the faster it feels. Phenomenal performance and aesthetics.',
        image: 'https://unavatar.io/x/karpathy',
        name: 'Andrej Karpathy',
        role: 'AI Researcher',
        company: 'Eureka Labs',
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);
const fourthColumn = testimonials.slice(9, 12);

export function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section
            id="testimonials"
            className="relative overflow-hidden py-24 lg:py-32"
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
                        Testimonials
                    </span>
                    <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                        What our users <span className="text-teal">say</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        See what engineering teams and industry leaders have to
                        say about their experience.
                    </p>
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
    const { quote, image, name, role, company } = testimonial;
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
                <Avatar className="border-border/60 size-9 shrink-0 rounded-full border">
                    <AvatarImage
                        alt={`${name}'s profile picture`}
                        src={image}
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                    <cite className="text-foreground text-base leading-5 font-medium tracking-tight not-italic">
                        {name}
                    </cite>
                    <span className="text-muted-foreground text-sm leading-5 tracking-tight">
                        {role} {company && `, ${company}`}
                    </span>
                </div>
            </figcaption>
        </figure>
    );
}
