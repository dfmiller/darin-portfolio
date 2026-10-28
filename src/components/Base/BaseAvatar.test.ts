import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseAvatar from './BaseAvatar.vue';

describe('BaseAvatar.vue', () => {
  it('renders an image when src is provided', () => {
    const wrapper = mount(BaseAvatar, {
      props: { src: 'https://example.com/avatar.jpg', alt: 'User' },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg');
    expect(img.attributes('alt')).toBe('User');
  });

  it('renders initials and a dynamic background color when src is empty and initials are provided', () => {
    const wrapper = mount(BaseAvatar, {
      props: { src: '', initials: 'jd' },
    });

    const initialsSpan = wrapper.find('[data-testid="avatar-initials"]');
    expect(initialsSpan.exists()).toBe(true);
    expect(initialsSpan.text()).toBe('jd');

    const avatar = wrapper.find('[data-testid="base-avatar"]');
    expect(avatar.exists()).toBe(true);
  });

  it('renders fallback icon when both src and initials are empty', () => {
    const wrapper = mount(BaseAvatar, {
      props: { src: '' },
    });

    const icon = wrapper.find('[data-testid="fallback-icon"]');
    expect(icon.exists()).toBe(true);
  });

  it('falls back to initials/icon if the image fails to load', async () => {
    const wrapper = mount(BaseAvatar, {
      props: { src: 'https://example.com/broken.jpg', initials: 'ab' },
    });

    // Initially, initials fallback should not be visible
    expect(wrapper.find('[data-testid="avatar-initials"]').exists()).toBe(false);

    // Trigger the VImg error event properly using $emit on the internal component VM
    const vImg = wrapper.findComponent({ name: 'VImg' });
    await vImg.vm.$emit('error');

    // After error, verify the initials fallback successfully appears
    const initialsSpan = wrapper.find('[data-testid="avatar-initials"]');
    expect(initialsSpan.exists()).toBe(true);
    expect(initialsSpan.text()).toBe('ab');
  });
});