import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("home layout exposes the atmospheric masthead and motion layers", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");

	assert.match(layout, /id="home-atmosphere"/);
	assert.match(layout, /data-home-page/);
	assert.match(layout, /home-atmosphere-flow home-ribbon/);
});

test("home post cards expose an ordered visual index", async () => {
	const postPage = await read("src/components/PostPage.astro");
	const postCard = await read("src/components/PostCard.astro");

	assert.match(postPage, /index=\{index\}/);
	assert.match(postCard, /post-card-index/);
	assert.match(postCard, /home-post-card/);
});

test("home motion respects reduced-motion preferences", async () => {
	const styles = await read("src/styles/main.css");

	assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
	assert.match(styles, /\.home-atmosphere/);
});

test("home atmosphere uses layered artwork and pointer parallax", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");

	assert.match(layout, /home-atmosphere-base/);
	assert.match(layout, /home-atmosphere-flow/);
	assert.match(layout, /home-atmosphere-foliage/);
	assert.match(layout, /pointermove/);
	assert.match(styles, /--home-pointer-x/);
});

test("atmospheric images can exceed Tailwind's global image width cap", async () => {
	const styles = await read("src/styles/main.css");
	const sharedArtworkRule = styles.match(/\.home-atmosphere-base,[\s\S]*?\.home-atmosphere-foliage \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(sharedArtworkRule, /max-width:\s*none/);
});

test("home atmosphere breaks out to the full viewport width", async () => {
	const styles = await read("src/styles/main.css");
	const rule = styles.match(/\.home-atmosphere \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(rule, /width:\s*calc\(100vw \+ 2rem\)/);
	assert.match(rule, /left:\s*50%/);
	assert.match(rule, /translateX\(-50%\)/);
});

test("decorative home background does not expose a text caret", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");
	const rule = styles.match(/\.home-atmosphere \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(rule, /pointer-events:\s*auto/);
	assert.match(rule, /cursor:\s*default/);
	assert.match(rule, /user-select:\s*none/);
	assert.match(rule, /caret-color:\s*transparent/);
	assert.match(layout, /addEventListener\("mousedown", preventBackgroundCaret\)/);
	assert.match(layout, /event\.preventDefault\(\)/);
});

test("home atmosphere overscans beneath the custom scrollbar gutter", async () => {
	const styles = await read("src/styles/main.css");
	const rule = styles.match(/\.home-atmosphere \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(rule, /width:\s*calc\(100vw \+ 2rem\)/);
});

test("home canvas remains full-screen while the illustrated base is confined to the hero", async () => {
	const styles = await read("src/styles/main.css");
	const rule = styles.match(/\.home-atmosphere \{[\s\S]*?\n\}/)?.[0] ?? "";
	const baseRule = styles.match(/\.home-atmosphere-base \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(rule, /position:\s*fixed/);
	assert.match(rule, /height:\s*100vh/);
	assert.match(rule, /--home-hero-depth/);
	assert.match(baseRule, /mask-image:\s*linear-gradient/);
	assert.match(baseRule, /var\(--home-hero-depth\)/);
});

test("animated flow is hero-only and body decoration stays in the outer gutters", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");
	const flowRule = styles.match(/\.home-atmosphere-flow \{[\s\S]*?\n\}/)?.[0] ?? "";
	const foliageRule = [...styles.matchAll(/^\.home-atmosphere-foliage \{[\s\S]*?^\}/gm)].at(-1)?.[0] ?? "";
	const foliageViewportRule = styles.match(/\.home-atmosphere-foliage-viewport \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(flowRule, /mask-image:\s*linear-gradient/);
	assert.match(flowRule, /var\(--home-hero-depth\)/);
	assert.match(layout, /home-atmosphere-foliage-viewport/);
	assert.match(foliageViewportRule, /--home-safe-center/);
	assert.match(foliageViewportRule, /radial-gradient\(\s*circle at 84% 23%, transparent 0 8\.5rem, black 12rem/);
	assert.match(foliageViewportRule, /linear-gradient\(\s*to right/);
	assert.match(foliageViewportRule, /mask-composite:\s*intersect/);
	assert.doesNotMatch(foliageRule, /mask-image/);
});

test("home hero omits the decorative vertical note", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");

	assert.doesNotMatch(layout, /home-atmosphere-note/);
	assert.doesNotMatch(layout, /把日常写成一阵柔软的风/);
});

test("horizontally drifting artwork has symmetric overscan and bounded travel", async () => {
	const styles = await read("src/styles/main.css");
	const flowRule = styles.match(/\.home-atmosphere-flow \{[\s\S]*?\n\}/)?.[0] ?? "";
	const foliageRule = [...styles.matchAll(/^\.home-atmosphere-foliage \{[\s\S]*?^\}/gm)].at(-1)?.[0] ?? "";
	const flowKeyframes = styles.match(/@keyframes home-flow-drift \{[\s\S]*?\n\}/)?.[0] ?? "";
	const foliageKeyframes = styles.match(/@keyframes home-foliage-float \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(flowRule, /left:\s*-15%/);
	assert.match(flowRule, /width:\s*130%/);
	assert.match(foliageRule, /left:\s*-5%/);
	assert.match(foliageRule, /width:\s*110%/);
	assert.match(foliageRule, /object-fit:\s*fill/);
	assert.match(flowKeyframes, /translate:\s*-3%/);
	assert.match(flowKeyframes, /translate:\s*3%/);
	assert.match(foliageKeyframes, /translate:\s*1%/);
	assert.match(foliageKeyframes, /translate:\s*4%/);
	assert.doesNotMatch(`${flowKeyframes}\n${foliageKeyframes}`, /margin-left/);
});

test("pointer parallax moves artwork against the cursor and has no animated sun overlay", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");
	const flowRule = styles.match(/\.home-atmosphere-flow \{[\s\S]*?\n\}/)?.[0] ?? "";
	const foliageRule = [...styles.matchAll(/^\.home-atmosphere-foliage \{[\s\S]*?^\}/gm)].at(-1)?.[0] ?? "";

	assert.match(flowRule, /var\(--home-pointer-x\) \* -14px/);
	assert.match(foliageRule, /var\(--home-pointer-x\) \* -24px/);
	assert.doesNotMatch(layout, /home-orb/);
	assert.doesNotMatch(styles, /\.home-orb/);
	assert.doesNotMatch(styles, /@keyframes home-orb-drift/);
});

test("home masthead is swept away by scroll without fighting its entrance animation", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");
	const copyRule = styles.match(/\.home-atmosphere-copy \{[\s\S]*?\n\}/)?.[0] ?? "";
	const titleRule = styles.match(/\.home-atmosphere-copy h1 \{[\s\S]*?\n\}/)?.[0] ?? "";
	const kickerRule = styles.match(/\.home-atmosphere-kicker \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(layout, /window\.scrollY \/ 220/);
	assert.match(copyRule, /translate3d\(/);
	assert.match(copyRule, /--home-scroll-progress/);
	assert.match(copyRule, /backface-visibility:\s*hidden/);
	assert.match(copyRule, /transform-origin:\s*left center/);
	assert.match(titleRule, /letter-spacing:\s*0\.08em/);
	assert.match(kickerRule, /translateX\(/);
	assert.match(kickerRule, /--home-scroll-progress/);
	assert.doesNotMatch(copyRule, /animation:\s*home-copy-enter/);
});

test("home masthead scroll progress is frame-smoothed without glyph re-rasterization", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");
	const copyRule = styles.match(/\.home-atmosphere-copy \{[\s\S]*?\n\}/)?.[0] ?? "";
	const titleRule = styles.match(/\.home-atmosphere-copy h1 \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(layout, /requestAnimationFrame\(renderScrollProgress\)/);
	assert.match(layout, /currentProgress \+= \(targetProgress - currentProgress\) \* 0\.16/);
	assert.doesNotMatch(copyRule, /rotate\(/);
	assert.doesNotMatch(copyRule, /filter:\s*blur/);
	assert.doesNotMatch(titleRule, /letter-spacing:\s*calc/);
	assert.match(copyRule, /backface-visibility:\s*hidden/);
});

test("reduced-motion users get a simple masthead fade", async () => {
	const styles = await read("src/styles/main.css");
	const reducedMotion = styles.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(reducedMotion, /\.home-atmosphere-copy/);
	assert.match(reducedMotion, /transform:\s*none\s*!important/);
	assert.match(reducedMotion, /filter:\s*none\s*!important/);
});

test("persistent home atmosphere motion is initialized once outside Swup visits", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");

	assert.match(layout, /atmosphere\.dataset\.motionReady === "true"/);
	assert.match(layout, /setupHomeAtmosphere\(\)/);
	assert.doesNotMatch(layout, /window\.swup\.hooks\.on\("page:view", setupHomeAtmosphere\)/);
	assert.doesNotMatch(layout, /delete atmosphere\.dataset\.motionReady/);
});

test("home sidebar presents profile, categories, and tags as one journal panel", async () => {
	const sidebar = await read("src/components/widget/SideBar.astro");
	const profile = await read("src/components/widget/Profile.astro");
	const widget = await read("src/components/widget/WidgetLayout.astro");
	const styles = await read("src/styles/main.css");

	assert.match(sidebar, /home-journal-sidebar/);
	assert.match(sidebar, /home-journal-profile/);
	assert.match(sidebar, /home-journal-directory/);
	assert.match(profile, /profile-card/);
	assert.match(profile, /profile-avatar/);
	assert.match(sidebar, /home-journal-leaf-emboss/);
	assert.match(sidebar, /home-journal-caption/);
	assert.match(sidebar, /home-journal-sprig/);
	assert.match(widget, /home-journal-section-icon/);
	assert.match(widget, /material-symbols:menu-book-outline-rounded/);
	assert.match(widget, /material-symbols:label-outline-rounded/);
	assert.match(styles, /\[data-home-page="true"\] \.home-journal-sidebar/);
	assert.match(styles, /\.home-journal-directory \.card-base/);
	assert.match(styles, /\.profile-avatar/);
	assert.match(styles, /\.home-journal-directory \.btn-regular[\s\S]*?width:\s*fit-content/);
});

test("sidebar category and tag headings use the requested Chinese labels", async () => {
	const categories = await read("src/components/widget/Categories.astro");
	const tags = await read("src/components/widget/Tags.astro");

	assert.match(categories, /<WidgetLayout name="分类"/);
	assert.match(tags, /<WidgetLayout name="标签"/);
});

test("home journal sidebar keeps content height and uses a subtle non-interactive leaf emboss", async () => {
	const styles = await read("src/styles/main.css");
	const sidebarRule = styles.match(/\[data-home-page="true"\] \.home-journal-sidebar \{[\s\S]*?\n\}/)?.[0] ?? "";
	const embossRule = styles.match(/^\.home-journal-leaf-emboss \{[\s\S]*?\n\}/m)?.[0] ?? "";

	assert.match(sidebarRule, /align-self:\s*start/);
	assert.match(sidebarRule, /height:\s*fit-content/);
	assert.match(embossRule, /opacity:\s*0\.28/);
	assert.match(embossRule, /pointer-events:\s*none/);
	assert.match(embossRule, /user-select:\s*none/);
	assert.match(embossRule, /caret-color:\s*transparent/);
	assert.match(styles, /\.home-journal-leaf-emboss i/);
});

test("Swup replaces content and toc while the home shell stays mounted", async () => {
	const navbar = await read("src/components/Navbar.astro");
	const config = await read("astro.config.mjs");
	const layout = await read("src/layouts/MainGridLayout.astro");
	const brandLink = navbar.match(/<a href=\{url\('\/'\)\}[\s\S]*?>/)?.[0] ?? "";
	const navLink = navbar.match(/<a aria-label=\{l\.name\}[\s\S]*?>/)?.[0] ?? "";

	assert.doesNotMatch(brandLink, /data-no-swup/);
	assert.doesNotMatch(navLink, /data-no-swup/);
	assert.match(config, /containers:\s*\["main",\s*"#toc"\]/);
	assert.doesNotMatch(config, /containers:\s*\["#page-shell"/);
	assert.match(layout, /<header id="home-atmosphere"/);
	assert.doesNotMatch(layout, /\{isHomePage\s*&&\s*\(\s*<header id="home-atmosphere"/);
	assert.doesNotMatch(layout, /id="page-shell"/);
});

test("native home links remain available when Swup cannot navigate", async () => {
	const navbar = await read("src/components/Navbar.astro");

	assert.match(navbar, /href=\{url\('\/'\)\}/);
	assert.doesNotMatch(navbar, /data-no-swup/);
});

test("content navigation has a dedicated transition and reduced-motion fallback", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const transitions = await read("src/styles/transition.css");
	const toc = await read("src/components/widget/TOC.astro");

	assert.match(layout, /transition-swup-content/);
	assert.match(layout, /id="route-progress"/);
	assert.match(transitions, /\.transition-swup-content/);
	assert.match(transitions, /html\.is-changing[\s\S]*?route-progress/);
	assert.match(transitions, /html\.is-animating \.transition-swup-content/);
	assert.match(transitions, /html\.is-rendering\.is-animating \.transition-swup-content/);
	assert.doesNotMatch(transitions, /html\.is-changing \.transition-swup-content\s*\{[^}]*opacity:\s*0/);
	const reducedMotion = transitions.slice(transitions.indexOf("@media (prefers-reduced-motion: reduce)"));
	assert.match(reducedMotion, /\.transition-swup-content/);
	assert.match(reducedMotion, /\.transition-swup-fade/);
	assert.match(reducedMotion, /\.onload-animation/);
	assert.match(reducedMotion, /transform:\s*none\s*!important/);
	assert.match(reducedMotion, /animation:\s*none\s*!important/);
	assert.match(toc, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
});

test("fixed-shell lifecycle hooks are registered only once", async () => {
	const layout = await read("src/layouts/Layout.astro");
	const mainGrid = await read("src/layouts/MainGridLayout.astro");

	assert.match(layout, /dataset\.navigationUiReady/);
	assert.equal((layout.match(/hooks\.on\('page:view', \(\) => syncPrimaryNavigation\(\)\)/g) ?? []).length, 1);
	assert.match(layout, /dataset\.layoutHooksReady/);
	assert.match(layout, /dataset\.photoSwipeHooksReady/);
	assert.match(layout, /hooks\.on\('content:replace', initCustomScrollbar\)/);
	assert.match(layout, /lightbox\?\.destroy\?\.\(\)/);
	assert.match(mainGrid, /dataset\.motionReady === "true"/);
	assert.equal((mainGrid.match(/addEventListener\("pointermove"/g) ?? []).length, 1);
});

test("home main content surround does not blur the background", async () => {
	const styles = await read("src/styles/main.css");
	const surroundRule = styles.match(/\[data-home-page="true"\] #main-grid::before \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.doesNotMatch(surroundRule, /backdrop-filter:\s*blur/);
});

test("home masthead omits the subtitle below the Fuwari title", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");

	assert.doesNotMatch(layout, /<p>\{siteConfig\.subtitle\}<\/p>/);
	assert.doesNotMatch(styles, /\.home-atmosphere-copy\s*>\s*p:last-child/);
});

test("masthead stays Zephyr while the navbar brand reads Minerhut", async () => {
	const config = await read("src/config.ts");
	const layout = await read("src/layouts/MainGridLayout.astro");
	const navbar = await read("src/components/Navbar.astro");

	assert.match(config, /title:\s*"Zephyr"/);
	assert.match(layout, /\{siteConfig\.title\}/);
	assert.match(navbar, />\s*Minerhut\s*</);
});

test("primary navigation uses Chinese labels without changing routes", async () => {
	const presets = await read("src/constants/link-presets.ts");

	assert.match(presets, /name:\s*"首页"[\s\S]*?url:\s*"\/"/);
	assert.match(presets, /name:\s*"归档"[\s\S]*?url:\s*"\/archive\/"/);
	assert.match(presets, /name:\s*"关于"[\s\S]*?url:\s*"\/about\/"/);
});

test("Zephyr masthead uses a smaller size without changing its anchor position", async () => {
	const styles = await read("src/styles/main.css");
	const copyRule = styles.match(/\.home-atmosphere-copy \{[\s\S]*?\n\}/)?.[0] ?? "";
	const titleRule = styles.match(/\.home-atmosphere-copy h1 \{[\s\S]*?\n\}/)?.[0] ?? "";

	assert.match(copyRule, /top:\s*5\.6rem/);
	assert.match(copyRule, /left:\s*max\(2rem, calc\(\(100vw - var\(--page-width\)\) \/ 2 \+ 1rem\)\)/);
	assert.match(titleRule, /font-size:\s*clamp\(3\.6rem, 7\.6vw, 7\.25rem\)/);
});

test("home atmosphere crossfades to a dedicated night background", async () => {
	const layout = await read("src/layouts/MainGridLayout.astro");
	const styles = await read("src/styles/main.css");

	assert.match(layout, /atmosphere-base-night\.png/);
	assert.match(layout, /home-atmosphere-base-day/);
	assert.match(layout, /home-atmosphere-base-night/);
	assert.match(styles, /\.home-atmosphere-base-night[\s\S]*?opacity:\s*0/);
	assert.match(styles, /\.dark \.home-atmosphere-base-day[\s\S]*?opacity:\s*0/);
	assert.match(styles, /\.dark \.home-atmosphere-base-night[\s\S]*?opacity:\s*1/);
});

test("navbar uses project SVG compass and miner-lamp controls", async () => {
	const navbar = await read("src/components/Navbar.astro");
	const themeSwitch = await read("src/components/LightDarkSwitch.svelte");

	assert.match(navbar, /compass\.svg/);
	assert.match(navbar, /random-post-switch/);
	assert.match(themeSwitch, /miner-lamp-off\.svg/);
	assert.match(themeSwitch, /miner-lamp-on\.svg/);
});

test("compass navigates to a random published post and is inert without posts", async () => {
	const navbar = await read("src/components/Navbar.astro");

	assert.match(navbar, /getSortedPostsList/);
	assert.match(navbar, /filter\(\(post\) => post\.data\.draft !== true\)/);
	assert.match(navbar, /id="random-post-switch"/);
	assert.match(navbar, /disabled=\{randomPostUrls\.length === 0\}/);
	assert.match(navbar, /Math\.floor\(Math\.random\(\) \* postUrls\.length\)/);
	assert.match(navbar, /window\.location\.assign\(postUrls\[randomIndex\]\)/);
});
