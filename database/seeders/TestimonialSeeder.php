<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Kovács Bence',
                'quote' => 'Nagyon korrekt, segítőkész csapat! Gyors átírás és hibátlan műszaki állapotú motor. Csak ajánlani tudom őket mindenkinek.',
                'image' => null,
                'rating' => 5,
                'date' => '2 hete',
                'order' => 1,
            ],
            [
                'name' => 'Tóth Gábor',
                'quote' => 'A szerviz gyors és precíz volt, rejtett költségek nélkül. Részletesen elmagyarázták, mit és miért cseréltek a motoron.',
                'image' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '1 hónapja',
                'order' => 2,
            ],
            [
                'name' => 'Németh Zoltán',
                'quote' => 'Itt vettem meg az első nagymotoromat. Minden kérdésemre készségesen válaszoltak, a hitelügyintézés is gördülékenyen lezajlott.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '3 hete',
                'order' => 3,
            ],
            [
                'name' => 'Szabó Balázs',
                'quote' => 'Kiváló állapotú Yamaha MT-07-et vásároltam náluk. Minden papírmunkát elintéztek helyettem, 2 napon belül elvihettem a motort.',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '1 hete',
                'order' => 4,
            ],
            [
                'name' => 'Varga Péter',
                'quote' => 'Műszaki vizsga és eredetiségvizsgálat egy helyen, sorban állás nélkül. Igazi profi szakemberek dolgoznak itt!',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '2 hónapja',
                'order' => 5,
            ],
            [
                'name' => 'Molnár Tamás',
                'quote' => 'Rendkívül megbízható kereskedés. Nem árulnak zsákbamacskát, a valóságban pontosan olyan volt a motor, mint a képeken.',
                'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '3 hete',
                'order' => 6,
            ],
            [
                'name' => 'Farkas Dávid',
                'quote' => 'Profi hozzáállás, korrekt árak és tiszta tájékoztatás. A következő motoromat is garantáltan náluk fogom megvásárolni.',
                'image' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '4 napja',
                'order' => 7,
            ],
            [
                'name' => 'Horváth Attila',
                'quote' => 'Az átírás és a biztosítás megkötése meglepően gyors volt. Külön köszönet a szervizes kollégáknak a felkészítésért!',
                'image' => 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '1 hónapja',
                'order' => 8,
            ],
            [
                'name' => 'Kiss László',
                'quote' => 'Barátságos, motorosbarát légkör. Robogót vásároltam városi közlekedésre, minden technikai részletet alaposan átbeszéltünk.',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '2 hete',
                'order' => 9,
            ],
            [
                'name' => 'Simon Gergely',
                'quote' => 'Hatalmas választék és prémium állapotú motorok. A próbaút során azonnal meggyőzött a gép műszaki állapota.',
                'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '1 hónapja',
                'order' => 10,
            ],
            [
                'name' => 'Balogh Zsolt',
                'quote' => 'Korrekt beszámítási ajánlatot kaptam a régi motoromra. Korrekt, becsületes hozzáállás, ritka manapság az ilyen szalon.',
                'image' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '5 napja',
                'order' => 11,
            ],
            [
                'name' => 'Takács Ferenc',
                'quote' => 'Gyors szervizidőpont, precíz átvizsgálás és gyári minőségű alkatrészek. Csak ajánlani tudom a szervizüket is!',
                'image' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
                'rating' => 5,
                'date' => '2 hete',
                'order' => 12,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
