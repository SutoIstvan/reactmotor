<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Motor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display the public motorcycle catalog with filter and sorting capabilities.
     */
    /**
     * Display a single motorcycle detail page.
     */
    public function show(int $id): Response
    {
        $motor = Motor::withoutTrashed()
            ->with(['brand', 'category', 'images'])
            ->findOrFail($id);

        // Related motors: same brand or category, excluding current
        $related = Motor::withoutTrashed()
            ->with(['brand', 'category', 'images'])
            ->where('id', '!=', $id)
            ->where(function ($q) use ($motor) {
                $q->where('brand_id', $motor->brand_id)
                  ->orWhere('category_id', $motor->category_id);
            })
            ->orderByDesc('top')
            ->orderByDesc('id')
            ->limit(4)
            ->get();

        return Inertia::render('motorok/show', [
            'motor'         => $motor,
            'relatedMotors' => $related,
        ]);
    }

    /**
     * Display the public motorcycle catalog with filter and sorting capabilities.
     */
    public function index(Request $request): Response
    {
        $rawFilters = array_filter($request->only([
            'search',
            'brand_id',
            'category_id',
            'a2',
            'min_price',
            'max_price',
            'min_year',
            'max_year',
            'min_cc',
            'max_cc',
            'sort',
            'per_page',
            'view',
        ]), function ($val, $key) {
            if (is_null($val) || $val === '') {
                return false;
            }
            if ($val === 'all' && in_array($key, ['brand_id', 'category_id'], true)) {
                return false;
            }
            return true;
        }, ARRAY_FILTER_USE_BOTH);

        $filterData = array_merge($rawFilters, ['status' => 'active']);
        unset($filterData['sort'], $filterData['per_page'], $filterData['view']);

        $query = Motor::withoutTrashed()
            ->with(['brand', 'category', 'images'])
            ->filter($filterData);

        // Sorting
        $sort = $request->input('sort', 'featured');
        match ($sort) {
            'latest' => $query->orderBy('id', 'desc'),
            'oldest' => $query->orderBy('id', 'asc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'year_desc' => $query->orderBy('year', 'desc')->orderBy('id', 'desc'),
            'year_asc' => $query->orderBy('year', 'asc'),
            'km_asc' => $query->orderBy('km', 'asc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('top', 'desc')->orderBy('id', 'desc'),
        };

        // Per page: 24, 48, or 'all' (all available motors)
        $perPageInput = $request->input('per_page', '24');
        if ($perPageInput === 'all') {
            $perPage = 1000;
        } else {
            $perPage = in_array((int) $perPageInput, [12, 24, 48], true) ? (int) $perPageInput : 24;
        }

        // View mode: 'grid' or 'list'
        $viewInput = $request->input('view', 'grid');
        $view = in_array($viewInput, ['grid', 'list'], true) ? $viewInput : 'grid';

        $motors = $query->paginate($perPage)->withQueryString();

        // Active brands with count of available bikes
        $brands = Brand::whereHas('motors', fn($q) => $q->withoutTrashed())
            ->withCount(['motors' => fn($q) => $q->withoutTrashed()])
            ->orderBy('name')
            ->get(['id', 'name']);

        // Active categories with count of available bikes
        $categories = Category::whereHas('motors', fn($q) => $q->withoutTrashed())
            ->withCount(['motors' => fn($q) => $q->withoutTrashed()])
            ->orderBy('name')
            ->get(['id', 'name']);

        // Dynamic price, year, and displacement (cc) ranges
        $minPrice = (int) (Motor::withoutTrashed()->min('price') ?? 500000);
        $maxPrice = (int) (Motor::withoutTrashed()->max('price') ?? 6000000);

        $minYear = (int) (Motor::withoutTrashed()->min('year') ?? 2000);
        $maxYear = (int) (Motor::withoutTrashed()->max('year') ?? (int) date('Y'));

        $minCc = (int) (Motor::withoutTrashed()->where('cylinders_cm3', '>', 0)->min('cylinders_cm3') ?? 50);
        $maxCc = (int) (Motor::withoutTrashed()->max('cylinders_cm3') ?? 1500);

        $returnedFilters = array_merge($rawFilters, [
            'sort' => $sort,
            'per_page' => $perPageInput,
            'view' => $view,
        ]);

        return Inertia::render('motorok', [
            'motors' => $motors,
            'brands' => $brands,
            'categories' => $categories,
            'priceRange' => [
                'min' => $minPrice,
                'max' => $maxPrice,
            ],
            'yearRange' => [
                'min' => $minYear,
                'max' => $maxYear,
            ],
            'ccRange' => [
                'min' => $minCc,
                'max' => $maxCc,
            ],
            'filters' => (object) $returnedFilters,
        ]);
    }
}
