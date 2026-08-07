import { describe } from 'vitest';
import TextareaField from '@/components/TextareaField.vue';
import { testLabeledFieldContract } from '../../utils';

describe('TextareaField', () => {
    testLabeledFieldContract(TextareaField, {
        label: 'Description',
        elementSelector: 'textarea',
        classProp: 'textareaClass',
        setValue: 'world',
        forwardedAttrs: { rows: 6 },
    });
});
