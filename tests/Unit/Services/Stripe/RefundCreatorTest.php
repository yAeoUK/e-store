<?php

use App\Models\Order;
use App\Services\Stripe\RefundCreator;
use Stripe\Refund;
use Stripe\Service\RefundService;
use Stripe\StripeClient;

class FakeStripeClientForRefund extends StripeClient
{
    public function __construct(private readonly object $refundsStub) {}

    public function __get($name)
    {
        return $name === 'refunds' ? $this->refundsStub : parent::__get($name);
    }
}

function mockStripeRefundService(): RefundService
{
    $refunds = Mockery::mock(RefundService::class);

    app()->instance(StripeClient::class, new FakeStripeClientForRefund($refunds));

    return $refunds;
}

test('createForOrder issues a refund for the order\'s payment intent', function () {
    $refunds = mockStripeRefundService();

    $order = Order::factory()->create(['stripe_payment_intent_id' => 'pi_123']);

    $fakeRefund = Refund::constructFrom(['id' => 're_123']);

    $refunds->shouldReceive('create')
        ->once()
        ->with(['payment_intent' => 'pi_123'])
        ->andReturn($fakeRefund);

    $result = app(RefundCreator::class)->createForOrder($order);

    expect($result)->toBe($fakeRefund);
});
