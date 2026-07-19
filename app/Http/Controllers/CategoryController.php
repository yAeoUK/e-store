<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with('children')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Categories/Show', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category, Request $request): Response
    {
        $category->load(['children', 'products']);

        $products = $category->products()
            ->with(['category', 'images', 'variants'])
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
            ->with('children')
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

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $category = new Category;
        $category->fill($request->validated());

        if ($request->filled('parent_id')) {
            $category->parent_id = $request->integer('parent_id');
        }

        $category->save();

        return redirect()->route('categories.show', $category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->fill($request->validated());

        if ($request->has('parent_id')) {
            $category->parent_id = $request->integer('parent_id');
        }

        $category->save();

        return redirect()->route('categories.show', $category);
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('categories.index');
    }
}
