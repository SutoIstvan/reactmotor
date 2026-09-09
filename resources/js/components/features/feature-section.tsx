'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, LineChart, Layers, Globe, Lock } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Hitel és biztosítás',
        description:
            'Process millions of events per second with sub-millisecond latency. Built for scale from day one.',
        color: 'teal',
        stat: '< 10ms',
        statLabel: 'avg latency',
    },
    {
        icon: Shield,
        title: 'Átírás lebonyolítás',
        description:
            'SOC 2 Type II certified with end-to-end encryption. Your data stays protected at every layer.',
        color: 'teal',
        stat: 'SOC 2',
        statLabel: 'certified',
    },
    {
        icon: LineChart,
        title: 'Teljes körű szerviz szolgáltatás',
        description:
            'ML-powered insights automatically surface patterns and anomalies in your data streams.',
        color: 'teal',
        stat: '40%',
        statLabel: 'faster insights',
    },
    {
        icon: Layers,
        title: 'Műszaki és eredetiség vizsga',
        description:
            'Connect to 200+ data sources with pre-built connectors. No complex ETL required.',
        color: 'teal',
        stat: '200+',
        statLabel: 'integrations',
    },
];

const colorClasses = {
    teal: {
        bg: 'bg-teal/10',
        text: 'text-teal',
        border: 'border-teal/20',
        hoverBorder: 'hover:border-teal/30',
        glow: 'shadow-teal/5',
    },
    coral: {
        bg: 'bg-coral/10',
        text: 'text-coral',
        border: 'border-coral/20',
        hoverBorder: 'hover:border-coral/30',
        glow: 'shadow-coral/5',
    },
    gold: {
        bg: 'bg-gold/10',
        text: 'text-gold',
        border: 'border-gold/20',
        hoverBorder: 'hover:border-gold/30',
        glow: 'shadow-gold/5',
    },
};

function FeatureCard({
    feature,
    index,
}: {
    feature: (typeof features)[0];
    index: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const colors = colorClasses[feature.color as keyof typeof colorClasses];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group bg-card border-border relative rounded-2xl border p-6 ${colors.hoverBorder} transition-all duration-300 hover:shadow-xl ${colors.glow}`}
        >
            {/* Icon */}
            <div
                className={`h-12 w-12 rounded-xl ${colors.bg} ${colors.text} mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
            >
                <feature.icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="text-foreground mb-2 text-xl font-semibold">
                {feature.title}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
            </p>

            {/* Stat */}
            <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${colors.bg} ${colors.border} border`}
            >
                <span className={`text-sm font-bold ${colors.text}`}>
                    {feature.stat}
                </span>
                <span className="text-muted-foreground text-xs">
                    {feature.statLabel}
                </span>
            </div>

            {/* Hover glow effect */}
            <div
                className={`absolute inset-0 rounded-2xl ${colors.bg} -z-10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50`}
            />
        </motion.div>
    );
}

export function FeatureSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section
            id="features"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Angled divider top */}
            <div className="bg-background absolute top-0 right-0 left-0 h-24 origin-top-left -translate-y-12 -skew-y-2 transform" />

            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                {/* Section header */}
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
                        Features
                    </span>
                    <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                        Teljes körű szolgáltatással{' '}
                        <span className="text-teal">várjuk ügyfeleinket!</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        From real-time processing to enterprise security, we
                        have got you covered with a complete data infrastructure
                        platform.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Angled divider bottom */}
            <div className="bg-background absolute right-0 bottom-0 left-0 h-24 origin-bottom-right translate-y-12 skew-y-2 transform" />
        </section>
    );
}
