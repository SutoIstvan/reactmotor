import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer/footer';

export default function Hasznos() {
    return (
        <>
            <Head title="Hasznos információk | Márka Motor">
                <meta
                    name="description"
                    content="Hasznos tudnivalók, tippek és tanácsok motorosoknak - Márka Motor."
                />
            </Head>
            <main className="bg-background text-foreground relative flex min-h-screen flex-col justify-between overflow-x-hidden">
                <Navbar />
                <div className="container mx-auto flex-1 px-6 pt-28 pb-16 lg:px-12 lg:pt-36 lg:pb-24">
                    {/* Glow effect */}
                    <div className="bg-teal/5 pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

                    <div className="max-w-3xl">
                        <span className="bg-muted text-muted-foreground mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                            Tudástár & Tippek
                        </span>
                        <h1 className="text-foreground text-3xl font-bold tracking-tight text-pretty sm:text-4xl lg:text-5xl">
                            Hasznos információk
                        </h1>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed lg:text-lg">
                            Hasznos cikkek, szerviz tippek, átírási és biztosítási tudnivalók. Ez az oldal hamarosan bővül hasznos tartalmakkal!
                        </p>
                    </div>
                </div>
                <Footer />
            </main>
        </>
    );
}
