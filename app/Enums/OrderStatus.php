<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Cart = 'cart';
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
