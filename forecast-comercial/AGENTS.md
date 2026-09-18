# This is NOT the Next.js you know

This project uses Next.js 16. Breaking changes vs. training data include:
`middleware.ts` → `proxy.ts` (export `proxy`, not `middleware`), `cookies()`/`headers()`/`params`/`searchParams` are
always async (`await` required, no sync fallback). Read `node_modules/next/dist/docs/` before assuming an API's
old shape.
