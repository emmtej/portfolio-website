# Mobile UX/UI Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt the portfolio application for mobile viewports by implementing scrollable tabs, compacting utilities, and simplifying project card interactions for touch devices.

**Architecture:** We will introduce responsive utility classes to scale layout elements on small screens. The global tab navigation will become a scrollable horizontal flex container. We'll simplify the `ProjectCard` component by removing hover-only states and making visual tap affordances permanent. 

**Tech Stack:** React, Tailwind CSS, Framer Motion

---

### Task 1: Navigation Architecture (Scrollable Tabs)

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/Tabs.tsx`
- Modify: `src/components/ui/Tabs.tsx`

- [ ] **Step 1: Add a utility class to hide scrollbars globally**

Update `src/index.css` to append a `.scrollbar-hide` class that functions across browsers. Add this at the bottom of the file.

```css
@layer utilities {
  .scrollbar-hide {
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 2: Update the main Tabs container to be scrollable**

In `src/components/Tabs.tsx`, locate the `<motion.nav>` element and add `overflow-x-auto scrollbar-hide snap-x snap-mandatory` to its `className`. Make sure it retains `flex gap-4 md:gap-6`.

```tsx
        <motion.nav 
          role="tablist" 
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mb-2"
          initial="hidden"
          animate="visible"
          variants={fadeInRestTabs}
          onKeyDown={handleKeyDown}
        >
```

- [ ] **Step 3: Update the TabButton to prevent text wrapping and support snapping**

In `src/components/ui/Tabs.tsx`, add `whitespace-nowrap shrink-0 snap-start` to the `TabButton`'s `className` so the tabs do not compress or wrap onto multiple lines when constrained.

```tsx
export const TabButton = forwardRef<HTMLButtonElement, {
  id: string;
  label: string;
  onClick: (id: string) => void;
  isActive: boolean;
}>(({
  id,
  label,
  onClick,
  isActive,
}, ref) => (
  <button
    ref={ref}
    id={`tab-${id}`}
    role="tab"
    aria-selected={isActive}
    aria-controls={`panel-${id}`}
    tabIndex={isActive ? 0 : -1}
    className={cn(
      "whitespace-nowrap shrink-0 snap-start -mb-px border-b-2 py-4 text-sm transition-colors uppercase font-bold tracking-widest border-transparent text-text-muted/40 hover:text-text-main/80",
      "aria-selected:border-text-main aria-selected:text-text-main",
    )}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
));
```

- [ ] **Step 4: Commit changes**

```bash
git add src/index.css src/components/Tabs.tsx src/components/ui/Tabs.tsx
git commit -m "feat(ui): implement horizontally scrollable tabs for mobile navigation"
```

---

### Task 2: Utility Placement (Compact Top-Right)

**Files:**
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Adjust the utilities container in Layout.tsx**

Update `src/components/Layout.tsx` to alter the position, scale, and gap for the top-right utility container. Replace `top-6 right-6` with responsive classes `top-4 right-4 md:top-6 md:right-6`, change the gap to `gap-2 md:gap-4`, and apply `scale-90 md:scale-100 origin-top-right`.

```tsx
        <motion.div 
          className="fixed top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-4 z-50 scale-90 md:scale-100 origin-top-right"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <LanguageSwitcher />
          <ThemeToggle />
        </motion.div>
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/Layout.tsx
git commit -m "style(ui): make theme and language utilities more compact on mobile"
```

---

### Task 3: Project Cards (Tap-to-Expand)

**Files:**
- Modify: `src/components/development/ProjectUI.tsx`

- [ ] **Step 1: Simplify the visual preview area in ProjectCard**

In `src/components/development/ProjectUI.tsx`, update the `ProjectCard` component. Remove the hover-dependent styling (`group-hover:*`) on the gradient and the "VIEW PROJECT" badge. Make the title slightly more prominent by default. The preview area should now look like this:

```tsx
      {/* Visual Preview Area - Full Width */}
      <div className="aspect-[16/10] w-full bg-gradient-to-br from-text-main/[0.07] to-text-main/[0.12] relative overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-60" />

          <div className="relative flex flex-col items-center gap-2">
            <span className="text-lg font-bold tracking-tighter text-text-main/20">
              {project.title}
            </span>
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Make the right arrow affordance permanently visible**

Also in `ProjectCard`, adjust the container for `ArrowRightIcon`. Remove the hover dependencies for its border and text color so it clearly indicates interactivity at all times.

Replace:
```tsx
          <div className="mt-1 size-8 border border-border-subtle flex items-center justify-center text-text-muted/40 group-hover:border-text-main/20 group-hover:text-text-main/60 group-hover:translate-x-1 transition-all duration-normal">
```
With:
```tsx
          <div className="mt-1 size-8 border border-text-main/20 flex items-center justify-center text-text-main/60 group-hover:translate-x-1 transition-all duration-normal">
```

- [ ] **Step 3: Commit changes**

```bash
git add src/components/development/ProjectUI.tsx
git commit -m "style(ui): simplify project cards and remove hover-dependency for touch targets"
```
