import { describe, expect, it } from 'vitest';
import { useFilterForm } from '@/composables/useFilterForm';

describe('useFilterForm', () => {
    it('starts from the given defaults when no filters are provided', () => {
        const { state } = useFilterForm(undefined, {
            search: '',
            status: 'all',
        });

        expect(state).toEqual({ search: '', status: 'all' });
    });

    it('overrides defaults with provided filter values', () => {
        const { state } = useFilterForm(
            { search: 'shoes', status: 'archived' },
            { search: '', status: 'all' },
        );

        expect(state).toEqual({ search: 'shoes', status: 'archived' });
    });

    it('ignores null or undefined filter values and keeps the default', () => {
        const { state } = useFilterForm(
            { search: null, status: undefined },
            { search: '', status: 'all' },
        );

        expect(state).toEqual({ search: '', status: 'all' });
    });

    it('normalize() returns the current state', () => {
        const { state, normalize } = useFilterForm(
            { search: 'shoes' },
            { search: '', status: 'all' },
        );

        expect(normalize()).toEqual({ search: 'shoes', status: 'all' });

        state.status = 'archived';

        expect(normalize()).toEqual({ search: 'shoes', status: 'archived' });
    });

    it('normalize() maps falsy state values to null', () => {
        const { state, normalize } = useFilterForm(undefined, {
            search: '',
            page: 0,
            status: 'all',
        });

        expect(normalize()).toEqual({
            search: null,
            page: null,
            status: 'all',
        });

        state.status = '';

        expect(normalize()).toEqual({ search: null, page: null, status: null });
    });
});
