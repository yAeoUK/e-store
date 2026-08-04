const account = {
    addresses: {
        pageTitle: 'Saved Addresses',
        empty: 'No addresses yet.',
        addHeading: 'Add Address',
        editHeading: 'Edit Address',
        label: 'Label',
        labelPlaceholder: 'Label (e.g., Home)',
        name: 'Recipient Name',
        namePlaceholder: 'Recipient name',
        line1: 'Address Line 1',
        line1Placeholder: 'Address line 1',
        line2: 'Address Line 2',
        line2Placeholder: 'Address line 2',
        city: 'City',
        cityPlaceholder: 'City',
        state: 'State',
        statePlaceholder: 'State',
        postalCode: 'Postal Code',
        postalCodePlaceholder: 'Postal code',
        country: 'Country',
        countryPlaceholder: 'Country',
        phone: 'Phone',
        phonePlaceholder: 'Phone number',
        setDefault: 'Set as default',
        defaultLabel: 'Default',
        edit: 'Edit',
        submit: 'Add Address',
        saveChanges: 'Save Changes',
        deleteConfirmTitle: 'Delete address?',
        deleteConfirmMessage:
            'This address will be permanently removed from your account.',
    },
    orders: {
        pageTitle: 'Order History',
        placeholder:
            "This page is a placeholder for the user's order history. Orders will be implemented later.",
    },
};

export type AccountTranslations = typeof account;

export default account;
