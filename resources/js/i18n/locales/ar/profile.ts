import type { ProfileTranslations } from '../en/profile';

export default {
    title: 'الملف الشخصي',
    information: {
        heading: 'معلومات الملف الشخصي',
        description: 'قم بتحديث معلومات ملفك الشخصي وعنوان بريدك الإلكتروني.',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        unverified: 'عنوان بريدك الإلكتروني غير مفعّل.',
        resendLink: 'اضغط هنا لإعادة إرسال رسالة التفعيل.',
        verificationSent: 'تم إرسال رابط تفعيل جديد إلى عنوان بريدك الإلكتروني.',
    },
    password: {
        heading: 'تحديث كلمة المرور',
        description: 'تأكد من أن حسابك يستخدم كلمة مرور طويلة وعشوائية للحفاظ على الأمان.',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور',
    },
    deleteAccount: {
        heading: 'حذف الحساب',
        description:
            'بمجرد حذف حسابك، سيتم حذف جميع موارده وبياناته بشكل نهائي. قبل حذف حسابك، يرجى تنزيل أي بيانات أو معلومات ترغب في الاحتفاظ بها.',
        confirmTitle: 'هل أنت متأكد أنك تريد حذف حسابك؟',
        confirmDescription:
            'بمجرد حذف حسابك، سيتم حذف جميع موارده وبياناته بشكل نهائي. يرجى إدخال كلمة المرور لتأكيد رغبتك في حذف حسابك بشكل دائم.',
        passwordPlaceholder: 'كلمة المرور',
    },
} satisfies ProfileTranslations;
