export const borderColorClass = 'border-slate-300 dark:border-slate-700';

export const mutedBorderClass = 'border-slate-200 dark:border-slate-800';

export const bodyTextClass = 'text-slate-700 dark:text-slate-300';

export const focusRingClass =
    'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none';

export const surfaceBgClass = 'bg-white dark:bg-slate-900/90';

export const pageBgClass = 'bg-slate-50 dark:bg-slate-950';

export const pageWidthClass = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

export const wrapBetweenClass =
    'flex flex-wrap items-center justify-between gap-3';

export const headerRowClass = `${pageWidthClass} ${wrapBetweenClass} py-3`;

export const narrowPageWidthClass = 'mx-auto max-w-4xl sm:px-6 lg:px-8';

const controlPaddingClass = 'px-4 py-2';

const transitionClass = 'transition duration-150 ease-in-out';

const disabledClass = 'disabled:opacity-25';

export const legacyButtonBaseClass = `inline-flex items-center rounded-md border ${controlPaddingClass} text-xs font-semibold tracking-widest uppercase ${transitionClass} ${disabledClass}`;

export const interactiveRowClass = `${bodyTextClass} hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800`;

export const buttonVariants = {
    primary: `inline-flex items-center rounded-lg bg-indigo-600 ${controlPaddingClass} text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${disabledClass}`,
    secondary: `inline-flex items-center rounded-lg border ${borderColorClass} ${surfaceBgClass} ${controlPaddingClass} text-sm ${interactiveRowClass}`,
};

export const controlShapeClass = 'rounded-lg border px-3 py-2 text-sm';

export const formFieldClass = `w-full ${controlShapeClass} ${borderColorClass} bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`;

export const formFieldBlockClass = `${formFieldClass} mt-1 block`;

export const formGridClass = 'grid gap-4 sm:grid-cols-2';

export const formGrid3Class = 'grid gap-4 sm:grid-cols-3';

export const filterFormClass =
    'grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end';

export const headingTextClass = 'text-slate-900 dark:text-slate-100';

export const mutedTextClass = 'text-slate-500 dark:text-slate-400';

export const hintTextClass = `${mutedTextClass} mt-1 text-xs`;

export const mutedBodyTextClass = 'text-slate-600 dark:text-slate-400';

export const eyebrowTextClass = `${mutedTextClass} text-xs font-medium tracking-wide uppercase`;

export const compactHeadingClass = `text-sm font-semibold ${headingTextClass}`;

export const subheadingTextClass = `text-lg font-semibold ${headingTextClass}`;

export const sectionHeadingClass = 'text-lg font-semibold';

export const pageHeaderTextClass = `text-xl leading-tight font-semibold ${headingTextClass}`;

export const pageTitleClass = `text-2xl font-semibold ${headingTextClass}`;

export const accentBadgeTextClass =
    'text-xs font-medium text-indigo-600 dark:text-indigo-400';

export const rowActionsClass =
    'flex flex-wrap items-start gap-2 sm:justify-end';

export const endRowClass = 'flex items-center justify-end gap-3';

export const mutedLinkClass =
    'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200';

export const linkClass = 'text-indigo-600 hover:underline dark:text-indigo-400';

export const cardSurfaceClass = `rounded-xl border ${mutedBorderClass} dark:bg-slate-900/90`;

export const cardPaddingClass = 'overflow-hidden p-6';

export const listItemCardClass = `rounded border ${mutedBorderClass} p-4`;

export const stackedRowCardClass = `flex flex-col gap-3 rounded border ${mutedBorderClass} p-4 sm:flex-row sm:items-center sm:justify-between`;

export const totalRowClass = `flex items-center justify-between border-t ${mutedBorderClass} pt-4`;

export const errorTextClass = 'text-red-600 dark:text-red-400';
