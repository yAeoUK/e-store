// Matches by URL prefix so a sub-route (e.g. /admin/products/5/edit) still
// highlights its parent nav item, without depending on Ziggy's route().current().
// Requires a boundary (end of string, '/', or '?') after the href so a
// sibling section whose name prefixes another (e.g. "admins" vs "admin", or
// "shoes" vs "shoes-kids") can't falsely match.
export function isCurrentPath(url: string | undefined, href: string): boolean {
    const currentUrl = typeof url === 'string' ? url : '';

    return (
        currentUrl === href ||
        currentUrl.startsWith(`${href}/`) ||
        currentUrl.startsWith(`${href}?`)
    );
}
