import type { AccountTranslations } from '../en/account';

export default {
    addresses: {
        pageTitle: 'العناوين المحفوظة',
        empty: 'لا توجد عناوين بعد.',
        addHeading: 'إضافة عنوان',
        labelPlaceholder: 'التسمية (مثال: المنزل)',
        namePlaceholder: 'اسم المستلم',
        line1Placeholder: 'العنوان - السطر الأول',
        line2Placeholder: 'العنوان - السطر الثاني',
        cityPlaceholder: 'المدينة',
        statePlaceholder: 'المحافظة',
        postalCodePlaceholder: 'الرمز البريدي',
        countryPlaceholder: 'الدولة',
        setDefault: 'تعيين كافتراضي',
        submit: 'إضافة عنوان',
    },
    orders: {
        pageTitle: 'سجل الطلبات',
        placeholder:
            'هذه الصفحة عنصر نائب لسجل طلبات المستخدم. سيتم تفعيل الطلبات لاحقاً.',
    },
} satisfies AccountTranslations;
