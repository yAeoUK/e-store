<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Category::query()
            ->select(['id', 'name', 'parent_id'])
            ->with('parent:id,name')
            ->withCount(['products', 'children']);

        if ($request->filled('search')) {
            $search = $request->string('search')->trim();
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->integer('parent_id'));
        }

        $categories = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->string('search')->value() ?: null,
                'parent_id' => $request->integer('parent_id') ?: null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $parentId = $data['parent_id'] ?? null;
        $slug = Category::generateUniqueSlug(($data['slug'] ?? '') ?: $data['name']);
        unset($data['parent_id'], $data['slug']);

        $category = new Category($data);
        $category->parent_id = $parentId;
        $category->slug = $slug;
        $category->save();

        return redirect()->route('admin.categories.index');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'categories' => Category::where('id', '!=', $category->id)->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();

        if (array_key_exists('parent_id', $data)) {
            $category->parent_id = $data['parent_id'];
            unset($data['parent_id']);
        }

        if (array_key_exists('slug', $data)) {
            $source = $data['slug'] ?: ($data['name'] ?? $category->name);
            $category->slug = Category::generateUniqueSlug($source, $category->id);
            unset($data['slug']);
        }

        $category->fill($data);
        $category->save();

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->children()->exists() || $category->products()->exists()) {
            return redirect()->route('admin.categories.index')->withErrors([
                'category' => __('admin.categories.has_children_or_products'),
            ]);
        }

        $category->delete();

        return redirect()->route('admin.categories.index');
    }
}
