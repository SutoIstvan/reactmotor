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
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page', 50);       // e.g. 'home', 'about', 'contacts'
            $table->string('section', 50);     // e.g. 'hero', 'about', 'features', 'cta'
            $table->json('content');           // JSON structure with all editable texts
            $table->timestamps();

            $table->unique(['page', 'section']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
