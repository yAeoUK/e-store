import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { DataTableColumn } from '@/components/admin/admin';
import DataTable from '@/components/admin/DataTable.vue';

interface Row {
    id: number;
    name: string;
    price: number;
}

// `mount()` can't jointly infer DataTable's generic `Row` param from both
// `columns` and `rows` the way the Vue compiler does at real usage sites, so
// props are cast through `any` below purely to satisfy vue-test-utils' types.
const columns: DataTableColumn<Row>[] = [
    { key: 'name', label: 'Name' },
    {
        key: 'price',
        label: 'Price',
        align: 'end',
        render: (row: Row) => `$${row.price.toFixed(2)}`,
    },
];

describe('DataTable', () => {
    it('renders a header cell per column', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: [] },
                emptyMessage: 'Nothing here',
            } as any,
        });

        const headers = wrapper.findAll('th');
        expect(headers.map((h) => h.text())).toEqual(['Name', 'Price']);
    });

    it('shows the empty message when there are no rows', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: [] },
                emptyMessage: 'Nothing here',
            } as any,
        });

        expect(wrapper.text()).toContain('Nothing here');
        expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    });

    it('renders one row per item using the render() formatter when provided', () => {
        const rows: Row[] = [
            { id: 1, name: 'Widget', price: 9.5 },
            { id: 2, name: 'Gadget', price: 12 },
        ];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows },
                emptyMessage: 'Nothing here',
            } as any,
        });

        const bodyRows = wrapper.findAll('tbody tr');
        expect(bodyRows).toHaveLength(2);
        expect(bodyRows[0].text()).toContain('Widget');
        expect(bodyRows[0].text()).toContain('$9.50');
        expect(bodyRows[1].text()).toContain('$12.00');
    });

    it('passes each row to the actions slot and renders an extra header cell for it', () => {
        const rows: Row[] = [{ id: 1, name: 'Widget', price: 9.5 }];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows },
                emptyMessage: 'Nothing here',
            } as any,
            slots: {
                actions: `<template #actions="{ row }"><button>Edit {{ row.name }}</button></template>`,
            },
        });

        expect(wrapper.findAll('th')).toHaveLength(3);
        expect(wrapper.find('button').text()).toBe('Edit Widget');
    });

    it('renders a provided cell-<key> slot instead of the default text, leaving other columns unaffected', () => {
        const rows: Row[] = [{ id: 1, name: 'Widget', price: 9.5 }];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows },
                emptyMessage: 'Nothing here',
            } as any,
            slots: {
                'cell-name': `<template #cell-name="{ row }"><a :href="'/widgets/' + row.id">{{ row.name }}</a></template>`,
            },
        });

        const link = wrapper.find('a');
        expect(link.exists()).toBe(true);
        expect(link.attributes('href')).toBe('/widgets/1');
        expect(link.text()).toBe('Widget');

        // The price column has no `cell-price` slot, so it still falls back
        // to the render() formatter as before.
        expect(wrapper.find('tbody tr').text()).toContain('$9.50');
    });

    it('renders a pagination summary caption and footer when total is provided', () => {
        const rows: Row[] = [{ id: 1, name: 'Widget', price: 9.5 }];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows, from: 1, to: 15, total: 42 },
                emptyMessage: 'Nothing here',
            } as any,
        });

        const summary =
            'admin.table.showing 1–15 admin.table.of 42 admin.table.results';
        expect(wrapper.find('caption').text()).toBe(summary);
        expect(wrapper.find('tfoot').text()).toContain(summary);
    });

    it('renders no summary caption when total is omitted, but keeps the footer for pagination', () => {
        const rows: Row[] = [{ id: 1, name: 'Widget', price: 9.5 }];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows },
                emptyMessage: 'Nothing here',
            } as any,
        });

        expect(wrapper.find('caption').exists()).toBe(false);
        expect(wrapper.find('tfoot').text()).toBe('');
    });

    it('renders the pagination links inside the table footer, alongside the summary', () => {
        const rows: Row[] = [{ id: 1, name: 'Widget', price: 9.5 }];
        const links = [
            { url: '/products?page=1', label: '1', active: true },
            { url: '/products?page=2', label: '2', active: false },
        ];

        const wrapper = mount(DataTable, {
            props: {
                columns,
                paginated: { data: rows, from: 1, to: 1, total: 2, links },
                emptyMessage: 'Nothing here',
            } as any,
        });

        const footer = wrapper.find('tfoot');
        const pageLinks = footer.findAll('a');
        expect(pageLinks.map((a) => a.text())).toEqual(['1', '2']);
        expect(footer.text()).toContain(
            'admin.table.showing 1–1 admin.table.of 2 admin.table.results',
        );
    });
});
