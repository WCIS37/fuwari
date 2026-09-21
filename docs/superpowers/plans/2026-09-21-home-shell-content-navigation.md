# Minerhut Home-Shell Content Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Zephyr home shell persistent while articles, archive, about, and the home list replace only the right-hand content area with smooth Swup transitions and independent URLs.

**Architecture:** Keep Astro's existing static routes and let Swup fetch their generated HTML. Render the same atmospheric shell on every route, keep navbar/sidebar outside the replacement boundary, and replace only `main` plus `#toc`; route-aware navigation state is updated by a small idempotent client helper.

**Tech Stack:** Astro 5, Svelte 5, Tailwind CSS, Swup via `@swup/astro`, Node test runner, Pagefind.

**Spec:** `docs/superpowers/specs/2026-09-21-home-shell-content-navigation-design.md`

## Global Constraints

- Preserve independent URLs for `/`, `/posts/<slug>/`, `/archive/`, and `/about/`.
- Preserve real `href` attributes and full static HTML as progressive enhancement.
- Keep Zephyr day/night atmosphere, navbar, profile, categories, and tags visible on every route.
- Do not preload every article body into the home page.
- Do not add a client router or a new runtime dependency.
- Keep large-screen TOC replacement working.
- Respect `prefers-reduced-motion: reduce`.
- Preserve all unrelated dirty-worktree changes and user content.

## Review Focus

- Directly loading `/posts/helloworld/` must render the atmosphere and journal sidebar around the article, not an article-only shell; covered in Task 2.
- Browser back/forward must update active navigation and content without stacking event handlers; covered in Task 3.
- A failed or disabled Swup navigation must retain usable native links; covered in Task 2.
- Rapid repeated clicks must not replay the fixed-shell entrance animation or register duplicate hooks; covered in Task 3.
- Reduced-motion visitors must receive no translated/sliding content motion; covered in Task 3.

---

### Task 1: Chinese Navigation Labels

**Files:**
- Modify: `src/constants/link-presets.ts`
- Test: `tests/home-design.test.mjs`

**Interfaces:**
- Consumes: existing `LinkPreset.Home`, `LinkPreset.Archive`, and `LinkPreset.About` entries.
- Produces: navbar and mobile-menu labels `首页`, `归档`, and `关于` with unchanged route URLs.

- [ ] **Step 1: Write the failing navigation-copy test**

Add a test that resolves the preset source and asserts literal labels and URLs independently:

```js
test("primary navigation uses Chinese labels without changing routes", async () => {
	const presets = await read("src/constants/link-presets.ts");
	assert.match(presets, /name:\s*"首页"[\s\S]*?url:\s*"\/"/);
	assert.match(presets, /name:\s*"归档"[\s\S]*?url:\s*"\/archive\/"/);
	assert.match(presets, /name:\s*"关于"[\s\S]*?url:\s*"\/about\/"/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test --test-name-pattern="primary navigation uses Chinese" tests/home-design.test.mjs`

Expected: FAIL because the presets still render `Home`, `Archive`, and `About`.

- [ ] **Step 3: Change the preset labels only**

Keep the existing enum indices and URLs, and update the names:

```ts
export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: { name: "首页", url: "/" },
	[LinkPreset.About]: { name: "关于", url: "/about/" },
	[LinkPreset.Archive]: { name: "归档", url: "/archive/" },
};
```

- [ ] **Step 4: Run the focused test and full design tests**

Run: `node --test --test-name-pattern="primary navigation uses Chinese" tests/home-design.test.mjs`

Expected: PASS.

Run: `node --test tests/home-design.test.mjs tests/css-build-compat.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit Task 1**

```powershell
git add -- src/constants/link-presets.ts tests/home-design.test.mjs
git commit -m "feat: localize primary navigation"
```

### Task 2: Persistent Home Shell with Content-Only Replacement

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/MainGridLayout.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/components/Navbar.astro`
- Modify: `src/styles/main.css`
- Test: `tests/home-design.test.mjs`

**Interfaces:**
- Consumes: Astro routes that all render through `MainGridLayout.astro`; Swup container selectors.
- Produces: a route-independent shell and Swup boundaries `main` and `#toc`.

- [ ] **Step 1: Write failing shell-boundary tests**

Replace the temporary `#page-shell` expectation and add tests that require the final architecture:

```js
test("Swup replaces content and toc while the home shell stays mounted", async () => {
	const config = await read("astro.config.mjs");
	const layout = await read("src/layouts/MainGridLayout.astro");
	assert.match(config, /containers:\s*\["main",\s*"#toc"\]/);
	assert.doesNotMatch(config, /containers:\s*\["#page-shell"/);
	assert.match(layout, /<header id="home-atmosphere"/);
	assert.doesNotMatch(layout, /\{isHomePage\s*&&\s*\(\s*<header id="home-atmosphere"/);
});

test("native hrefs remain available when Swup cannot navigate", async () => {
	const navbar = await read("src/components/Navbar.astro");
	assert.match(navbar, /href=\{url\('\/'\)\}/);
	assert.doesNotMatch(navbar, /data-no-swup/);
});
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `node --test --test-name-pattern="Swup replaces content|native hrefs" tests/home-design.test.mjs`

Expected: FAIL because Swup currently replaces `#page-shell` and the atmosphere is conditional.

