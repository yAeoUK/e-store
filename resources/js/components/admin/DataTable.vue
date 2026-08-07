<script setup lang="ts" generic="Row extends { id: number | string }">
import { computed } from 'vue';
import { wrapBetweenClass } from '@/components/classNames';
import Pagination from '@/components/Pagination.vue';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableEmpty,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { t } from '@/i18n';
import type { DataTableColumn, Paginated } from './admin';

const props = defineProps<{
    columns: DataTableColumn<Row>[];
    paginated: Paginated<Row>;
    emptyMessage: string;
}>();

const rows = computed(() => props.paginated.data);

const slots = defineSlots<{
    actions?: (props: { row: Row }) => unknown;
    // Dynamic per-column slots, named `cell-<columnKey>`, letting a page
    // render real content (e.g. a Link) for one column instead of plain text.
    [slot: `cell-${string}`]: ((props: { row: Row }) => unknown) | undefined;
}>();

const fullRowColspan = computed(
    () => props.columns.length + (slots.actions ? 1 : 0),
);

const summaryText = computed(() => {
    const { from, to, total } = props.paginated;

    if (!total) {
        return null;
    }

    return `${t('admin.table.showing')} ${from}–${to} ${t('admin.table.of')} ${total} ${t('admin.table.results')}`;
});

function alignClass(align?: 'start' | 'center' | 'end'): string {
    if (align === 'center') {
        return 'text-center';
    }

    if (align === 'end') {
        return 'text-end';
    }

    return 'text-start';
}

function cellValue(row: Row, column: DataTableColumn<Row>): string {
    if (column.render) {
        return column.render(row);
    }

    const value = (row as Record<string, unknown>)[column.key];

    return value === null || value === undefined ? '' : String(value);
}
</script>

<template>
    <Table>
        <TableCaption v-if="summaryText" class="sr-only">
            {{ summaryText }}
        </TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead
                    v-for="column in columns"
                    :key="column.key"
                    :class="alignClass(column.align)"
                >
                    {{ column.label }}
                </TableHead>
                <TableHead v-if="slots.actions" class="text-end" />
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableEmpty v-if="rows.length === 0" :colspan="fullRowColspan">
                {{ emptyMessage }}
            </TableEmpty>
            <TableRow v-for="row in rows" :key="row.id">
                <TableCell
                    v-for="column in columns"
                    :key="column.key"
                    :class="alignClass(column.align)"
                >
                    <slot :name="`cell-${column.key}`" :row="row">
                        {{ cellValue(row, column) }}
                    </slot>
                </TableCell>
                <TableCell v-if="slots.actions" class="text-end">
                    <slot name="actions" :row="row" />
                </TableCell>
            </TableRow>
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell :colspan="fullRowColspan">
                    <div :class="wrapBetweenClass">
                        <span v-if="summaryText">{{ summaryText }}</span>
                        <Pagination :links="paginated.links" />
                    </div>
                </TableCell>
            </TableRow>
        </TableFooter>
    </Table>
</template>
