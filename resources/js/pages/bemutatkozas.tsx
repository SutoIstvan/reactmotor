import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navbar/navbar';
import { AboutSection } from '@/components/about/about-section';
import { Footer } from '@/components/footer/footer';

interface BemutatkozasProps {
    pageContents?: Record<string, Record<string, string>>;
}

export default function Bemutatkozas({ pageContents }: BemutatkozasProps = {}) {
    return (
        <>
            <Head title="Bemutatkozás | Márka Motor">
                <meta
                    name="description"
                    content="Ismerje meg a Márka Motort! Több mint 15 éve nyújtunk megbízható megoldásokat motorkerékpárok és gépjárművek adásvételében, szervizelésében és teljes körű ügyintézésében."
                />
            </Head>
            <main className="bg-background text-foreground relative flex min-h-screen flex-col justify-between overflow-x-hidden">
                <Navbar />
                <div className="flex-1 pt-24 pb-12 lg:pt-32 lg:pb-20">
                    <AboutSection content={pageContents?.about} className="mt-0" />
                </div>
                <Footer />
            </main>
        </>
    );
}
