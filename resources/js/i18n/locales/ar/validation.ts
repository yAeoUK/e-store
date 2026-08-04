import type { ValidationTranslations } from '../en/validation';

export default {
    required: '{field} مطلوب.',
    email: 'يرجى إدخال عنوان بريد إلكتروني صالح.',
    maxLength: 'يجب ألا يتجاوز {field} {max} حرفاً.',
    minLength: 'يجب أن يتكون {field} من {min} أحرف على الأقل.',
    numeric: 'يجب أن يكون {field} رقماً.',
    integer: 'يجب أن يكون {field} عدداً صحيحاً.',
    min: 'يجب ألا يقل {field} عن {min}.',
    max: 'يجب ألا يتجاوز {field} {max}.',
    confirmed: '{field} غير متطابق.',
    filesRequired: 'يرجى اختيار ملف واحد على الأقل.',
    fileType: 'يُسمح فقط بملفات من نوع {types}.',
    fileSize: 'يجب ألا يتجاوز حجم كل ملف {max}.',
} satisfies ValidationTranslations;
