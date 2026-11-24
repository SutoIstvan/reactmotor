<?php

use App\Http\Controllers\Admin\MotorController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\CatalogController;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Motor;
use App\Models\PageContent;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $brands = Brand::whereHas('motors', fn($q) => $q->withoutTrashed())
        ->withCount(['motors' => fn($q) => $q->withoutTrashed()])
        ->orderBy('name')
        ->get(['id', 'name']);

    $categories = Category::whereHas('motors', fn($q) => $q->withoutTrashed())
        ->withCount(['motors' => fn($q) => $q->withoutTrashed()])
        ->orderBy('name')
        ->get(['id', 'name']);

    $motors = Motor::withoutTrashed()
        ->with(['brand:id,name', 'category:id,name', 'images'])
        ->orderByDesc('top')
        ->orderByDesc('id')
        ->get();

    return Inertia::render('welcome', [
        'pageContents' => PageContent::allForPage('home'),
        'testimonials' => Testimonial::active()->orderBy('order', 'asc')->orderByDesc('id')->get(),
        'brands' => $brands,
        'categories' => $categories,
        'motors' => $motors,
    ]);
})->name('home');

Route::get('/motorok', [CatalogController::class, 'index'])->name('motorok');
Route::get('/motorok/{id}', [CatalogController::class, 'show'])->name('motorok.show')->where('id', '[0-9]+');

Route::get('/bemutatkozas', function () {
    return Inertia::render('bemutatkozas', [
        'pageContents' => PageContent::allForPage('home'),
    ]);
})->name('bemutatkozas');

Route::get('/rolunk', function () {
    return redirect()->route('bemutatkozas');
});

Route::get('/about', function () {
    return redirect()->route('bemutatkozas');
});

Route::get('/hasznos', function () {
    return Inertia::render('hasznos');
})->name('hasznos');

Route::get('/felvasarlas', function () {
    return Inertia::render('felvasarlas');
})->name('felvasarlas');

Route::get('/elerhetosegek', function () {
    return Inertia::render('elerhetosegek');
})->name('elerhetosegek');

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

    // Admin: Motorcycles management
    Route::get('admin/motors', [MotorController::class, 'index'])->name('admin.motors.index');
    Route::post('admin/motors', [MotorController::class, 'store'])->name('admin.motors.store');
    Route::put('admin/motors/{motor}', [MotorController::class, 'update'])->name('admin.motors.update')->withTrashed();
    Route::delete('admin/motors/{motor}', [MotorController::class, 'destroy'])->name('admin.motors.destroy')->withTrashed();
    Route::post('admin/motors/{motor}/restore', [MotorController::class, 'restore'])->name('admin.motors.restore')->withTrashed();
});

require __DIR__.'/settings.php';
