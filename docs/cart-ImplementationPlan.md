## Cart Feature — Implementation Plan

This document follows the guidance in `.github/prompts/plan.prompt.md` and describes a concrete plan to add cart functionality to the project using the provided `cart.png` asset (place under `frontend/public` or `frontend/src/assets`).

---

Checklist (requirements extracted from the request)
- Create a plan following the `plan.prompt.md` template: Done
- Use `cart.png` as design reference/asset: Done (referenced; file placement recommended)
- Analyze current codebase and impacts: Done
- Produce implementation steps and tests: Done
- Save plan as `docs/cart-ImplementationPlan.md`: Done

---

## Change Requirements

Add a user-facing shopping cart to the frontend with the following capabilities:
- Add / remove / update item quantities
- Persist cart client-side (localStorage) and optionally server-side (cart API)
- Show cart summary (subtotal, discounts, shipping, total)
- Support coupon input and validation UI (server or mocked validation)
- Integrate checkout flow that creates an Order via the existing `api` backend
- Use the provided `cart.png` for UI layout and styling guidance

Contract (small):
- Inputs: product id, quantity, coupon code
- Outputs: cart state (items/summary), created Order on checkout
- Error modes: invalid product, out-of-stock, failed network calls, validation errors
- Success: cart updates reflected in UI and persisted; checkout returns created order id

Assumptions
- We'll implement a client-first cart using localStorage; server-side persistent carts are optional and added later.
- The backend `api` already exposes `order` endpoints (`api/src/routes/order.ts`) that can be used for checkout.
- The application uses React + Vite as shown in `frontend/` and tests with Vitest.

## Clarifying Questions (before implementation)
- Do you want server-side persistent carts (per-user) immediately, or is localStorage sufficient for MVP?
- Is coupon validation expected to be implemented in the API, or should it be mocked on the frontend initially?
- Should the cart UI be a page (`/cart`) only, or include a cart drawer and cart page both?

If you prefer, I can implement the MVP client-side cart first and add server persistence in a follow-up.

## Code Analysis — Current Implementation

Relevant areas discovered from the repo tree:
- Frontend: `frontend/src/components` contains `product` components and an empty `cart/` folder — good place to add cart components.
- Frontend API client config: `frontend/src/api/config.ts` — reuse for cart/checkout network calls.
- Backend: `api/src/routes/order.ts`, `api/src/models/*` include `order`, `orderDetail` models — existing endpoints will support checkout.
- Tests: Vitest is configured (`api/vitest.config.ts`), frontend uses Vitest in the repo guidelines.

