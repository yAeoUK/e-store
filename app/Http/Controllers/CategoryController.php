<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(Category $category, Request $request): Response
    {
        $products = $category->products()
            ->select(['id', 'category_id', 'name', 'slug', 'price', 'short_description'])
            ->with(['category:id,name', 'images:product_id,url,alt_text'])
            ->where('is_active', true)
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->trim();
                $query->where(function ($q) use ($search): void {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('min_price'), function ($query) use ($request): void {
                $query->where('price', '>=', $request->float('min_price'));
            })
            ->when($request->filled('max_price'), function ($query) use ($request): void {
                $query->where('price', '<=', $request->float('max_price'));
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::query()
            ->select(['id', 'name', 'slug'])
            ->with('children:id,parent_id,name,slug')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
            'filters' => [
                'search' => $request->string('search')->value() ?: null,
                'min_price' => $request->float('min_price'),
                'max_price' => $request->float('max_price'),
            ],
            'categories' => $categories,
        ]);
    }
}
