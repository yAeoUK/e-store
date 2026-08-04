const validation = {
    required: '{field} is required.',
    email: 'Please enter a valid email address.',
    maxLength: '{field} must not exceed {max} characters.',
    minLength: '{field} must be at least {min} characters.',
    numeric: '{field} must be a number.',
    integer: '{field} must be a whole number.',
    min: '{field} must be at least {min}.',
    max: '{field} must not exceed {max}.',
    confirmed: '{field} does not match.',
    filesRequired: 'Please select at least one file.',
    fileType: 'Only {types} files are allowed.',
    fileSize: 'Each file must not exceed {max}.',
};

export type ValidationTranslations = typeof validation;

export default validation;
