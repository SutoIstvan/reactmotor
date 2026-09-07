import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navbar/navbar';
import { HeroSection } from '@/components/hero/hero-section';
import { StatsSection } from '@/components/stats/stats-section';
import { FeatureSection } from '@/components/features/feature-section';
import { TestimonialsSection } from '@/components/testimonials/testimonials-section';
import { CTASection } from '@/components/cta/cta-section';
import { Footer } from '@/components/footer/footer';

export default function Welcome() {
    return (
        <>
            <Head title="DataFlow | Real-Time Data Infrastructure for Modern Teams">
                <meta
                    name="description"
                    content="Process 2.4M+ events per second with 99.99% uptime. DataFlow is the unified platform for building, deploying, and scaling real-time data pipelines."
                />
            </Head>
            <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
                <Navbar />
                <HeroSection />
                {/* <StatsSection /> */}
                <FeatureSection />
                <TestimonialsSection />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
