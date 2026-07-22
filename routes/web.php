<?php

use App\Http\Controllers\Account\AddressController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
        Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
        Route::patch('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
        Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
        Route::post('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('addresses.setDefault');

        Route::get('/orders', fn () => Inertia::render('Account/Orders'))->name('orders');
    });
});

require __DIR__.'/auth.php';