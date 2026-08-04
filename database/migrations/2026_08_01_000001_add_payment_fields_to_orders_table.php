<?php

use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('shipping_address_snapshot');
            $table->string('payment_status')->default(PaymentStatus::Unpaid->value)->after('payment_method');
            $table->string('stripe_checkout_session_id')->nullable()->unique()->after('payment_status');
            $table->string('stripe_payment_intent_id')->nullable()->after('stripe_checkout_session_id');
            $table->timestamp('paid_at')->nullable()->after('stripe_payment_intent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'stripe_checkout_session_id',
                'stripe_payment_intent_id',
                'paid_at',
            ]);
        });
    }
};
