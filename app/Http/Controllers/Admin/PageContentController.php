<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    /**
     * Available pages and their sections configuration.
     */
    private const PAGE_SECTIONS = [
        'home' => [
            'hero' => [
                'label' => 'Hero szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'subtitle' => ['label' => 'Alcím / Leírás', 'type' => 'textarea'],
                    'button_primary' => ['label' => 'Elsődleges gomb', 'type' => 'text'],
                    'button_secondary' => ['label' => 'Másodlagos gomb', 'type' => 'text'],
                    'reviews_count' => ['label' => 'Vélemények száma szöveg (alapértelmezett: automatikus)', 'type' => 'text'],
                    'reviews_label' => ['label' => 'Vélemények kísérőszöveg (pl. elégedett motoros véleménye)', 'type' => 'text'],
                ],
            ],
            'filter' => [
                'label' => 'Járműkereső szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'subtitle' => ['label' => 'Alcím / Leírás', 'type' => 'textarea'],
                ],
            ],
            'recommended' => [
                'label' => 'Ajánlott motorok szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'subtitle' => ['label' => 'Alcím / Leírás', 'type' => 'textarea'],
                    'button_view_all' => ['label' => 'Összes megtekintése gomb', 'type' => 'text'],
                ],
            ],
            'about' => [
                'label' => 'Rólunk szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'description' => ['label' => 'Leírás', 'type' => 'textarea'],
                    'highlight_1_title' => ['label' => '1. Kiemelés — Cím', 'type' => 'text'],
                    'highlight_1_description' => ['label' => '1. Kiemelés — Leírás', 'type' => 'text'],
                    'highlight_2_title' => ['label' => '2. Kiemelés — Cím', 'type' => 'text'],
                    'highlight_2_description' => ['label' => '2. Kiemelés — Leírás', 'type' => 'text'],
                    'highlight_3_title' => ['label' => '3. Kiemelés — Cím', 'type' => 'text'],
                    'highlight_3_description' => ['label' => '3. Kiemelés — Leírás', 'type' => 'text'],
                    'button_primary' => ['label' => 'Elsődleges gomb', 'type' => 'text'],
                    'button_secondary' => ['label' => 'Másodlagos gomb', 'type' => 'text'],
                    'photo_1' => ['label' => '1. Kép — Felső kis kiemelő fotó (részletek)', 'type' => 'image'],
                    'photo_2' => ['label' => '2. Kép — Bal oldali fő fotó (bemutató)', 'type' => 'image'],
                    'photo_3' => ['label' => '3. Kép — Jobb oldali átfedő fotó (szerviz)', 'type' => 'image'],
                ],
            ],
            'features' => [
                'label' => 'Szolgáltatások szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'subtitle' => ['label' => 'Alcím / Leírás', 'type' => 'textarea'],
                    'feature_1_title' => ['label' => '1. Szolgáltatás — Cím', 'type' => 'text'],
                    'feature_1_description' => ['label' => '1. Szolgáltatás — Leírás', 'type' => 'textarea'],
                    'feature_2_title' => ['label' => '2. Szolgáltatás — Cím', 'type' => 'text'],
                    'feature_2_description' => ['label' => '2. Szolgáltatás — Leírás', 'type' => 'textarea'],
                    'feature_3_title' => ['label' => '3. Szolgáltatás — Cím', 'type' => 'text'],
                    'feature_3_description' => ['label' => '3. Szolgáltatás — Leírás', 'type' => 'textarea'],
                    'feature_4_title' => ['label' => '4. Szolgáltatás — Cím', 'type' => 'text'],
                    'feature_4_description' => ['label' => '4. Szolgáltatás — Leírás', 'type' => 'textarea'],
                ],
            ],
            'testimonials' => [
                'label' => 'Vélemények szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'subtitle' => ['label' => 'Alcím / Leírás', 'type' => 'textarea'],
                    'button_text' => ['label' => 'Gomb felirat (Vélemény írása)', 'type' => 'text'],
                    'button_url' => ['label' => 'Google Vélemények link (URL)', 'type' => 'text'],
                ],
            ],
            'cta' => [
                'label' => 'CTA (Call-to-Action) szekció',
                'fields' => [
                    'badge' => ['label' => 'Badge szöveg', 'type' => 'text'],
                    'title' => ['label' => 'Főcím', 'type' => 'text'],
                    'title_highlight' => ['label' => 'Főcím kiemelés (színes)', 'type' => 'text'],
                    'description' => ['label' => 'Leírás', 'type' => 'textarea'],
                    'button_primary' => ['label' => 'Elsődleges gomb', 'type' => 'text'],
                    'button_secondary' => ['label' => 'Másodlagos gomb', 'type' => 'text'],
                ],
            ],
        ],
    ];

    /**
     * Map page slugs to Hungarian labels.
     */
    private const PAGE_LABELS = [
        'home' => 'Főoldal',
    ];

    /**
     * Show the page content editor.
     */
    public function index(string $page): Response
    {
        abort_unless(array_key_exists($page, self::PAGE_SECTIONS), 404);

        $contents = PageContent::allForPage($page);
        $sections = self::PAGE_SECTIONS[$page];

        return Inertia::render('admin/page-content', [
            'page' => $page,
            'pageLabel' => self::PAGE_LABELS[$page] ?? ucfirst($page),
            'sections' => $sections,
            'contents' => $contents,
        ]);
    }

    /**
     * Update all sections for a given page.
     */
    public function update(Request $request, string $page): RedirectResponse
    {
        abort_unless(array_key_exists($page, self::PAGE_SECTIONS), 404);

        $sectionsConfig = self::PAGE_SECTIONS[$page];
        $data = $request->input('sections', []);

        foreach ($sectionsConfig as $sectionKey => $sectionConfig) {
            if (isset($data[$sectionKey])) {
                // Only save fields that are defined in the config
                $allowedFields = array_keys($sectionConfig['fields']);
                $content = array_intersect_key($data[$sectionKey], array_flip($allowedFields));

                PageContent::updateOrCreate(
                    ['page' => $page, 'section' => $sectionKey],
                    ['content' => $content]
                );
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tartalom sikeresen mentve.']);

        return back();
    }

    /**
     * Upload an image file and return its public URL.
     */
    public function uploadImage(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:10240'],
        ]);

        $path = $request->file('image')->store('page-content', 'public');
        $url = \Illuminate\Support\Facades\Storage::url($path);

        return response()->json([
            'url' => $url,
            'message' => 'A kép sikeresen feltöltve.',
        ]);
    }
}
