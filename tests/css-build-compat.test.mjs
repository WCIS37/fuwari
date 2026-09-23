import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("markdown styles do not @apply component classes from another stylesheet", async () => {
	const css = await readFile(
		new URL("../src/styles/markdown.css", import.meta.url),
		"utf8",
	);

	assert.doesNotMatch(css, /@apply[^;]*(?:\slink\s|\sbtn-regular-dark\s)/);
});
