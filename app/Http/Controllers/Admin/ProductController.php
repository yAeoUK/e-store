<?php

namespace App\Http\Controllers\Admin;

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
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->select(['id', 'category_id', 'name', 'price', 'stock', 'is_active'])
            ->with('category:id,name');

        if ($request->filled('search')) {
            $search = $request->string('search')->trim();
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

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
            'filters' => [
                'search' => $request->string('search')->value() ?: null,
                'category_id' => $request->integer('category_id') ?: null,
                'stock_status' => $request->string('stock_status')->value() ?: null,
            ],
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
        $categoryId = $data['category_id'] ?? null;
        $slug = Product::generateUniqueSlug(($data['slug'] ?? '') ?: $data['name']);
        unset($data['category_id'], $data['slug']);
        $data['stock'] = $data['stock'] ?? 0;

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

        if (array_key_exists('category_id', $data)) {
            $product->category_id = $data['category_id'];
            unset($data['category_id']);
        }

        if (array_key_exists('slug', $data)) {
            $source = $data['slug'] ?: ($data['name'] ?? $product->name);
            $product->slug = Product::generateUniqueSlug($source, $product->id);
            unset($data['slug']);
        }

        if (array_key_exists('stock', $data) && $data['stock'] === null) {
            $data['stock'] = 0;
        }

        $product->fill($data);
        $product->save();

        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->orderItems()->exists()) {
            return redirect()->route('admin.products.index')->withErrors([
                'product' => __('admin.products.has_orders'),
            ]);
        }

        $product->delete();

        return redirect()->route('admin.products.index');
    }
}
