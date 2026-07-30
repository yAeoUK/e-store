<?php

return [

    'products' => [
        'has_orders' => 'Cannot delete a product that has existing orders. Deactivate it instead.',
    ],

    'categories' => [
        'has_children_or_products' => 'Cannot delete a category that still has child categories or products.',
    ],

    'admins' => [
        'cannot_revoke_self' => 'You cannot revoke your own admin access.',
        'at_least_one_required' => 'At least one admin must remain.',
    ],

];
