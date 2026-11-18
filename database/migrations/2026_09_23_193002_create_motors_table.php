<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('motors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 0);
            $table->decimal('discount_price', 10, 0)->nullable();
            $table->text('description');
            $table->text('short_description');
            $table->integer('cylinders');
            $table->integer('cylinders_cm3');
            $table->year('year');
            $table->integer('km');
            $table->string('performance');
            $table->string('condition')->nullable();
            $table->string('top')->default(false);
            $table->string('driver_license');
            $table->string('main_image')->nullable();
            $table->string('video')->nullable();
            $table->string('images_id')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->foreignId('brand_id')->constrained('brands')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motors');
    }
};
