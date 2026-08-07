<?php

use App\Enums\OrderStatus;

test('pending can transition to processing or cancelled only', function () {
    expect(OrderStatus::Pending->allowedTransitions())->toBe([
        OrderStatus::Processing,
        OrderStatus::Cancelled,
    ]);
});

test('processing can transition to completed or cancelled only', function () {
    expect(OrderStatus::Processing->allowedTransitions())->toBe([
        OrderStatus::Completed,
        OrderStatus::Cancelled,
    ]);
});

test('completed, cancelled, and cart are terminal with no allowed transitions', function () {
    expect(OrderStatus::Completed->allowedTransitions())->toBe([])
        ->and(OrderStatus::Cancelled->allowedTransitions())->toBe([])
        ->and(OrderStatus::Cart->allowedTransitions())->toBe([]);
});

test('canTransitionTo reflects the allowed transition list', function () {
    expect(OrderStatus::Pending->canTransitionTo(OrderStatus::Processing))->toBeTrue()
        ->and(OrderStatus::Pending->canTransitionTo(OrderStatus::Cancelled))->toBeTrue()
        ->and(OrderStatus::Pending->canTransitionTo(OrderStatus::Completed))->toBeFalse()
        ->and(OrderStatus::Pending->canTransitionTo(OrderStatus::Cart))->toBeFalse();
});

test('canTransitionTo is false for terminal statuses', function () {
    expect(OrderStatus::Completed->canTransitionTo(OrderStatus::Pending))->toBeFalse()
        ->and(OrderStatus::Cancelled->canTransitionTo(OrderStatus::Pending))->toBeFalse()
        ->and(OrderStatus::Cart->canTransitionTo(OrderStatus::Pending))->toBeFalse();
});
