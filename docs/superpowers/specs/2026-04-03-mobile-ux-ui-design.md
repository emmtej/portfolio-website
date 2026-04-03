# Mobile UX/UI Adaptation Design

**Date:** 2026-04-03
**Topic:** Mobile UX/UI Refinements

## Overview
This document outlines the design decisions and requirements for optimizing the portfolio application for mobile viewports. The current implementation relies on desktop-centric paradigms (e.g., hover states, fixed navigation arrays). This update ensures a native-feeling, tactile experience on smaller screens while preserving the existing aesthetic and brand identity.

## Requirements

### 1. Navigation Architecture (Tabs)
The primary navigation (currently rendering as a flat row of tabs) will be adapted for narrow viewports.

*   **Approach:** Scrollable Top Tabs.
*   **Implementation:**
    *   Maintain the existing horizontal layout but introduce a horizontally scrollable container (`overflow-x-auto`) for screens below the `md` breakpoint.
    *   Hide scrollbars (`scrollbar-width: none` or `::-webkit-scrollbar { display: none; }`).
    *   Ensure snap points or smooth scrolling are implemented so users can swipe through available tabs ("About", "Development", "Audio", "Contact").
    *   The active tab must remain fully visible or be scrolled into view when selected via URL routing or initial load.

### 2. Utility Placement (Language & Theme Toggles)
The global utilities need to exist on mobile without clashing with the primary typography (the large, stylized greeting in `App.tsx`).

*   **Approach:** Compact Top-Right.
*   **Implementation:**
    *   Keep the toggles fixed at the top right of the viewport.
    *   Adjust scale and padding for the `sm` and `base` breakpoints to be more compact.
    *   Ensure the `z-index` remains high enough to sit above scrolling content, but the footprint is small enough to avoid overlapping the hero text block significantly.

### 3. Project Cards (`DevelopmentTab.tsx` / `ProjectUI.tsx`)
The current project cards heavily rely on mouse hover states to reveal a "VIEW PROJECT" overlay badge and gradient shifts. Touch devices lack hover capability.

*   **Approach:** Simplified / Tap-to-Expand.
*   **Implementation:**
    *   Remove or disable the hover-dependent "VIEW PROJECT" overlay and opacity shifts for touch devices.
    *   Rely on the existing `ArrowRightIcon` (which will be styled to be visible by default on mobile, rather than appearing/moving on hover) to serve as the clear tap affordance.
    *   The entire card remains the tap target to trigger the `ProjectModal`.
    *   Ensure the visual preview area retains its gradient styling without needing an interaction to look "complete."

### 4. Layout Constraints & Consistency
Ensure consistent padding and spacing margins are applied universally to the mobile view.

*   **Implementation:**
    *   Verify that `Layout.tsx` and all individual tab components (`AboutTab`, `ContactTab`, etc.) correctly utilize the responsive padding utility classes (e.g., `px-6 pb-6` on mobile versus `md:px-12`).
    *   Verify that the `Modal.tsx` handles small screens gracefully (e.g., full width, appropriate vertical margins).
    *   Ensure form fields on the `ContactTab` scale correctly to 100% width on mobile viewports.

## Out of Scope
*   Significant architectural changes to the application state or routing logic.
*   Complete redesign of the visual theme or color palette.
*   New features or content additions not related to responsive formatting.
