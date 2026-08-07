<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\DefaultsNullableFieldsToZero;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductVariantRequest;
use App\Http\Requests\Admin\UpdateProductVariantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;

class ProductVariantController extends Controller
{
    use DefaultsNullableFieldsToZero;

    public function store(StoreProductVariantRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $this->defaultToZeroOnStore($data, 'stock');

        $product->variants()->create($data);

        return redirect()->route('admin.products.edit', $product);
    }

    public function update(UpdateProductVariantRequest $request, Product $product, ProductVariant $variant): RedirectResponse
    {
        $data = $request->validated();
        $this->defaultToZeroOnUpdate($data, 'stock');

        $variant->update($data);

        return redirect()->route('admin.products.edit', $product);
    }

    public function destroy(Product $product, ProductVariant $variant): RedirectResponse
    {
        $variant->delete();

        return redirect()->route('admin.products.edit', $product);
    }
}
