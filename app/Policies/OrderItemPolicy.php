<?php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Models\OrderItem;
use App\Models\User;

class OrderItemPolicy
{
    public function update(User $user, OrderItem $orderItem): bool
    {
        return $orderItem->order->user_id === $user->id
            && $orderItem->order->status === OrderStatus::Cart;
    }

    public function delete(User $user, OrderItem $orderItem): bool
    {
        return $this->update($user, $orderItem);
    }
}
