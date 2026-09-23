<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page',
        'section',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    /**
     * Scope to filter by page slug.
     */
    public function scopeForPage($query, string $page)
    {
        return $query->where('page', $page);
    }

    /**
     * Get content for a specific page and section.
     */
    public static function forSection(string $page, string $section): ?array
    {
        $record = static::where('page', $page)
            ->where('section', $section)
            ->first();

        return $record?->content;
    }

    /**
     * Get all sections for a page as an associative array keyed by section slug.
     */
    public static function allForPage(string $page): array
    {
        return static::forPage($page)
            ->get()
            ->pluck('content', 'section')
            ->toArray();
    }
}
