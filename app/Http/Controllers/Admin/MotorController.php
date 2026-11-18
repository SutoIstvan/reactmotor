<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Motor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MotorController extends Controller
{
    /**
     * Display a listing of motorcycles.
     */
    public function index(Request $request): Response
    {
        $rawFilters = array_filter($request->only([
            'search',
            'brand_id',
            'category_id',
            'condition',
            'top',
            'status',
            'sort',
        ]), fn($val) => !is_null($val) && $val !== '');

        $query = Motor::filter($rawFilters)->with(['brand', 'category']);

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'oldest' => $query->orderBy('id', 'asc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'year_desc' => $query->orderBy('year', 'desc')->orderBy('id', 'desc'),
            'year_asc' => $query->orderBy('year', 'asc'),
            'km_asc' => $query->orderBy('km', 'asc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('id', 'desc'),
        };

        $motors = $query->paginate(12)->withQueryString();

        $brands = Brand::orderBy('name')->get(['id', 'name']);
        $categories = Category::orderBy('name')->get(['id', 'name']);

        // Stats summary for admin dashboard cards
        $stats = [
            'total' => Motor::withTrashed()->count(),
            'active' => Motor::withoutTrashed()->count(),
            'archived' => Motor::onlyTrashed()->count(),
            'featured' => Motor::withTrashed()->where('top', '1')->count(),
        ];

        return Inertia::render('admin/motors/index', [
            'motors' => $motors,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => (object) $rawFilters,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created motorcycle.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateMotor($request);

        // Handle main image upload if present
        if ($request->hasFile('main_image_file')) {
            $path = $request->file('main_image_file')->store('motors', 'public');
            $validated['main_image'] = Storage::url($path);
        }

        $validated['top'] = $request->boolean('top') ? '1' : '0';
        $validated['cylinders'] = $validated['cylinders'] ?? 1;
        $validated['short_description'] = $validated['short_description'] ?? '';
        $validated['description'] = $validated['description'] ?? '';
        $validated['driver_license'] = $validated['driver_license'] ?? 'A';

        Motor::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'A motorkerékpár sikeresen hozzáadva.',
        ]);

        return back();
    }

    /**
     * Update the specified motorcycle.
     */
    public function update(Request $request, Motor $motor): RedirectResponse
    {
        $validated = $this->validateMotor($request, $motor->id);

        // Handle main image upload if present
        if ($request->hasFile('main_image_file')) {
            $path = $request->file('main_image_file')->store('motors', 'public');
            $validated['main_image'] = Storage::url($path);
        }

        $validated['top'] = $request->boolean('top') ? '1' : '0';
        $validated['cylinders'] = $validated['cylinders'] ?? 1;
        $validated['short_description'] = $validated['short_description'] ?? '';
        $validated['description'] = $validated['description'] ?? '';
        $validated['driver_license'] = $validated['driver_license'] ?? 'A';

        $motor->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'A motorkerékpár adatai sikeresen frissítve.',
        ]);

        return back();
    }

    /**
     * Remove or soft-delete the specified motorcycle.
     */
    public function destroy(Request $request, Motor $motor): RedirectResponse
    {
        if ($request->boolean('force')) {
            $motor->forceDelete();
            $message = 'A motorkerékpár véglegesen törölve lett.';
        } else {
            $motor->delete();
            $message = 'A motorkerékpár sikeresen archiválva / törölve lett.';
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $message,
        ]);

        return back();
    }

    /**
     * Restore a soft-deleted motorcycle.
     */
    public function restore(Motor $motor): RedirectResponse
    {
        $motor->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'A motorkerékpár sikeresen visszaállítva (aktívvá téve).',
        ]);

        return back();
    }

    /**
     * Validate motorcycle request attributes.
     */
    protected function validateMotor(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'brand_id' => ['required', 'exists:brands,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'year' => ['required', 'integer', 'min:1950', 'max:' . (date('Y') + 2)],
            'km' => ['required', 'integer', 'min:0'],
            'cylinders' => ['nullable', 'integer', 'min:1', 'max:12'],
            'cylinders_cm3' => ['required', 'integer', 'min:1'],
            'performance' => ['required', 'string', 'max:100'],
            'condition' => ['nullable', 'string', 'max:100'],
            'driver_license' => ['nullable', 'string', 'max:100'],
            'top' => ['nullable'],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'main_image' => ['nullable', 'string', 'max:500'],
            'main_image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'video' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