Design patterns & organization notes:
- Frontend uses React + contexts in `frontend/src/context/` (there's an `AuthContext.tsx` and theme context). A `CartContext` fits naturally.
- Backend uses Express routes under `api/src/routes/` and simple models in `api/src/models/`.

Current test coverage:
- No cart-specific tests exist; product/route tests exist (e.g. `routes/branch.test.ts`). We'll add unit tests for cart logic and a small integration test for checkout.

## Impact Analysis

Files / components to change or add (high-level):
- frontend/src/context/CartContext.tsx — cart state, actions, persistence hooks
- frontend/src/components/cart/CartButton.tsx — header/cart icon with quantity badge
- frontend/src/components/cart/CartDrawer.tsx — slide-out cart UI matching `cart.png`
- frontend/src/pages/CartPage.tsx — full cart page (optional but recommended)
- frontend/src/components/cart/CartItem.tsx — per-item row with quantity controls
- frontend/src/components/cart/CartSummary.tsx — order summary, coupon input, checkout button
- frontend/src/api/cartClient.ts — client wrappers for coupon validation and checkout
- api/src/routes/cart.ts (optional) — server-side cart endpoints (get/save/merge) if persistence desired
- api/src/models/cart.ts (optional DB model) — if persistent carts required
- tests: frontend tests in `frontend/src/components/cart/*.test.tsx`, backend tests for cart endpoints if added

Potential side effects / risks:
- Race conditions when synchronizing localStorage and context across tabs (mitigate with storage events)
- Incorrect price calculation if product prices change between add-to-cart and checkout (define behavior)
- Adding DB-backed cart requires migrations and changes to `seedData.ts`.

Database / API changes:
- MVP requires no DB changes (client-side cart + checkout uses existing Order endpoints)
- Optional persistent cart: new `cart` table and endpoints; migration required.

Dependencies on other systems:
- Coupon validation and shipping calculation may rely on backend logic or external services.

Tests to add:
- Unit: cart reducer, CartContext actions, price calculation
- Component: CartDrawer/CartPage rendering, quantity change, coupon input
- Integration: Checkout flow creating an Order via `api` (mock backend or run API during tests)

## Implementation Plan (step-by-step)

Preparation
- Create feature branch: `feature/cart`.
- Place asset: copy `cart.png` into `frontend/public/cart.png` or `frontend/src/assets/cart.png` (choose public for direct use in docs/static).

Frontend — MVP (client-only cart)
1. Add `CartContext.tsx` in `frontend/src/context/`:
   - Expose state: items [{ productId, name, price, qty, image }], coupon, summary
   - Actions: addItem, removeItem, updateQty, applyCoupon, clearCart
   - Persistence: sync state to `localStorage` and listen to `storage` event for multi-tab sync
   - Use reducer pattern (pure functions) so logic is testable
2. Add presentational components under `frontend/src/components/cart/`:
   - `CartButton`: shows badge with total quantity, opens drawer
   - `CartDrawer`: slide-over UI matching `cart.png` (use Tailwind classes already used in project)
   - `CartItem`: row with image, name, unit price, quantity selector, remove button
   - `CartSummary`: subtotal, discount, shipping input, coupon field, checkout button
3. Add `CartPage.tsx` route (optional) at `/cart` for deep links and SEO.
4. Wire cart into app layout: import `CartButton` into `Navigation.tsx` and include `CartContextProvider` in `frontend/src/main.tsx`.

Frontend — API integration (checkout)
5. Create `frontend/src/api/cartClient.ts` with functions:
   - validateCoupon(code): calls backend coupon endpoint or mocks
   - checkout(cart): calls POST `/api/orders` or existing `/orders` endpoint to create an Order
6. On Checkout: map cart items to `order` + `orderDetail` payload expected by `api` routes.

Backend — minimal changes for MVP
7. Use existing `api/src/routes/order.ts` to accept checkout requests. If missing fields, extend the route to accept cart payload.
8. (Optional) Add `api/src/routes/cart.ts` + `api/src/models/cart.ts` for server-side persistent cart per authenticated user.

Testing
9. Write unit tests for cart reducer functions (Vitest) — happy path and edge cases (zero qty, negative qty, empty cart).
10. Write component tests with React Testing Library for `CartDrawer` and `CartItem`.
11. Add an integration test that mocks the API and verifies checkout calls `order` endpoint with expected payload.

CI / Linting / Types
12. Add/extend TypeScript types in `frontend/src/types/` for `CartItem`, `CartSummary`, `CouponResult`.
13. Run lint/typecheck in CI; add pipeline step to run frontend unit tests (Vitest) if not already present.

Docs & Styling
14. Update `frontend/README.md` or `docs/` with cart component usage and developer notes. Include `cart.png` as UI reference.

Integration / Deployment considerations
- If adding server-side cart, plan DB migration and seed updates. Use transactions for checkout.

Estimated Effort
- MVP client-side cart: 8–16 hours (1–2 days)
- Server-side persistence + migrations: additional 8–12 hours

## Considerations and Trade-offs

Performance
- Keep cart operations client-side to avoid extra API latency for normal interactions. Perform validation and final price checks at checkout on the backend.

Security
- Never trust client-side prices during checkout. Recalculate totals on the backend from canonical product prices.
- Sanitize coupon input server-side.

Scalability
- Client-only cart scales trivially. Server-side carts increase DB storage and require session/user linking.

Maintainability
- Use a small, well-tested reducer for cart logic. Keep UI components presentational and move logic into the context/reducer.

Alternatives
- Server-first cart (always persisted) — better for multi-device continuity but higher initial complexity.
- Use an external cart service (SaaS) — not necessary for MVP.

## Edge Cases
- Product price changes between add-to-cart and checkout
- Product removed or out-of-stock at checkout
- Negative or zero quantities
- Concurrent updates in multiple tabs
- Coupon expired or invalid

## Next Steps
1. Answer clarifying questions about server persistence and coupon validation preference.
2. I'll create the feature branch and optionally scaffold `CartContext` and a single `CartButton` component as an initial PR if you want a quick incremental change.
3. After confirmation, implement MVP client-side cart, add component tests, and wire checkout to existing `order` endpoint.

---

Requirements coverage
- Plan file saved to `docs/cart-ImplementationPlan.md`: Done
- Contains clarifying questions: Done
- Contains code & impact analysis: Done
- Contains step-by-step implementation plan: Done

If you want, I can now scaffold the `CartContext` and a `CartButton` component in the repo and run the frontend tests; tell me to proceed and whether you prefer server-side persistence now or later.
