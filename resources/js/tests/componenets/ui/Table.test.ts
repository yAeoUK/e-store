import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCaption from '@/components/ui/table/TableCaption.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableEmpty from '@/components/ui/table/TableEmpty.vue';
import TableFooter from '@/components/ui/table/TableFooter.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';

describe('Table', () => {
    it('wraps a table element in a scrollable container and renders its slot', () => {
        const wrapper = mount(Table, {
            slots: { default: '<tbody><tr><td>Row</td></tr></tbody>' },
        });

        expect(wrapper.attributes('data-slot')).toBe('table-container');
        expect(wrapper.classes()).toContain('overflow-auto');

        const table = wrapper.find('table');
        expect(table.exists()).toBe(true);
        expect(table.attributes('data-slot')).toBe('table');
        expect(table.text()).toBe('Row');
    });

    it('merges a custom class onto the table element', () => {
        const wrapper = mount(Table, {
            props: { class: 'my-table' },
        });

        expect(wrapper.find('table').classes()).toContain('my-table');
    });
});

describe('TableFooter', () => {
    it('renders a tfoot with its slot content', () => {
        const wrapper = mount(TableFooter, {
            slots: { default: '<tr><td>Footer</td></tr>' },
        });

        expect(wrapper.element.tagName).toBe('TFOOT');
        expect(wrapper.attributes('data-slot')).toBe('table-footer');
        expect(wrapper.text()).toBe('Footer');
    });
});

describe('TableHeader', () => {
    it('renders a thead with its slot content', () => {
        const wrapper = mount(TableHeader, {
            slots: { default: '<tr><th>Head</th></tr>' },
        });

        expect(wrapper.element.tagName).toBe('THEAD');
        expect(wrapper.attributes('data-slot')).toBe('table-header');
        expect(wrapper.text()).toBe('Head');
    });
});

describe('TableBody', () => {
    it('renders a tbody with its slot content', () => {
        const wrapper = mount(TableBody, {
            slots: { default: '<tr><td>Body</td></tr>' },
        });

        expect(wrapper.element.tagName).toBe('TBODY');
        expect(wrapper.attributes('data-slot')).toBe('table-body');
        expect(wrapper.text()).toBe('Body');
    });
});

describe('TableRow', () => {
    it('renders a tr with its slot content', () => {
        const wrapper = mount(TableRow, {
            slots: { default: '<td>Cell</td>' },
        });

        expect(wrapper.element.tagName).toBe('TR');
        expect(wrapper.attributes('data-slot')).toBe('table-row');
        expect(wrapper.text()).toBe('Cell');
    });
});

describe('TableHead', () => {
    it('renders a th with its slot content', () => {
        const wrapper = mount(TableHead, {
            slots: { default: 'Name' },
        });

        expect(wrapper.element.tagName).toBe('TH');
        expect(wrapper.attributes('data-slot')).toBe('table-head');
        expect(wrapper.text()).toBe('Name');
    });
});

describe('TableCell', () => {
    it('renders a td with its slot content', () => {
        const wrapper = mount(TableCell, {
            slots: { default: 'Value' },
        });

        expect(wrapper.element.tagName).toBe('TD');
        expect(wrapper.attributes('data-slot')).toBe('table-cell');
        expect(wrapper.text()).toBe('Value');
    });
});

describe('TableCaption', () => {
    it('renders a caption with its slot content', () => {
        const wrapper = mount(TableCaption, {
            slots: { default: 'A list of results.' },
        });

        expect(wrapper.element.tagName).toBe('CAPTION');
        expect(wrapper.attributes('data-slot')).toBe('table-caption');
        expect(wrapper.text()).toBe('A list of results.');
    });
});

describe('TableEmpty', () => {
    it('renders a full-width row/cell wrapping its slot content', () => {
        const wrapper = mount(TableEmpty, {
            slots: { default: 'No results.' },
        });

        expect(wrapper.element.tagName).toBe('TR');
        expect(wrapper.text()).toBe('No results.');

        const cell = wrapper.find('td');
        expect(cell.attributes('data-slot')).toBe('table-cell');
        expect(cell.attributes('colspan')).toBe('1');
    });

    it('forwards a custom colspan to the underlying cell', () => {
        const wrapper = mount(TableEmpty, {
            props: { colspan: 4 },
            slots: { default: 'No results.' },
        });

        expect(wrapper.find('td').attributes('colspan')).toBe('4');
    });
});
