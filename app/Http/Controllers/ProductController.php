<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->select(['id', 'category_id', 'name', 'slug', 'price', 'short_description'])
            ->with(['category:id,name', 'images:product_id,url,alt_text'])
            ->where('is_active', true);

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

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->float('max_price'));
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        $categories = Category::query()
            ->select(['id', 'name', 'slug'])
            ->with('children:id,parent_id,name,slug')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->string('search')->value() ?: null,
                'category_id' => $request->integer('category_id'),
                'min_price' => $request->float('min_price'),
                'max_price' => $request->float('max_price'),
            ],
            'categories' => $categories,
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load([
            'category:id,name',
            'images:product_id,url,alt_text',
            'variants:id,product_id,sku,options,price,stock,is_active',
        ]);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
