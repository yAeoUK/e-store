<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\Stripe\CheckoutSessionCreator;
use Stripe\Checkout\Session;
use Stripe\Service\Checkout\SessionService;
use Stripe\StripeClient;

class FakeStripeClientForCheckout extends StripeClient
{
    public function __construct(private readonly object $checkoutStub) {}

    public function __get($name)
    {
        return $name === 'checkout' ? $this->checkoutStub : parent::__get($name);
    }
}

function mockStripeSessionService(): SessionService
{
    $sessions = Mockery::mock(SessionService::class);

    $checkout = new class($sessions)
    {
        public function __construct(public SessionService $sessions) {}
    };

    app()->instance(StripeClient::class, new FakeStripeClientForCheckout($checkout));

    return $sessions;
}

test('createForOrder builds a checkout session from the order\'s items', function () {
    $sessions = mockStripeSessionService();

    $user = User::factory()->create(['email' => 'buyer@example.com']);
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create();
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => 19.99,
    ]);

    $fakeSession = Session::constructFrom(['id' => 'cs_test_123']);

    $sessions->shouldReceive('create')
        ->once()
        ->with(Mockery::on(function (array $params) use ($order, $product) {
            expect($params['mode'])->toBe('payment');
            expect($params['customer_email'])->toBe('buyer@example.com');
            expect($params['metadata'])->toBe(['order_id' => (string) $order->id]);
            expect($params['success_url'])->toContain(route('checkout.stripe.return', ['order' => $order]));
            expect($params['success_url'])->toContain('session_id={CHECKOUT_SESSION_ID}');
            expect($params['cancel_url'])->toBe(route('checkout.index'));

            expect($params['line_items'])->toHaveCount(1);
            $lineItem = $params['line_items'][0];
            expect($lineItem['quantity'])->toBe(3);
            expect($lineItem['price_data']['currency'])->toBe('usd');
            expect($lineItem['price_data']['unit_amount'])->toBe(1999);
            expect($lineItem['price_data']['product_data']['name'])->toBe($product->name);

            return true;
        }))
        ->andReturn($fakeSession);

    $result = app(CheckoutSessionCreator::class)->createForOrder($order);

    expect($result)->toBe($fakeSession);
});

test('createForOrder falls back to a generic product name when the snapshot has none', function () {
    $sessions = mockStripeSessionService();

    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'quantity' => 1,
        'product_snapshot' => [],
    ]);

    $fakeSession = Session::constructFrom(['id' => 'cs_test_456']);

    $sessions->shouldReceive('create')
        ->once()
        ->with(Mockery::on(function (array $params) {
            expect($params['line_items'][0]['price_data']['product_data']['name'])->toBe('Product');

            return true;
        }))
        ->andReturn($fakeSession);

    app(CheckoutSessionCreator::class)->createForOrder($order);
});

test('retrieve delegates to the Stripe checkout sessions service', function () {
    $sessions = mockStripeSessionService();

    $fakeSession = Session::constructFrom(['id' => 'cs_test_789']);

    $sessions->shouldReceive('retrieve')
        ->once()
        ->with('cs_test_789')
        ->andReturn($fakeSession);

    $result = app(CheckoutSessionCreator::class)->retrieve('cs_test_789');

    expect($result)->toBe($fakeSession);
});