- [ ] **Step 3: Restore content-only Swup containers**

In `astro.config.mjs` set:

```js
containers: ["main", "#toc"],
updateBodyClass: true,
```

Keep `updateHead`, cache, preload, accessibility, and global instance behavior unchanged.

- [ ] **Step 4: Make the atmosphere and home layout universal**

In `MainGridLayout.astro`:

- Remove the temporary `#page-shell` wrapper.
- Render `#home-atmosphere` on every route instead of guarding it with `isHomePage`.
- Use the home content offset and home-shell data attributes for every route.
- Keep route-specific page content inside the existing `<main id="swup-container">`.
- Keep the sidebar outside `<main>` so it stays mounted during Swup visits.

The resulting structural boundary must be:

```astro
<div id="top-row" data-home-nav="true">...</div>
<header id="home-atmosphere" class="home-atmosphere">...</header>
<div class="absolute w-full ..." data-home-page="true">
	...
	<SideBar ... />
	<main id="swup-container" class="transition-swup-content ...">
		<slot />
	</main>
</div>
```

- [ ] **Step 5: Make shell lifecycle cleanup independent of Astro view transitions**

Replace the unused `astro:before-swap` cleanup path with one idempotent setup owned by the fixed shell. Store cleanup state on the atmosphere element or a module-scoped guard, and do not tear it down on every Swup content visit. The pointer and scroll listeners must be attached once per full document load.

- [ ] **Step 6: Run focused and full tests**

Run: `node --test --test-name-pattern="Swup replaces content|native hrefs|home atmosphere" tests/home-design.test.mjs`

Expected: PASS.

Run: `node --test tests/home-design.test.mjs tests/css-build-compat.test.mjs`

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 2**

```powershell
git add -- astro.config.mjs src/layouts/MainGridLayout.astro src/layouts/Layout.astro src/components/Navbar.astro src/styles/main.css tests/home-design.test.mjs
git commit -m "feat: keep home shell across content navigation"
```

### Task 3: Route-Aware Navigation and Smooth Content Transitions

**Files:**
- Create: `src/utils/navigation-ui.mjs`
- Modify: `src/components/Navbar.astro`
- Modify: `src/styles/transition.css`
- Modify: `src/styles/main.css`
- Modify: `src/layouts/Layout.astro`
- Test: `tests/navigation-ui.test.mjs`
- Test: `tests/home-design.test.mjs`

**Interfaces:**
- Produces: `getPrimaryRoute(pathname: string): "home" | "archive" | "about" | "post" | "other"`.
- Produces: `syncPrimaryNavigation(root: ParentNode = document): void` that sets `aria-current="page"` on exactly the matching primary navigation link and removes stale state.
- Consumes: Swup `page:view` and initial document setup.

- [ ] **Step 1: Write failing route-classification tests**

Create `tests/navigation-ui.test.mjs` using Node's test runner and import `getPrimaryRoute` directly from `src/utils/navigation-ui.mjs`. Keep DOM access inside `syncPrimaryNavigation` so route classification stays testable without a browser.

Use these literal cases:

```js
const cases = [
	["/", "home"],
	["/2/", "home"],
	["/archive/", "archive"],
	["/about/", "about"],
	["/posts/helloworld/", "post"],
	["/missing/", "other"],
];
```

Assert that query strings and hashes do not change classification when a full URL-like value is supplied.

- [ ] **Step 2: Run the route tests and confirm RED**

Run: `node --test tests/navigation-ui.test.mjs`

Expected: FAIL because `navigation-ui` does not exist.

- [ ] **Step 3: Implement route classification and nav synchronization**

Implement a pure `getPrimaryRoute` and an idempotent DOM synchronizer. Mark primary links in `Navbar.astro` with `data-primary-route="home|archive|about"`. The synchronizer must remove old `aria-current` attributes before applying the new one and must leave all links unselected on article routes.

- [ ] **Step 4: Add lifecycle registration with a duplicate guard**

In `Layout.astro`, register initial synchronization and one `page:view` handler. Use this document-level dataset guard:

```ts
const setupNavigationUi = () => {
	if (document.documentElement.dataset.navigationUiReady === "true") return;
	document.documentElement.dataset.navigationUiReady = "true";
	syncPrimaryNavigation();
	window.swup?.hooks.on("page:view", () => syncPrimaryNavigation());
};
```

Adapt initialization for the existing delayed `swup:enable` event without adding a second handler.

