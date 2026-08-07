<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total',
        'payment_method',
        'payment_status',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'paid_at',
        'admin_note',
        'customer_note',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'total' => 'decimal:2',
        'shipping_address_snapshot' => 'array',
        'payment_method' => PaymentMethod::class,
        'payment_status' => PaymentStatus::class,
        'paid_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return $this
     */
    public function loadCartItemsForDisplay(): static
    {
        return $this->load([
            'orderItems.product:id,name,slug,price,stock',
            'orderItems.product.images:product_id,url,alt_text,is_primary',
            'orderItems.productVariant:id,product_id,sku,options,price,stock',
        ]);
    }

    public function markAsPaid(?string $stripePaymentIntentId = null): void
    {
        if ($this->payment_status === PaymentStatus::Paid) {
            return;
        }

        $this->update([
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
            'stripe_payment_intent_id' => $stripePaymentIntentId ?? $this->stripe_payment_intent_id,
            'paid_at' => now(),
        ]);
    }
}
