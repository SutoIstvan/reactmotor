<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Motor extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'price',
        'discount_price',
        'description',
        'short_description',
        'cylinders',
        'cylinders_cm3',
        'year',
        'km',
        'performance',
        'condition',
        'top',
        'driver_license',
        'main_image',
        'video',
        'images_id',
        'category_id',
        'brand_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'discount_price' => 'integer',
            'cylinders' => 'integer',
            'cylinders_cm3' => 'integer',
            'year' => 'integer',
            'km' => 'integer',
        ];
    }

    /**
     * Return a timestamp as DateTime object with safeguard against literal 'NULL' strings.
     *
     * @param  mixed  $value
     * @return \Illuminate\Support\Carbon|null
     */
    protected function asDateTime($value)
    {
        if ($value === 'NULL' || $value === 'null' || $value === '') {
            return null;
        }

        return parent::asDateTime($value);
    }

    /**
     * Brand relationship.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Category relationship.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Images relationship.
     */
    public function images(): HasMany
    {
        return $this->hasMany(Image::class)->orderBy('position');
    }

    /**
     * Scope a query to apply filters.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        // Search term (name, description, short_description)
        if (!empty($filters['search'])) {
            $search = '%' . trim($filters['search']) . '%';
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('short_description', 'like', $search)
                  ->orWhere('description', 'like', $search);
            });
        }

        // Brand filter
        if (!empty($filters['brand_id']) && $filters['brand_id'] !== 'all') {
            if (is_array($filters['brand_id'])) {
                $query->whereIn('brand_id', $filters['brand_id']);
            } else {
                $query->where('brand_id', $filters['brand_id']);
            }
        }

        // Category filter
        if (!empty($filters['category_id']) && $filters['category_id'] !== 'all') {
            if (is_array($filters['category_id'])) {
                $query->whereIn('category_id', $filters['category_id']);
            } else {
                $query->where('category_id', $filters['category_id']);
            }
        }

        // Condition filter
        if (!empty($filters['condition']) && $filters['condition'] !== 'all') {
            $query->where('condition', $filters['condition']);
        }

        // Top featured filter
        if (isset($filters['top']) && $filters['top'] !== '' && $filters['top'] !== 'all') {
            $query->where('top', (string)$filters['top']);
        }

        // Min / max price
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', (int)$filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', (int)$filters['max_price']);
        }

        // Min / max year
        if (!empty($filters['min_year'])) {
            $query->where('year', '>=', (int)$filters['min_year']);
        }
        if (!empty($filters['max_year'])) {
            $query->where('year', '<=', (int)$filters['max_year']);
        }

        // Min / max displacement (cylinders_cm3)
        if (!empty($filters['min_cc'])) {
            $query->where('cylinders_cm3', '>=', (int)$filters['min_cc']);
        }
        if (!empty($filters['max_cc'])) {
            $query->where('cylinders_cm3', '<=', (int)$filters['max_cc']);
        }

        // Status (all, active, archived/trashed)
        // Default to 'all' so existing imported items are visible
        $status = $filters['status'] ?? 'all';
        if ($status === 'active') {
            // only non-trashed
            $query->withoutTrashed();
        } elseif ($status === 'archived') {
            // only trashed
            $query->onlyTrashed();
        } else {
            // all
            $query->withTrashed();
        }

        return $query;
    }
}