- [ ] **Step 5: Write failing animation-contract tests**

Add assertions for a dedicated `.transition-swup-content` class, a route progress indicator, and reduced-motion overrides. The test must fail if translated motion remains active inside the reduced-motion media query.

- [ ] **Step 6: Implement the transition and progress styling**

Use `transition.css` for Swup states:

```css
.transition-swup-content {
	transition: opacity 280ms ease, transform 280ms cubic-bezier(.22, 1, .36, 1);
	opacity: 1;
	transform: translate3d(0, 0, 0);
}

html.is-changing .transition-swup-content {
	opacity: 0;
	transform: translate3d(-0.75rem, -0.35rem, 0);
}

html.is-rendering .transition-swup-content {
	transform: translate3d(0.75rem, 0.35rem, 0);
}
```

Add a fixed, low-contrast blue-green progress line driven by Swup changing classes, with opacity hidden when idle. Under `prefers-reduced-motion: reduce`, set `transform: none !important` and shorten or remove transition duration.

- [ ] **Step 7: Verify navigation state, animation, and duplicate registration tests**

Run: `node --test tests/navigation-ui.test.mjs tests/home-design.test.mjs tests/css-build-compat.test.mjs`

Expected: all tests PASS.

- [ ] **Step 8: Commit Task 3**

```powershell
git add -- src/utils/navigation-ui.mjs src/components/Navbar.astro src/styles/transition.css src/styles/main.css src/layouts/Layout.astro tests/navigation-ui.test.mjs tests/home-design.test.mjs
git commit -m "feat: animate in-shell content navigation"
```

### Task 4: Lifecycle, Type Safety, and Production Verification

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/components/Navbar.astro`
- Modify: `src/components/ArchivePanel.svelte`
- Test: `tests/home-design.test.mjs`
- Test: `tests/navigation-ui.test.mjs`

**Interfaces:**
- Consumes: fixed-shell navigation from Tasks 2 and 3.
- Produces: idempotent initialization after content replacement and an error-free `pnpm check` baseline.

- [ ] **Step 1: Add regression tests for fixed-shell initialization ownership**

Add a regression test that reads `Layout.astro` and requires the `navigationUiReady` guard, exactly one `page:view` registration for `syncPrimaryNavigation`, a `content:replace` scrollbar hook, and PhotoSwipe destruction before content replacement. Add a second assertion that `MainGridLayout.astro` contains exactly one pointer listener registration guarded by `motionReady`.

- [ ] **Step 2: Run regression tests and confirm RED where lifecycle guards are missing**

Run: `node --test tests/navigation-ui.test.mjs tests/home-design.test.mjs`

Expected: at least the new duplicate-registration assertion FAILS before implementation.

- [ ] **Step 3: Consolidate idempotent lifecycle setup**

For each global hook group in `Layout.astro`:

- Add a stable setup guard.
- Keep fixed-shell listeners alive across visits.
- Destroy and recreate only content-owned PhotoSwipe instances.
- Reinitialize content scrollbar/TOC behavior after replacement.
- Do not bind the same `page:view` callback on every executed page script.

- [ ] **Step 4: Fix the existing Astro check errors without changing behavior**

Resolve the Svelte hydration typing at `Navbar.astro` by using the supported component import/directive shape for `LightDarkSwitch`. Align `ArchivePanel.svelte`'s post category type with the content schema:

```ts
category?: string | null;
```

Do not alter archive filtering semantics.

- [ ] **Step 5: Run the complete automated verification**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

Run: `pnpm check`

Expected: exit code 0 with no errors.

Run: `pnpm build`

Expected: exit code 0; Astro emits all static routes and Pagefind indexes the generated pages.

- [ ] **Step 6: Inspect generated route shells**

Run:

```powershell
rg -n 'id="home-atmosphere"|id="sidebar"|id="swup-container"' dist/index.html dist/about/index.html dist/archive/index.html dist/posts/helloworld/index.html
```

Expected: every inspected file contains all three shell markers.

- [ ] **Step 7: Manual browser acceptance**

Run `pnpm preview` once and verify:

- Home → article → Home has no full-page flash.
- Article A → browser Back/Forward restores content and URL.
- Home → Archive → article works and archive interaction is live.
- Home → About → Back works.
- Fixed background/navbar/sidebar do not replay entrance animations.
- Mobile layout has no horizontal overflow.
- Reduced-motion mode has no translated movement.
- Search, TOC, code copy, PhotoSwipe, and back-to-top remain functional.

- [ ] **Step 8: Commit Task 4**

```powershell
git add -- src/layouts/Layout.astro src/components/Navbar.astro src/components/ArchivePanel.svelte tests/home-design.test.mjs tests/navigation-ui.test.mjs
git commit -m "fix: stabilize content navigation lifecycle"
```

Stage only files changed by this task.
