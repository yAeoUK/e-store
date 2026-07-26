<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'يجب قبول حقل :attribute.',
    'accepted_if' => 'يجب قبول حقل :attribute عندما يكون :other هو :value.',
    'active_url' => 'يجب أن يكون حقل :attribute رابط URL صحيحاً.',
    'after' => 'يجب أن يكون حقل :attribute تاريخاً بعد :date.',
    'after_or_equal' => 'يجب أن يكون حقل :attribute تاريخاً بعد أو يساوي :date.',
    'alpha' => 'يجب أن يحتوي حقل :attribute على أحرف فقط.',
    'alpha_dash' => 'يجب أن يحتوي حقل :attribute على أحرف وأرقام وشرطات وشرطات سفلية فقط.',
    'alpha_num' => 'يجب أن يحتوي حقل :attribute على أحرف وأرقام فقط.',
    'any_of' => 'حقل :attribute غير صالح.',
    'array' => 'يجب أن يكون حقل :attribute مصفوفة.',
    'ascii' => 'يجب أن يحتوي حقل :attribute على أحرف ورموز أحادية البايت فقط.',
    'before' => 'يجب أن يكون حقل :attribute تاريخاً قبل :date.',
    'before_or_equal' => 'يجب أن يكون حقل :attribute تاريخاً قبل أو يساوي :date.',
    'between' => [
        'array' => 'يجب أن يحتوي حقل :attribute على عدد عناصر بين :min و :max.',
        'file' => 'يجب أن يكون حجم حقل :attribute بين :min و :max كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute بين :min و :max.',
        'string' => 'يجب أن يحتوي حقل :attribute على عدد أحرف بين :min و :max.',
    ],
    'boolean' => 'يجب أن تكون قيمة حقل :attribute إما صحيحة أو خاطئة.',
    'can' => 'حقل :attribute يحتوي على قيمة غير مصرح بها.',
    'confirmed' => 'تأكيد حقل :attribute غير متطابق.',
    'contains' => 'حقل :attribute يفتقد إلى قيمة مطلوبة.',
    'current_password' => 'كلمة المرور غير صحيحة.',
    'date' => 'يجب أن يكون حقل :attribute تاريخاً صحيحاً.',
    'date_equals' => 'يجب أن يكون حقل :attribute تاريخاً مساوياً لـ :date.',
    'date_format' => 'يجب أن يتطابق حقل :attribute مع الصيغة :format.',
    'decimal' => 'يجب أن يحتوي حقل :attribute على :decimal منازل عشرية.',
    'declined' => 'يجب رفض حقل :attribute.',
    'declined_if' => 'يجب رفض حقل :attribute عندما يكون :other هو :value.',
    'different' => 'يجب أن يكون حقل :attribute و :other مختلفين.',
    'digits' => 'يجب أن يتكون حقل :attribute من :digits أرقام.',
    'digits_between' => 'يجب أن يتكون حقل :attribute من عدد أرقام بين :min و :max.',
    'dimensions' => 'حقل :attribute يحتوي على أبعاد صورة غير صالحة.',
    'distinct' => 'حقل :attribute يحتوي على قيمة مكررة.',
    'doesnt_contain' => 'يجب ألا يحتوي حقل :attribute على أي من القيم التالية: :values.',
    'doesnt_end_with' => 'يجب ألا ينتهي حقل :attribute بأي من القيم التالية: :values.',
    'doesnt_start_with' => 'يجب ألا يبدأ حقل :attribute بأي من القيم التالية: :values.',
    'email' => 'يجب أن يكون حقل :attribute بريداً إلكترونياً صحيحاً.',
    'encoding' => 'يجب أن يكون ترميز حقل :attribute :encoding.',
    'ends_with' => 'يجب أن ينتهي حقل :attribute بأحد القيم التالية: :values.',
    'enum' => 'قيمة :attribute المحددة غير صحيحة.',
    'exists' => 'قيمة :attribute المحددة غير موجودة.',
    'extensions' => 'يجب أن يكون حقل :attribute ملفاً من أحد الأنواع التالية: :values.',
    'file' => 'يجب أن يكون حقل :attribute ملفاً.',
    'filled' => 'يجب أن يحتوي حقل :attribute على قيمة.',
    'gt' => [
        'array' => 'يجب أن يحتوي حقل :attribute على أكثر من :value عنصر.',
        'file' => 'يجب أن يكون حجم حقل :attribute أكبر من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute أكبر من :value.',
        'string' => 'يجب أن يحتوي حقل :attribute على أكثر من :value حرف.',
    ],
    'gte' => [
        'array' => 'يجب أن يحتوي حقل :attribute على :value عنصر أو أكثر.',
        'file' => 'يجب أن يكون حجم حقل :attribute أكبر من أو يساوي :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute أكبر من أو تساوي :value.',
        'string' => 'يجب أن يحتوي حقل :attribute على :value حرف أو أكثر.',
    ],
    'hex_color' => 'يجب أن يكون حقل :attribute لوناً سداسياً صحيحاً.',
    'image' => 'يجب أن يكون حقل :attribute صورة.',
    'in' => 'قيمة :attribute المحددة غير صحيحة.',
    'in_array' => 'يجب أن يكون حقل :attribute موجوداً ضمن :other.',
    'in_array_keys' => 'يجب أن يحتوي حقل :attribute على واحد على الأقل من المفاتيح التالية: :values.',
    'integer' => 'يجب أن يكون حقل :attribute عدداً صحيحاً.',
    'ip' => 'يجب أن يكون حقل :attribute عنوان IP صحيحاً.',
    'ipv4' => 'يجب أن يكون حقل :attribute عنوان IPv4 صحيحاً.',
    'ipv6' => 'يجب أن يكون حقل :attribute عنوان IPv6 صحيحاً.',
    'json' => 'يجب أن يكون حقل :attribute نص JSON صحيحاً.',
    'list' => 'يجب أن يكون حقل :attribute قائمة.',
    'lowercase' => 'يجب أن يكون حقل :attribute بأحرف صغيرة.',
    'lt' => [
        'array' => 'يجب أن يحتوي حقل :attribute على أقل من :value عنصر.',
        'file' => 'يجب أن يكون حجم حقل :attribute أقل من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute أقل من :value.',
        'string' => 'يجب أن يحتوي حقل :attribute على أقل من :value حرف.',
    ],
    'lte' => [
        'array' => 'يجب ألا يحتوي حقل :attribute على أكثر من :value عنصر.',
        'file' => 'يجب أن يكون حجم حقل :attribute أقل من أو يساوي :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute أقل من أو تساوي :value.',
        'string' => 'يجب ألا يحتوي حقل :attribute على أكثر من :value حرف.',
    ],
    'mac_address' => 'يجب أن يكون حقل :attribute عنوان MAC صحيحاً.',
    'max' => [
        'array' => 'يجب ألا يحتوي حقل :attribute على أكثر من :max عنصر.',
        'file' => 'يجب ألا يتجاوز حجم حقل :attribute :max كيلوبايت.',
        'numeric' => 'يجب ألا تتجاوز قيمة حقل :attribute :max.',
        'string' => 'يجب ألا يتجاوز حقل :attribute :max حرف.',
    ],
    'max_digits' => 'يجب ألا يحتوي حقل :attribute على أكثر من :max أرقام.',
    'mimes' => 'يجب أن يكون حقل :attribute ملفاً من نوع: :values.',
    'mimetypes' => 'يجب أن يكون حقل :attribute ملفاً من نوع: :values.',
    'min' => [
        'array' => 'يجب أن يحتوي حقل :attribute على الأقل :min عنصر.',
        'file' => 'يجب أن يكون حجم حقل :attribute على الأقل :min كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute على الأقل :min.',
        'string' => 'يجب أن يحتوي حقل :attribute على الأقل :min حرف.',
    ],
    'min_digits' => 'يجب أن يحتوي حقل :attribute على الأقل :min أرقام.',
    'missing' => 'يجب أن يكون حقل :attribute مفقوداً.',
    'missing_if' => 'يجب أن يكون حقل :attribute مفقوداً عندما يكون :other هو :value.',
    'missing_unless' => 'يجب أن يكون حقل :attribute مفقوداً إلا إذا كان :other هو :value.',
    'missing_with' => 'يجب أن يكون حقل :attribute مفقوداً عند وجود :values.',
    'missing_with_all' => 'يجب أن يكون حقل :attribute مفقوداً عند وجود :values.',
    'multiple_of' => 'يجب أن يكون حقل :attribute من مضاعفات :value.',
    'not_in' => 'قيمة :attribute المحددة غير صحيحة.',
    'not_regex' => 'صيغة حقل :attribute غير صحيحة.',
    'numeric' => 'يجب أن يكون حقل :attribute رقماً.',
    'password' => [
        'letters' => 'يجب أن يحتوي حقل :attribute على حرف واحد على الأقل.',
        'mixed' => 'يجب أن يحتوي حقل :attribute على حرف كبير وحرف صغير على الأقل.',
        'numbers' => 'يجب أن يحتوي حقل :attribute على رقم واحد على الأقل.',
        'symbols' => 'يجب أن يحتوي حقل :attribute على رمز واحد على الأقل.',
        'uncompromised' => 'الـ :attribute المُدخل ظهر ضمن تسريب بيانات. يرجى اختيار :attribute مختلف.',
    ],
    'present' => 'يجب أن يكون حقل :attribute موجوداً.',
    'present_if' => 'يجب أن يكون حقل :attribute موجوداً عندما يكون :other هو :value.',
    'present_unless' => 'يجب أن يكون حقل :attribute موجوداً إلا إذا كان :other هو :value.',
    'present_with' => 'يجب أن يكون حقل :attribute موجوداً عند وجود :values.',
    'present_with_all' => 'يجب أن يكون حقل :attribute موجوداً عند وجود :values.',
    'prohibited' => 'حقل :attribute محظور.',
    'prohibited_if' => 'حقل :attribute محظور عندما يكون :other هو :value.',
    'prohibited_if_accepted' => 'حقل :attribute محظور عندما يكون :other مقبولاً.',
    'prohibited_if_declined' => 'حقل :attribute محظور عندما يكون :other مرفوضاً.',
    'prohibited_unless' => 'حقل :attribute محظور إلا إذا كان :other ضمن :values.',
    'prohibits' => 'حقل :attribute يمنع وجود :other.',
    'regex' => 'صيغة حقل :attribute غير صحيحة.',
    'required' => 'حقل :attribute مطلوب.',
    'required_array_keys' => 'يجب أن يحتوي حقل :attribute على مدخلات لـ: :values.',
    'required_if' => 'حقل :attribute مطلوب عندما يكون :other هو :value.',
    'required_if_accepted' => 'حقل :attribute مطلوب عندما يكون :other مقبولاً.',
    'required_if_declined' => 'حقل :attribute مطلوب عندما يكون :other مرفوضاً.',
    'required_unless' => 'حقل :attribute مطلوب إلا إذا كان :other ضمن :values.',
    'required_with' => 'حقل :attribute مطلوب عند وجود :values.',
    'required_with_all' => 'حقل :attribute مطلوب عند وجود :values.',
    'required_without' => 'حقل :attribute مطلوب عند عدم وجود :values.',
    'required_without_all' => 'حقل :attribute مطلوب عند عدم وجود أي من :values.',
    'same' => 'يجب أن يتطابق حقل :attribute مع :other.',
    'size' => [
        'array' => 'يجب أن يحتوي حقل :attribute على :size عنصر.',
        'file' => 'يجب أن يكون حجم حقل :attribute :size كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة حقل :attribute :size.',
        'string' => 'يجب أن يحتوي حقل :attribute على :size حرف.',
    ],
    'starts_with' => 'يجب أن يبدأ حقل :attribute بأحد القيم التالية: :values.',
    'string' => 'يجب أن يكون حقل :attribute نصاً.',
    'timezone' => 'يجب أن يكون حقل :attribute منطقة زمنية صحيحة.',
    'unique' => 'قيمة حقل :attribute مُستخدمة من قبل.',
    'uploaded' => 'فشل رفع حقل :attribute.',
    'uppercase' => 'يجب أن يكون حقل :attribute بأحرف كبيرة.',
    'url' => 'يجب أن يكون حقل :attribute رابط URL صحيحاً.',
    'ulid' => 'يجب أن يكون حقل :attribute رمز ULID صحيحاً.',
    'uuid' => 'يجب أن يكون حقل :attribute رمز UUID صحيحاً.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'الاسم',
        'email' => 'البريد الإلكتروني',
        'password' => 'كلمة المرور',
        'current_password' => 'كلمة المرور الحالية',
        'password_confirmation' => 'تأكيد كلمة المرور',
        'token' => 'الرمز',
        'label' => 'التسمية',
        'line1' => 'العنوان - السطر الأول',
        'line2' => 'العنوان - السطر الثاني',
        'city' => 'المدينة',
        'state' => 'المحافظة',
        'postal_code' => 'الرمز البريدي',
        'country' => 'الدولة',
        'phone' => 'رقم الهاتف',
        'is_default' => 'الافتراضي',
        'parent_id' => 'الفئة الأم',
        'slug' => 'المعرف المختصر',
        'description' => 'الوصف',
        'category_id' => 'الفئة',
        'price' => 'السعر',
        'short_description' => 'الوصف المختصر',
        'is_active' => 'الحالة',
        'stock' => 'الكمية المتوفرة',
        'metadata' => 'البيانات الوصفية',
    ],

];
