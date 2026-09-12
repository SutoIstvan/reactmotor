import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navbar/navbar';
import { HeroSection } from '@/components/hero/hero-section';
import { MotorcycleFilterSection } from '@/components/filter/motorcycle-filter';
import { RecommendedMotorcyclesSection } from '@/components/motorcycles/recommended-motorcycles';
import { AboutSection } from '@/components/about/about-section';
import { FeatureSection } from '@/components/features/feature-section';
import { TestimonialsSection } from '@/components/testimonials/testimonials-section';
import { CTASection } from '@/components/cta/cta-section';
import { Footer } from '@/components/footer/footer';

export default function Welcome() {
    return (
        <>
            <Head title="Márka Motor | Motorkerékpár kereskedés és szerviz">
                <meta
                    name="description"
                    content="Minőségi motorkerékpárok és autók, hitel- és biztosítási ügyintézés, szerviz és eredetiségvizsgálat egy helyen."
                />
            </Head>
            <main className="bg-background text-foreground relative min-h-screen overflow-x-hidden">
                <Navbar />
                <HeroSection />
                <MotorcycleFilterSection />
                <RecommendedMotorcyclesSection />
                <AboutSection />
                <FeatureSection />
                <TestimonialsSection />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
