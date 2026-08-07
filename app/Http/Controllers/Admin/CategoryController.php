<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\FillsSlugAndForeignKey;
use App\Http\Controllers\Concerns\FiltersIndexRequests;
use App\Http\Controllers\Concerns\GuardsRelatedDeletes;
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
    use FillsSlugAndForeignKey;
    use FiltersIndexRequests;
    use GuardsRelatedDeletes;

    public function index(Request $request): Response
    {
        $query = Category::query()
            ->select(['id', 'name', 'parent_id'])
            ->with('parent:id,name')
            ->withCount(['products', 'children']);

        $this->applySearchFilter($query, $request, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"));

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->integer('parent_id'));
        }

        $categories = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $this->requestFilters($request, [
                'search' => 'string',
                'parent_id' => 'integer',
            ]),
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
        [$parentId, $slug] = $this->extractSlugAndForeignKey($data, 'parent_id', Category::class);

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
        $this->applySlugAndForeignKey($category, $data, 'parent_id');

        $category->fill($data);
        $category->save();

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($response = $this->preventDeleteIfRelated($category, ['children', 'products'], 'admin.categories.index', 'category', 'admin.categories.has_children_or_products')) {
            return $response;
        }

        $category->delete();

        return redirect()->route('admin.categories.index');
    }
}
