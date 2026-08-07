import { MessageSquareText } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OrderNoteCard from '@/components/OrderNoteCard.vue';
import SectionHeading from '@/components/SectionHeading.vue';
import { Badge } from '@/components/ui/badge';

describe('OrderNoteCard', () => {
    it('renders the heading and note text', () => {
        const wrapper = mount(OrderNoteCard, {
            props: { heading: 'Customer note', note: 'Please gift wrap.' },
        });

        expect(wrapper.findComponent(SectionHeading).props('heading')).toBe(
            'Customer note',
        );
        expect(wrapper.find('p').text()).toBe('Please gift wrap.');
    });

    it('does not render a badge when no badgeLabel is given', () => {
        const wrapper = mount(OrderNoteCard, {
            props: { heading: 'Note', note: 'Some note' },
        });

        expect(wrapper.findComponent(Badge).exists()).toBe(false);
    });

    it('renders a badge with the given label when badgeLabel is provided alongside an icon', () => {
        const wrapper = mount(OrderNoteCard, {
            props: {
                heading: 'Note',
                note: 'Some note',
                icon: MessageSquareText,
                badgeLabel: 'Admin only',
            },
        });

        const badge = wrapper.findComponent(Badge);
        expect(badge.exists()).toBe(true);
        expect(badge.text()).toBe('Admin only');
    });

    it('does not render the badge when badgeLabel is given without an icon', () => {
        const wrapper = mount(OrderNoteCard, {
            props: {
                heading: 'Note',
                note: 'Some note',
                badgeLabel: 'Admin only',
            },
        });

        expect(wrapper.findComponent(Badge).exists()).toBe(false);
    });

    it('passes the icon and iconClass through to SectionHeading', () => {
        const wrapper = mount(OrderNoteCard, {
            props: {
                heading: 'Note',
                note: 'Some note',
                icon: MessageSquareText,
                iconClass: 'text-indigo-600 dark:text-indigo-400',
            },
        });

        const heading = wrapper.findComponent(SectionHeading);
        expect(heading.props('icon')).toBe(MessageSquareText);
        expect(heading.props('iconClass')).toBe(
            'text-indigo-600 dark:text-indigo-400',
        );
    });

    it('applies the accentClass to the outer card', () => {
        const wrapper = mount(OrderNoteCard, {
            props: {
                heading: 'Note',
                note: 'Some note',
                accentClass:
                    'border-s-4 border-s-indigo-400 dark:border-s-indigo-500',
            },
        });

        expect(wrapper.classes()).toContain('border-s-4');
        expect(wrapper.classes()).toContain('border-s-indigo-400');
    });
});
