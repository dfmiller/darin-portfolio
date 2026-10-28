import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseCombobox from './BaseCombobox.vue';

describe('BaseCombobox.vue', () => {
  it('renders as v-combobox by default', () => {
    const wrapper = mount(BaseCombobox);
    
    // Default mode is 'combobox', which maps to 'v-combobox'
    const combobox = wrapper.findComponent({ name: 'VCombobox' });
    expect(combobox.exists()).toBe(true);
  });

  it('renders the correct dynamic component based on mode prop', async () => {
    // Test 'autocomplete' mode
    const autocompleteWrapper = mount(BaseCombobox, {
      props: { mode: 'autocomplete' },
    });
    expect(autocompleteWrapper.findComponent({ name: 'VAutocomplete' }).exists()).toBe(true);

    // Test 'select' mode
    const selectWrapper = mount(BaseCombobox, {
      props: { mode: 'select' },
    });
    expect(selectWrapper.findComponent({ name: 'VSelect' }).exists()).toBe(true);
  });

  it('passes props correctly (label, options, variant, density, etc.)', () => {
    const testOptions = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];

    const wrapper = mount(BaseCombobox, {
      props: {
        label: 'Test Label',
        options: testOptions,
        hint: 'Test hint message',
        error: 'Test error message',
        disabled: true,
        clearable: true,
        multiple: true,
        variant: 'outlined',
        density: 'compact',
      },
    });

    const component = wrapper.findComponent({ name: 'VCombobox' });
    
    expect(component.props('label')).toBe('Test Label');
    expect(component.props('items')).toEqual(testOptions);
    expect(component.props('hint')).toBe('Test hint message');
    expect(component.props('persistentHint')).toBe(true);
    expect(component.props('errorMessages')).toBe('Test error message');
    expect(component.props('disabled')).toBe(true);
    expect(component.props('clearable')).toBe(true);
    expect(component.props('multiple')).toBe(true);
    expect(component.props('variant')).toBe('outlined');
    expect(component.props('density')).toBe('compact');
  });

  it('emits update:modelValue when the value changes', async () => {
    const wrapper = mount(BaseCombobox, {
      props: { modelValue: null },
    });

    const component = wrapper.findComponent({ name: 'VCombobox' });
    
    // Simulate updating value from the inner component
    await component.vm.$emit('update:modelValue', 'New Value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New Value']);
  });
});