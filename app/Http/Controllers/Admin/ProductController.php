<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\DefaultsNullableFieldsToZero;
use App\Http\Controllers\Concerns\FillsSlugAndForeignKey;
use App\Http\Controllers\Concerns\FiltersIndexRequests;
use App\Http\Controllers\Concerns\GuardsRelatedDeletes;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use DefaultsNullableFieldsToZero;
    use FillsSlugAndForeignKey;
    use FiltersIndexRequests;
    use GuardsRelatedDeletes;

    public function index(Request $request): Response
    {
        $query = Product::query()
            ->select(['id', 'category_id', 'name', 'price', 'stock', 'is_active'])
            ->with('category:id,name');

        $this->applySearchFilter($query, $request, function ($q, $search): void {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('short_description', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('stock_status')) {
            match ($request->string('stock_status')->value()) {
                'low' => $query->lowStock(),
                'out' => $query->outOfStock(),
                default => null,
            };
        }

        $products = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filters' => $this->requestFilters($request, [
                'search' => 'string',
                'category_id' => 'integer',
                'stock_status' => 'string',
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        [$categoryId, $slug] = $this->extractSlugAndForeignKey($data, 'category_id', Product::class);
        $this->defaultToZeroOnStore($data, 'stock');

        $product = new Product($data);
        $product->category_id = $categoryId;
        $product->slug = $slug;
        $product->save();

        return redirect()->route('admin.products.edit', $product->id);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load([
                'category:id,name',
                'images:id,product_id,url,alt_text,is_primary',
                'variants:id,product_id,sku,options,price,stock,is_active',
            ]),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $this->applySlugAndForeignKey($product, $data, 'category_id');
        $this->defaultToZeroOnUpdate($data, 'stock');

        $product->fill($data);
        $product->save();

        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($response = $this->preventDeleteIfRelated($product, ['orderItems'], 'admin.products.index', 'product', 'admin.products.has_orders')) {
            return $response;
        }

        $product->delete();

        return redirect()->route('admin.products.index');
    }
}
