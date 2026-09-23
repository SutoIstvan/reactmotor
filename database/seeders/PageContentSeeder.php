<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    /**
     * Seed the page_contents table with default texts from the current components.
     */
    public function run(): void
    {
        $sections = [
            // ─── Hero Section ───
            [
                'page' => 'home',
                'section' => 'hero',
                'content' => [
                    'badge' => 'Üdvözöljük honlapunkon!',
                    'title' => 'Találd meg a hozzád illő',
                    'title_highlight' => 'motort!',
                    'subtitle' => 'Vállalkozásunk használt nagy motorokkal, új robogókkal, teljes körű szerviz, műszaki és eredetiség vizsga, biztosítás, átírás lebonyolításával várja ügyfeleit!',
                    'button_primary' => 'Részletek',
                    'button_secondary' => 'Elérhetőségek',
                ],
            ],

            // ─── Filter Section ───
            [
                'page' => 'home',
                'section' => 'filter',
                'content' => [
                    'badge' => 'Járműkereső',
                    'title' => 'Találd meg a stílusodhoz',
                    'title_highlight' => 'illő motort',
                    'subtitle' => 'Válassz márkát, karosszéria dizájnt és motorteljesítményt az aktuális készletünkből',
                ],
            ],

            // ─── Recommended Motorcycles Section ───
            [
                'page' => 'home',
                'section' => 'recommended',
                'content' => [
                    'badge' => 'Ajánlott motorok',
                    'title' => 'Kiemelt ajánlataink és',
                    'title_highlight' => 'motorkerékpárjaink',
                    'subtitle' => 'Gondosan átvizsgált, prémium állapotú motorkerékpárok azonnal elvihető szaloni raktárkészletünkből, teljes körű garanciával.',
                    'button_view_all' => 'Összes motorkerékpár megtekintése',
                ],
            ],

            // ─── About Section ───
            [
                'page' => 'home',
                'section' => 'about',
                'content' => [
                    'badge' => 'Rólunk',
                    'title' => 'Szenvedélyünk a motorozás,',
                    'title_highlight' => 'garancia a szakértelem',
                    'description' => 'Több mint 15 éve nyújtunk megbízható megoldásokat motorkerékpárok és gépjárművek adásvételében, szervizelésében és teljes körű ügyintézésében. Nálunk a precizitás és az ügyfél-elégedettség az első: nincsenek rejtett hibák vagy kellemetlen meglepetések.',
                    'highlight_1_title' => 'Garantált minőség',
                    'highlight_1_description' => 'Minden jármű alapos műszaki átvizsgáláson esik át.',
                    'highlight_2_title' => 'Szakszerű szerviz',
                    'highlight_2_description' => 'Tapasztalt szerelők és modern diagnosztikai háttér.',
                    'highlight_3_title' => 'Teljes körű ügyintézés',
                    'highlight_3_description' => 'Hitel, biztosítás és átírás sorban állás nélkül.',
                    'button_primary' => 'Szolgáltatásaink',
                    'button_secondary' => 'Kapcsolatfelvétel',
                    'photo_1' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
                    'photo_2' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
                    'photo_3' => 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80',
                ],
            ],

            // ─── Features Section ───
            [
                'page' => 'home',
                'section' => 'features',
                'content' => [
                    'badge' => 'Szolgáltatások',
                    'title' => 'Teljes körű szolgáltatással',
                    'title_highlight' => 'várjuk ügyfeleinket!',
                    'subtitle' => 'A hitelügyintézéstől a szervizszolgáltatásig, mindent egy helyen intézhet.',
                    'feature_1_title' => 'Hitel és biztosítás',
                    'feature_1_description' => 'Teljes körű hitel- és biztosítási ügyintézés kedvező feltételekkel, gyors és rugalmas megoldások.',
                    'feature_2_title' => 'Átírás lebonyolítás',
                    'feature_2_description' => 'Teljes körű jármű átírás lebonyolítása, papírmunka nélkül, gyorsan és megbízhatóan.',
                    'feature_3_title' => 'Teljes körű szerviz szolgáltatás',
                    'feature_3_description' => 'Professzionális szervizszolgáltatás tapasztalt szerelőkkel és modern diagnosztikai berendezésekkel.',
                    'feature_4_title' => 'Műszaki és eredetiség vizsga',
                    'feature_4_description' => 'Hivatalos műszaki vizsga és eredetiségvizsgálat egy helyen, sorbanállás nélkül.',
                ],
            ],

            // ─── Testimonials Section ───
            [
                'page' => 'home',
                'section' => 'testimonials',
                'content' => [
                    'badge' => 'Vélemények',
                    'title' => 'Ügyfeleink',
                    'title_highlight' => 'mondták',
                    'subtitle' => 'Nézze meg, mit mondanak ügyfeleink a tapasztalataikról.',
                    'button_text' => 'Vélemény írása a Google-on',
                    'button_url' => 'https://www.google.com/maps/search/M%C3%A1rka+Motor',
                ],
            ],

            // ─── CTA Section ───
            [
                'page' => 'home',
                'section' => 'cta',
                'content' => [
                    'badge' => 'Kapcsolat',
                    'title' => 'Készen áll, hogy megtalálja az',
                    'title_highlight' => 'álommotorját',
                    'description' => 'Látogasson el szalonunkba és tekintse meg az aktuális kínálatunkat. Szakértő csapatunk segít az Ön igényeinek megfelelő motor kiválasztásában.',
                    'button_primary' => 'Kapcsolatfelvétel',
                    'button_secondary' => 'Elérhetőségek',
                ],
            ],
        ];

        foreach ($sections as $section) {
            PageContent::updateOrCreate(
                ['page' => $section['page'], 'section' => $section['section']],
                ['content' => $section['content']]
            );
        }
    }
}
