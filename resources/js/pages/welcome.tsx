import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navbar/navbar';
import { HeroSection } from '@/components/hero/hero-section';
import { MotorcycleFilterSection } from '@/components/filter/motorcycle-filter';
import { RecommendedMotorcyclesSection } from '@/components/motorcycles/recommended-motorcycles';
import { AboutSection } from '@/components/about/about-section';
import { FeatureSection } from '@/components/features/feature-section';
import { Testimonial, TestimonialsSection } from '@/components/testimonials/testimonials-section';
import { CTASection } from '@/components/cta/cta-section';
import { Footer } from '@/components/footer/footer';
import type { MotorData } from '@/components/catalog/catalog-motor-card';

interface WelcomeProps {
    pageContents?: Record<string, Record<string, string>>;
    testimonials?: Testimonial[];
    brands?: Array<{ id: number; name: string; motors_count?: number }>;
    categories?: Array<{ id: number; name: string; motors_count?: number }>;
    motors?: MotorData[];
}

export default function Welcome({
    pageContents,
    testimonials,
    brands,
    categories,
    motors,
}: WelcomeProps = {}) {
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
                <HeroSection content={pageContents?.hero} testimonials={testimonials} />
                <MotorcycleFilterSection
                    content={pageContents?.filter}
                    brands={brands}
                    categories={categories}
                    motors={motors}
                />
                <RecommendedMotorcyclesSection content={pageContents?.recommended} />
                <AboutSection content={pageContents?.about} />
                <FeatureSection content={pageContents?.features} />
                <TestimonialsSection content={pageContents?.testimonials} testimonials={testimonials} />
                <CTASection content={pageContents?.cta} />
                <Footer />
            </main>
        </>
    );
}
