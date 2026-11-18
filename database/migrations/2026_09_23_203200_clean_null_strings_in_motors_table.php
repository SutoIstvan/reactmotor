<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('motors')->where('deleted_at', 'NULL')->update(['deleted_at' => null]);
        DB::table('motors')->where('discount_price', 'NULL')->update(['discount_price' => null]);
        DB::table('motors')->where('video', 'NULL')->update(['video' => null]);
        DB::table('motors')->where('driver_license', 'NULL')->update(['driver_license' => 'A']);
        DB::table('motors')->where('images_id', 'NULL')->update(['images_id' => null]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed for data cleanup
    }
};
