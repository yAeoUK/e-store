<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductVariantRequest;
use App\Http\Requests\Admin\UpdateProductVariantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;

class ProductVariantController extends Controller
{
    public function store(StoreProductVariantRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $data['stock'] = $data['stock'] ?? 0;

        $product->variants()->create($data);

        return redirect()->route('admin.products.edit', $product);
    }

    public function update(UpdateProductVariantRequest $request, Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $data = $request->validated();

        if (array_key_exists('stock', $data) && $data['stock'] === null) {
            $data['stock'] = 0;
        }

        $variant->update($data);

        return redirect()->route('admin.products.edit', $product);
    }

    public function destroy(Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->delete();

        return redirect()->route('admin.products.edit', $product);
    }
}
