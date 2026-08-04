export interface Address {
    id: number;
    label: string | null;
    name: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postal_code: string;
    country: string;
    phone: string | null;
    is_default: boolean;
}

export type AddressSnapshot = Omit<Address, 'id' | 'is_default'>;
