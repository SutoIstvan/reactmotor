<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the testimonials.
     */
    public function index(): Response
    {
        $testimonials = Testimonial::orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Store a newly created testimonial in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string', 'max:2000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'date' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $validated['order'] ?? 0;

        Testimonial::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Vélemény sikeresen hozzáadva.',
        ]);

        return back();
    }

    /**
     * Update the specified testimonial in storage.
     */
    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string', 'max:2000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'date' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $validated['order'] ?? 0;

        $testimonial->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Vélemény sikeresen frissítve.',
        ]);

        return back();
    }

    /**
     * Remove the specified testimonial from storage.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Vélemény sikeresen törölve.',
        ]);

        return back();
    }
}
