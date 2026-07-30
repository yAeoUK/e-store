<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductImageRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class ProductImageController extends Controller
{
    private const MAX_DIMENSION = 1600;

    private const JPEG_QUALITY = 80;

    public function store(StoreProductImageRequest $request, Product $product): RedirectResponse
    {
        $nextSortOrder = (int) $product->images()->max('sort_order') + 1;
        $hasExistingImages = $product->images()->exists();

        foreach ($request->file('images') as $index => $file) {
            $product->images()->create([
                'url' => $this->processAndStore($file, $product->id),
                'sort_order' => $nextSortOrder + $index,
                'is_primary' => ! $hasExistingImages && $index === 0,
            ]);
        }

        return redirect()->route('admin.products.edit', $product);
    }

    public function setPrimary(Product $product, ProductImage $image): RedirectResponse
    {
        abort_unless($image->product_id === $product->id, 404);

        $image->makePrimary();

        return redirect()->route('admin.products.edit', $product);
    }

    public function destroy(Product $product, ProductImage $image): RedirectResponse
    {
        abort_unless($image->product_id === $product->id, 404);

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $product->images()->orderBy('sort_order')->first()?->update(['is_primary' => true]);
        }

        return redirect()->route('admin.products.edit', $product);
    }

    /**
     * Resize (down-only) and re-encode the upload server-side, regardless of
     * what the client already compressed, and return its public URL.
     */
    private function processAndStore(UploadedFile $file, int $productId): string
    {
        $manager = new ImageManager(Driver::class);

        $encoded = $manager->decodeSplFileInfo($file)
            ->scaleDown(width: self::MAX_DIMENSION, height: self::MAX_DIMENSION)
            ->encode(new JpegEncoder(quality: self::JPEG_QUALITY));

        $path = 'products/'.$productId.'/'.Str::uuid().'.jpg';

        Storage::disk('public')->put($path, $encoded->toString());

        return Storage::disk('public')->url($path);
    }
}
