import type { ShopTranslations } from '../en/shop';

export default {
    products: {
        pageTitle: 'المنتجات',
        heading: 'تسوق المنتجات',
        description: 'تصفح كتالوجنا مع بحث وتصفية بسيطة.',
        empty: 'لا توجد منتجات مطابقة لبحثك.',
        categoryEmpty: 'لا توجد منتجات في هذه الفئة.',
        filters: {
            search: 'بحث',
            searchPlaceholder: 'ابحث عن منتجات',
            category: 'الفئة',
            allCategories: 'كل الفئات',
            minPrice: 'أقل سعر',
            maxPrice: 'أعلى سعر',
            apply: 'تطبيق التصفية',
        },
    },
    categories: {
        pageTitle: 'الفئات',
    },
} satisfies ShopTranslations;
