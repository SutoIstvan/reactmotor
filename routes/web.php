<?php

use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Models\PageContent;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'pageContents' => PageContent::allForPage('home'),
        'testimonials' => Testimonial::active()->orderBy('order', 'asc')->orderByDesc('id')->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Admin: Page content management
    Route::get('admin/pages/{page}', [PageContentController::class, 'index'])->name('admin.pages.edit');
    Route::put('admin/pages/{page}', [PageContentController::class, 'update'])->name('admin.pages.update');
    Route::post('admin/upload-image', [PageContentController::class, 'uploadImage'])->name('admin.upload-image');

    // Admin: Testimonials management
    Route::get('admin/testimonials', [TestimonialController::class, 'index'])->name('admin.testimonials.index');
    Route::post('admin/testimonials', [TestimonialController::class, 'store'])->name('admin.testimonials.store');
    Route::put('admin/testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('admin.testimonials.update');
    Route::delete('admin/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('admin.testimonials.destroy');
});

require __DIR__.'/settings.php';
