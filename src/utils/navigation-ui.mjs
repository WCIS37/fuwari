const PAGE_NUMBER_PATTERN = /^\/\d+\/?$/;

function toPathname(value) {
	try {
		return new URL(value, "https://minerhut.local").pathname;
	} catch {
		return "/";
	}
}

export function getPrimaryRoute(value) {
	const pathname = toPathname(value);
	if (pathname === "/" || PAGE_NUMBER_PATTERN.test(pathname)) return "home";
	if (pathname === "/archive" || pathname === "/archive/") return "archive";
	if (pathname === "/about" || pathname === "/about/") return "about";
	if (pathname.startsWith("/posts/")) return "post";
	return "other";
}

export function syncPrimaryNavigation(
	root = document,
	pathname = window.location.pathname,
) {
	const activeRoute = getPrimaryRoute(pathname);
	const links = root.querySelectorAll("[data-primary-route]");

	for (const link of links) {
		link.removeAttribute("aria-current");
		if (link.dataset.primaryRoute === activeRoute) {
			link.setAttribute("aria-current", "page");
		}
	}
}
