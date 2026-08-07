const shop = {
    products: {
        pageTitle: 'Products',
        heading: 'Shop products',
        description: 'Browse our catalog with simple search and filtering.',
        empty: 'No products matched your search.',
        categoryEmpty: 'No products found in this category.',
        filters: {
            search: 'Search',
            searchPlaceholder: 'Search products',
            category: 'Category',
            allCategories: 'All categories',
            minPrice: 'Min price',
            maxPrice: 'Max price',
            apply: 'Apply filters',
        },
    },
    categories: {
        pageTitle: 'Categories',
    },
    cart: {
        pageTitle: 'Your Cart',
        heading: 'Your Cart',
        empty: 'Your cart is empty.',
        quantity: 'Quantity',
        editQuantity: 'Edit quantity',
        editQuantityTitle: 'Edit quantity',
        decreaseQuantity: 'Decrease quantity',
        increaseQuantity: 'Increase quantity',
        remove: 'Remove',
        removeConfirmTitle: 'Remove item?',
        removeConfirmMessage: 'This item will be removed from your cart.',
        clearCart: 'Clear cart',
        clearConfirmTitle: 'Clear cart?',
        clearConfirmMessage: 'All items will be removed from your cart.',
        subtotal: 'Subtotal',
        proceedToCheckout: 'Proceed to Checkout',
        continueShopping: 'Continue Shopping',
        addToCart: 'Add to Cart',
        selectVariant: 'Select an option',
        outOfStock: 'Out of stock',
    },
    checkout: {
        pageTitle: 'Checkout',
        heading: 'Checkout',
        orderSummary: 'Order Summary',
        shippingAddress: 'Shipping Address',
        noAddresses: 'You have no saved addresses yet.',
        manageAddresses: 'Add an address',
        total: 'Total',
        placeOrder: 'Place Order',
        paymentMethod: 'Payment Method',
        paymentMethods: {
            cod: 'Cash on Delivery',
            stripe: 'Pay by Card',
        },
        note: 'Note (optional)',
    },
};

export type ShopTranslations = typeof shop;

export default shop;
