import { usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import PageContainer from '@/components/PageContainer.vue';
import ShopAuthBanner from '@/components/ShopAuthBanner.vue';
import SidebarNav from '@/components/SidebarNav.vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { routeMock } from '../setup';

function pageWithUrl(url: string) {
    return {
        props: { auth: { user: null }, errors: {} },
        url,
    } as unknown as ReturnType<typeof usePage>;
}

beforeEach(() => {
    routeMock.mockClear();
    vi.mocked(usePage).mockReturnValue(pageWithUrl('/admin/dashboard'));
});

afterEach(() => {
    vi.mocked(usePage).mockReturnValue(pageWithUrl('/admin/dashboard'));
    routeMock.mockImplementation((name: string) => name);
});

describe('AdminLayout', () => {
    it('renders a nav item for every admin section', () => {
        const wrapper = mount(AdminLayout);

        const nav = wrapper.findComponent(SidebarNav);
        const labels = nav
            .props('items')
            .map((item: { label: string }) => item.label);

        expect(labels).toEqual([
            'admin.nav.dashboard',
            'admin.nav.products',
            'admin.nav.categories',
            'admin.nav.users',
            'admin.nav.orders',
            'admin.nav.admins',
        ]);
    });

    it('marks the dashboard item active when on the dashboard URL', () => {
        vi.mocked(usePage).mockReturnValue(pageWithUrl('admin.dashboard'));

        const wrapper = mount(AdminLayout);
        const items = wrapper
            .findComponent(SidebarNav)
            .props('items') as Array<{
            key: string;
            active?: boolean;
        }>;

        expect(items.find((item) => item.key === 'dashboard')?.active).toBe(
            true,
        );
        expect(items.find((item) => item.key === 'products')?.active).toBe(
            false,
        );
    });

    it('marks the products item active for a product sub-route', () => {
        vi.mocked(usePage).mockReturnValue(
            pageWithUrl('admin.products.index/5/edit'),
        );

        const wrapper = mount(AdminLayout);
        const items = wrapper
            .findComponent(SidebarNav)
            .props('items') as Array<{
            key: string;
            active?: boolean;
        }>;

        expect(items.find((item) => item.key === 'products')?.active).toBe(
            true,
        );
    });

    it('does not mark a section active when the URL merely shares its prefix', () => {
        // "admin.dashboardish" starts with the dashboard href as a raw
        // string, but isn't actually the dashboard section — there's no
        // '/', '?', or end-of-string boundary right after it.
        vi.mocked(usePage).mockReturnValue(pageWithUrl('admin.dashboardish'));

        const wrapper = mount(AdminLayout);
        const items = wrapper
            .findComponent(SidebarNav)
            .props('items') as Array<{
            key: string;
            active?: boolean;
        }>;

        expect(items.find((item) => item.key === 'dashboard')?.active).toBe(
            false,
        );
    });

    it('requests a relative href from Ziggy so it matches the relative page.url', () => {
        // Real Ziggy returns an absolute URL unless the 3rd (absolute) arg
        // is explicitly false — simulate that here instead of the default
        // identity mock, which would mask a regression to the buggy
        // absolute-vs-relative comparison this test guards against.
        routeMock.mockImplementation(
            (name: string, _params: unknown, absolute?: boolean) => {
                const section = name.split('.')[1];

                return absolute === false
                    ? `/admin/${section}`
                    : `http://example.test/admin/${section}`;
            },
        );
        vi.mocked(usePage).mockReturnValue(pageWithUrl('/admin/categories'));

        const wrapper = mount(AdminLayout);
        const items = wrapper
            .findComponent(SidebarNav)
            .props('items') as Array<{
            key: string;
            href: string;
            active?: boolean;
        }>;

        const categories = items.find((item) => item.key === 'categories');
        expect(categories?.href).toBe('/admin/categories');
        expect(categories?.active).toBe(true);
    });

    it('renders the default and header slots', () => {
        const wrapper = mount(AdminLayout, {
            slots: {
                default: '<p>Page content</p>',
                header: '<h1>Header content</h1>',
            },
        });

        expect(wrapper.text()).toContain('Page content');
        expect(wrapper.text()).toContain('Header content');
    });

    it('renders the dashboard page title', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.text()).toContain('admin.dashboard.pageTitle');
    });

    it('renders the back-to-shop link text', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.text()).toContain('admin.nav.backToShop');
    });

    it('renders the ApplicationLogo', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.findComponent(ApplicationLogo).exists()).toBe(true);
    });

    it('includes the LanguageSwitcher', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.findComponent(LanguageSwitcher).exists()).toBe(true);
    });

    it('includes the ShopAuthBanner', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.findComponent(ShopAuthBanner).exists()).toBe(true);
    });

    it('renders content within the PageContainer', () => {
        const wrapper = mount(AdminLayout);

        expect(wrapper.findComponent(PageContainer).exists()).toBe(true);
    });
});
