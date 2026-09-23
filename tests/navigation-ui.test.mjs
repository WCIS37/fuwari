import assert from "node:assert/strict";
import test from "node:test";

import {
	getPrimaryRoute,
	syncPrimaryNavigation,
} from "../src/utils/navigation-ui.mjs";

test("classifies primary routes independently from query strings and hashes", () => {
	const cases = [
		["/", "home"],
		["/2/", "home"],
		["/archive/", "archive"],
		["/archive/?tag=Astro#posts", "archive"],
		["https://example.com/about/?from=nav#bio", "about"],
		["/posts/helloworld/", "post"],
		["/missing/", "other"],
	];

	for (const [pathname, expected] of cases) {
		assert.equal(getPrimaryRoute(pathname), expected, pathname);
	}
});

test("synchronizes current navigation and removes stale state", () => {
	const makeLink = (route) => ({
		dataset: { primaryRoute: route },
		attributes: new Map([["aria-current", "page"]]),
		removeAttribute(name) {
			this.attributes.delete(name);
		},
		setAttribute(name, value) {
			this.attributes.set(name, value);
		},
	});
	const links = [makeLink("home"), makeLink("archive"), makeLink("about")];
	const root = { querySelectorAll: () => links };

	syncPrimaryNavigation(root, "/archive/");

	assert.equal(links[0].attributes.has("aria-current"), false);
	assert.equal(links[1].attributes.get("aria-current"), "page");
	assert.equal(links[2].attributes.has("aria-current"), false);

	syncPrimaryNavigation(root, "/posts/helloworld/");
	assert.equal(links.every((link) => !link.attributes.has("aria-current")), true);
});
