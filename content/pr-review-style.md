# PR Review Style Guide

> Extracted from dillon-wispr's actual PR comments (538 line-level comments + 65 PR review bodies, Aug 2025 – Mar 2026). Future agents should use this as a checklist when reviewing PRs.

---

## 1. PR Description Quality

**Pattern:** PRs must have meaningful descriptions. Empty sections, vague titles, or missing context are consistently called out.

**Feedback to give:**
- "Please either use the PR template or remove empty sections if you intend not to use it. These descriptions become the merge commit message — it's important to keep them clean for a clean git history."
- "Prefer a 'Why' and 'What Changed' in PR description for clean git history."
- "nit: a habit of more relevant PR titles like 'feat: Onboarding refresh design tweaks' would be helpful so that the commit history on staging makes more sense when we look back at it."
- "As PR throughput continues to rise, I think descriptive (but not verbose) PR descriptions will become more and more important for well-formed history. Could you update the description and remove unused sections?"

**Rules:**
- Use the PR template from `.github/pull_request_template.md`
- Remove sections that do not apply rather than leaving them empty
- PR title format: `type(area): description` — imperative mood, lowercase description
- Include a "Why" — describe the motivation, not just the implementation
- Generally include a loom or screencap for significant visual changes

**See also:** PR #5428, #4840, #4536

---

## 2. Dead Code, Unused Imports, and Unused Variables

**Pattern:** The most consistently flagged issue across all PRs. Dillon flags unused imports, unused variables, commented-out code, and dead code paths immediately.

**Feedback to give:**
- "Make sure to remove unused imports"
- "make sure to remove unused vars"
- "remove unused code"
- "Avoid leaving commented code; it lives in the Git history."
- "This is dead code"
- "remember to remove this comment"
- "remove logs"
- "remove log or use rendererlogger"

### Example
```tsx
// Bad
import { useState, useEffect, useCallback } from 'react' // useCallback never used
// const oldImplementation = () => { ... }
console.log('debug value:', value)

// Good
import { useState, useEffect } from 'react'
```

**See also:** PR #3524, #3708, #3450, #4459

---

## 3. Classname Composition — Use the `c()` Utility

**Pattern:** Repeatedly flagged across many PRs. The repo has a `c` utility (clsx-like) for composing classnames. Dillon flags ternaries, string concatenation, and manual classname building every time.

**Feedback to give:**
- "You can use `c` to do this in a much more readable way"
- "Generally building `classNames` and function components is not needed if you have the right utilities at hand. This is exactly what `c` is for."
- "In general prefer `c` for simplicity and readability"
- "generally, c can live in the jsx."

### Example
```tsx
// Bad
className={`${styles.button} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}

// Bad
const classNames = [styles.button, isActive && styles.active].filter(Boolean).join(' ')

// Good
import { c } from '@/common/utils'
className={c(styles.button, isActive && styles.active, isDisabled && styles.disabled)}
```

**See also:** PR #3151, #3406, #3440, #3450, #4189, #5216

---

## 4. CSS / SCSS Design System Tokens

**Pattern:** One-off hex codes, inline styles, hardcoded font sizes, and raw CSS values that should use design system tokens are flagged consistently.

**Feedback to give:**
- "This is $neutral-800 — please prefer tokens from the design system over one-off hex codes here and throughout this PR."
- "Please consider using scss and using a DS color token even if you have to make an assumption. We need to avoid one-off hexes moving forward."
- "Nit: I understand if this color is in figma and not in the DS but we should probably figure out why and try not to use 1-off hex codes like this"
- "Please use a classname rather than inline style"
- "Is this really designed at 80px? Generally, you should just be able to use `heading-serif(xl)` and omit all of the font related properties here."
- "Here and with all text in this file, you really shouldn't need any font properties. You can reach for `body(xxs, medium)` in this case."

**Rules:**
- Use SCSS token variables (`$neutral-800`, etc.) instead of hex codes
- Use typography mixins (`body()`, `heading-serif()`) instead of raw `font-size`/`font-weight`
- Use the `shadow()` mixin instead of custom box-shadow values
- Use `@include smart-animate(0.25s, 0, background-color)` for consistent transitions
- Put styles in the `@component` CSS layer for new components
- Put SCSS mixins as the **first rule** in each class

**See also:** PR #3151, #4539, #4630, #5216, #5222, #5385

---

## 5. CSS — Avoid `!important`

**Pattern:** `!important` is flagged as a code smell virtually every time it appears.

**Feedback to give:**
- "Seems to work without `!important`. In general, it should be avoided if possible."
- "Same here — `!important` should be avoided if possible"
- "avoid !important unless necessary."
- "Assuming you need this, but avoid important if you can"

### Example
```scss
// Bad
.circle {
  border: 1px solid #ffa946 !important;
}

// Good
.circle {
  border: 1px solid #ffa946;
}
```

**See also:** PR #3151, #4417, #4580

---

## 6. CSS — Avoid `z-index` and Stacking Context Issues

**Pattern:** Dillon flags raw z-index usage and suggests using CSS isolation instead.

**Feedback to give:**
- "Avoid z-index unless necessary"
- "This is fine but generally `isolation` can be a less footgunny way to get things to stack right. Great article for future reference: https://www.joshwcomeau.com/css/stacking-contexts/#airtight-abstractions-with-isolation-6"
- "Since the slider is using Z-index internally, we should consider adding `isolation: isolate` on the root to create a stacking context and avoid z-fighting later"

**See also:** PR #3889, #4375, #4964

---

## 7. useEffect Misuse — Prefer Explicit Callbacks

**Pattern:** Dillon dislikes effects that trigger side effects based on state changes when an explicit function call is clearer.

**Feedback to give:**
- "Rather than trigger this with an effect that watches user id, can you just expose a `reset()` or `clear()` fn from the context and call it in the logout function. This is more explicit and predictable. Generally, bundling all this kind of logic inside an effect is hard to debug when there comes to be a lot of it."
- "This useEffect doesn't do anything. What's the purpose?"
- "In general, I would prefer that stuff like this be contained within hooks to avoid creating a giant [Component] with many many effects."

### Example
```tsx
// Bad — effect watching userId to reset state
useEffect(() => {
  if (!userId) {
    resetState()
  }
}, [userId])

// Good — explicit call at the logout site
const reset = () => { resetState() }
// call reset() directly from logout handler
```

**See also:** PR #4843, #3406, #3524

---

## 8. Extract Logic to Hooks

**Pattern:** Dillon consistently pushes to extract complex logic (especially event listeners, animations, IPC subscriptions) into dedicated hooks so components stay focused on rendering.

**Feedback to give:**
- "Make sure to clean up the listeners. Additionally, we should move towards more hygienic patterns — would be best to abstract this into a `useCelebrationAnimation` hook rather than bloating the sidebar with it."
- "I would prefer this logic be extracted to a hook to keep the hub home page render clean."
- "This effect should be a `useConfetti` hook shared with the other places it is called than duplicated here"
- "Consider ebstracting this complicated refresh logic to a `useWasSubscriptionRefreshed` hook"
- "This `DoubleTapModal` encapsulates two things: 1. logic that determines state transitions based on user input. 2. the return which defines what to render. [...] note to try experimenting with encapsulating #1 in a hook"

**Rules:**
- If a component has more than one or two effects, consider extracting them to hooks
- Animation / event listener logic belongs in a hook, not directly in the component
- Use `useRegisterIPCListener` (existing hook) instead of manually managing IPC listeners

**See also:** PR #3306, #4539, #4669, #4502, #3609, #3717

---

## 9. Single Responsibility — Extract Components

**Pattern:** Dillon flags components and utility files that try to do too many things.

**Feedback to give:**
- "Could you encapsulate this overlay component and state into its own component so it does not obfuscate renderer.tsx"
- "This should be its own component in its own file with its own scss module"
- "This file feels like a mix of types and util functions. Consider separating."
- "Let's keep utils separate from constants"
- "nit: supporting types, functions, and subcomponents can go below the main component. That way, when you open the file, it's easy to understand what the main export is."

**See also:** PR #3524, #4297, #4616

---

## 10. DRY / Code Duplication

**Pattern:** Repeated logic, duplicated constants, and copy-pasted code blocks are consistently flagged.

**Feedback to give:**
- "Can we get this as a `removeDelimiter` fn to keep it DRY"
- "Rather than adding a function that does the same thing as `OpenHistory`, I would just rename `OpenHistory` to `openHome` and use it in both places."
- "This logic is duplicated, you could consider abstracting it to a `useNormalizedAttribution` items hook"
- "Would be ideal to extract this color to a variable to keep it organized and DRY"
- "There is a lot of code duplication at the beginning of these pages in onboarding."
- "Duplication of cursor like check."

**See also:** PR #3527, #3450, #3558, #3151

---

## 11. Naming Conventions

**Pattern:** Dillon is precise about naming — event handler naming, variable names that accurately reflect their purpose, and avoiding abbreviations.

**Feedback to give:**
- "nit: prop event handler pattern should be `on` for the prop and `handle` for the handler. https://react.dev/learn/responding-to-events"
- "recommend using `notification` rather than `notif`"
- "These don't seem to be jitter amounts. They seem to be timeouts, right? If so, please name them as such."
- "Post onboarding *what* timeout? [Name should be more specific]"
- "The map variable `app` probably makes more sense called `group`"
- "I would call this an illustration, not an icon"

### Example
```tsx
// Bad
const onRepolishControlClicked = ...
const notif = notifications[0]
const JITTER_AMOUNT = 5000 // it's actually a timeout

// Good
const handleRepolishControlClicked = ...
const notification = notifications[0]
const POST_ONBOARDING_TIMEOUT_MS = 5000
```

**See also:** PR #4272, #3524, #3419, #4502

---

## 12. TODOs Must Have Owners

**Pattern:** Ownerless TODOs are flagged as "litter." The preferred format includes the author's name.

**Feedback to give:**
- "Is this todo still relevant? Also I picked up a habit from one of our interview candidates — I think we should start including an owner `// TODO(dillon): xyz` so these don't become litter."
- "Yeah, rather than removing this, please change it to `// TODO(dillon):` and moving forward we can try to own todos like that."

### Example
```ts
// Bad
// TODO: fix this

// Good
// TODO(dillon): fix this — needs to be resolved before v4 launch
```

**See also:** PR #4272, #4539

---

## 13. Comments — Explain "Why", Not "What"

**Pattern:** Comments that describe what the code does (obvious from reading) are removed; comments that explain *why* something non-obvious is happening are encouraged.

**Feedback to give:**
- "please add a comment about why you check post onboarding"
- "Add comment about why this is a flow bundle id"
- "update the comment since this is no longer cursor specific"
- "correct comment [and] include why"
- "love this kind of explainer comment for curious properties"
- "Maybe include a comment above noting this so that future maintainers understand"

**See also:** PR #3524, #3527, #3627, #4964

---

## 14. TSDoc for Public Functions

**Pattern:** Exported / public-facing functions should have TSDoc comments so callers get hover hints.

**Feedback to give:**
- "For external facing fns, tsdoc is nice to give callers hints on how to use correctly and what it is for."
- "Consider using a tsdoc for this comment and other long comments so that callers can read on hover"
- "use tsdoc for this comment"
- "Would prefer a small tsdoc for each of these sub components just describing what it is in a sentence."

### Example
```ts
// Bad
// Gets the appropriate personalization style settings
export const getPersonalizationStyleForCurrentApp = () => { ... }

// Good
/**
 * Gets the appropriate personalization style settings for the current app context.
 */
export const getPersonalizationStyleForCurrentApp = (): PersonalizationStyleSettings | null => { ... }
```

**See also:** PR #3200, #3316, #3381, #4297

---

## 15. Logging — No Raw `console.log`, Use Structured Logging

**Pattern:** Raw `console.log` calls should be removed before merging. When logs are kept, they should use the structured logger (`rendererLogger` on the renderer side) and follow a consistent `[Source] message` format.

**Feedback to give:**
- "remove logs"
- "remove log or use rendererlogger"
- "Make sure this doesn't log anything sensitive"
- "For consistency, all the log.info logs could [use something like]: `[Cursor Integration] No helper request sent to enable screen reader mode: CursorIntegration feature flag is off`"
- "If you're going to use a `[SOURCE]` like this, consider using it in all the logs within this function. Otherwise, it's creating confusion."
- "Would these logs benefit from a `[source]`?"

**See also:** PR #3114, #3419, #3368, #3708

---

## 16. Spell Checking

**Pattern:** Typos in code, comments, and copy are flagged and Dillon recommends installing a spell checker extension.

**Feedback to give:**
- "Recommend https://marketplace.cursorapi.com/items/?itemName=streetsidesoftware.code-spell-checker"
- "Same spelling error as above"

**Common typos spotted:** "Adressed" (Addressed), "showPersonalizationDialog" (misspelling in variable name), "Pasting text helper immediate clipboard" (missing word)

**See also:** PR #3200, #3384, #3362, #3368

---

## 17. Hardcoded Values — Extract to Constants

**Pattern:** Magic numbers, repeated string literals, and in-scope constants that are used in multiple places should be extracted.

**Feedback to give:**
- "If this number is used anywhere else, consider extracting it to a constant."
- "We should store default ports like 5432 centrally so that if they change in an env or package.json or anywhere else, they are easy to change here."
- "If we continue to do this, would love to see an `isFlowBundleId` fn"
- "would love this in a util file `isFlowApp(bundleId)`"

**See also:** PR #4910, #3450, #3524

---

## 18. TypeScript Type Hygiene

**Pattern:** Unnecessary type casts, overly broad types, and missing nullability are flagged.

**Feedback to give:**
- "Why is this cast needed? I see `isActive` typed as boolean without it."
- "Didn't look far into it but these kind of casts are generally undesirable."
- "Remove this cast unless it is necessary"
- "If `enterprise_subscription` can be `None` here, consider updating the parameter type"
- "Why do you need to type the user object if the `_get_user_by_id` function already returns `User | None`?"
- "Nit: I wonder if a generic type in `onChange` could help you avoid this cast."

**See also:** PR #3151, #3614, #4042, #3955, #4480

---

## 19. React Event Handler Prop Naming

**Pattern:** React event handler props must follow the `on` / `handle` convention without exception.

**Rule:** Props that accept callbacks should be named `on[Event]` (e.g., `onToggle`, `onAdd`). The implementation function should be named `handle[Event]` (e.g., `handleToggle`, `handleAdd`).

### Example
```tsx
// Bad
<Component repolishControlClicked={fn} />
const onRepolishControlClicked = ...

// Good
<Component onRepolishControlClick={fn} />
const handleRepolishControlClick = ...
```

**See also:** PR #4272, #4146

---

## 20. Dialog / Modal — Controlled Open State (No Conditional Render)

**Pattern:** Dialogs/modals must be controlled components with `isOpen` passed from the parent, NOT conditionally rendered. Conditional rendering destroys the animation.

**Feedback to give:**
- "for this Dialog and the other, you'll want to pass the `isOpen` and `close` props through so the parent can manage open state. The reason is because if you conditionally render it like this, it loses its animation."
- "Your dialog is snapping in and out rather than animating because you are conditionally rendering the whole thing. I suggest making this component controlled and passing the isOpen prop up through the parent. Take a look at how the DialogWrapper is used elsewhere in this app."
- "This has the same problem as my previous comments on dialogs."

### Example
```tsx
// Bad
{isOpen && <MyDialog onClose={() => setIsOpen(false)} />}

// Good
<MyDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

**See also:** PR #4227, #4375, #4580, #4400

---

## 21. Feature-Scoped vs. Shared Components

**Pattern:** Components should live at the feature level until they are genuinely needed by multiple features. Premature promotion to `components/` is flagged.

**Feedback to give:**
- "Awesome that this is broken into a subcomponent, but unless there's a strong reason I don't think it should live in `components/` — it can live as a 'feature component' `pages/onboarding/TimeSavings/components/` until a future feature warrants sharing it."
- "Do not agree about moving out to components. These should stay local to this feature until reuse is needed"
- "Not for this PR, but could see this being extracted to a component [when reuse warrants it]."

**See also:** PR #4964

---

## 22. Storybook Story Quality

**Pattern:** Stories must be useful and interactive. Redundant `argTypes`, missing backgrounds for light components, and non-interactive controlled stories are all flagged.

**Feedback to give:**
- "you don't need any of these argTypes. The control types will be inferred and the descriptions will come from the existing tsdocs. This is all redundant."
- "Nit: most times, sb can infer these. Try removing them to see if you still get the control type you want."
- "Please do a pass on these stories to make them useful. 1. Stories with a light button should have a dark background so you can see them. 2. You can use argTypes to turn the `theme` prop control into a select rather than a textbox (cmd f for examples)"
- "You can use `useArgs` to achieve this — a controlled component in storybook where both the story controls and component work. See `TabContainer.stories.tsx`."
- "Love that these pages are stories especially because they are in onboarding which is hard to repro and navigate to test changes."

**Rules:**
- Control types and descriptions are inferred from TSDoc — don't duplicate them in `argTypes`
- For controlled components (toggles, checkboxes), use `useArgs` so the component responds to clicks in SB
- Light-colored components need a dark background in their story
- For stories with variants, use `argTypes` with a `select` control
- Use Storybook `parameters.layout: 'centered'` and `globals.backgrounds` instead of decorators

**See also:** PR #4285, #4630, #5199, #5428

---

## 23. `yarn.lock` — Don't Commit Unintended Changes

**Pattern:** Yarn lock changes are flagged immediately when they appear in a PR that shouldn't affect dependencies.

**Feedback to give:**
- "Please remove the yarn lock from this change"

**See also:** PR #5267

---

## 24. Animation — Use Motion, Use Shared Primitives

**Pattern:** Ad-hoc animation using refs and inline styles is flagged. The app uses Framer Motion. Centralized spring/animation configs are desired.

**Feedback to give:**
- "would you consider a more canonical callback name for this? Also, the fact that this component sets inline styles on a parent component has some code smell. And can the animation be achieved through `motion` rather than setting inline styles on a ref with an effect?"
- "Not for this PR but future: we should consider centralizing, or at least allowing folks to reach for a default spring to drive consistency when using Motion."
- "To keep transitions consistent, you can consider using `@include smart-animate(0.25s, 0, background-color);`"

**See also:** PR #4272, #4964, #3291

---

## 25. Network Requests — Use `net.request()` in Desktop, Not Axios

**Pattern:** The desktop Electron app uses `net.request()` for all network calls. Axios is not used.

**Feedback to give:**
- "we don't use axios for network requests, all network requests are done with `net.request()`. Suggest removing this functionality if it is unused."

**See also:** PR #4617

---

## 26. React Query / Redux — Prefer RQ for Data Fetching

**Pattern:** Dillon actively encourages migration from manual fetch/setState/error-handling to React Query (RQ).

**Feedback to give:**
- "Have you used react query or redux before? This repo is currently using redux to fetch and handle error states like this. I'd like it to move to react query instead. In general, these solutions are available to avoid writing this same fetch, set state, handle error code over and over and to do so more robustly."
- "rq ftw so glad you added this"
- "why not use `onError` on RQ?"
- "This is a great example PR for how RQ and RT simplify code and reduce the amount of code we need. Love this."

**See also:** PR #4480, #4375, #4580

---

## 27. Pydantic Enums over Manual Validation (Python/Backend)

**Pattern:** On the Python backend, Dillon prefers using Pydantic enums with automatic 422 validation over manual conditional checks.

**Feedback to give:**
- "Have you considered relying on an enum for `platform` and then letting Pydantic return 422 when `data.platform` is outside that enum? Seems like: input validation could happen implicitly by the route using this enum (removing the conditional)"
- "The original code need not use `.lower()` and really should be using an enum anyway."

**See also:** PR #3106, #3813

---

## 28. Security — Sanitize Input, Avoid Sensitive Logs

**Pattern:** Dillon calls out potential security issues: sensitive data in logs, text from the accessibility API being sent without sanitization, and XSS risk.

**Feedback to give:**
- "Make sure this doesn't log anything sensitive"
- "This is a note to think about sanitizing text from the accessibility API or text that's snagged from the user's computer in general before sending it anywhere."
- "I thinks there is xxs risk here." [XSS]

**See also:** PR #3151, #3631, #4298

---

## 29. Copy / UX Writing Quality

**Pattern:** Notification and UI copy is reviewed for clarity and style. Redundant labels, ugly apostrophes (escaped `\'` instead of typographic `'`), and sentence case are flagged.

**Feedback to give:**
- "Use sentence case" (for notification action buttons)
- "can we use fancy apostrophes instead? these are so ugly" — prefer typographic `'` over `\'`
- "You can typographers quotes instead of this escape character. ' https://www.typewolf.com/cheatsheet"
- "Simpler copy" (Dillon often suggests trimming wordier notification bodies)
- "IMO it's a little unpolished to use the 'reminder:' here. It's clear that the notification is a reminder."
- "How about 'Your built-in mic won't work when the lid is closed'" (prefers plain English)

### Example
```ts
// Bad
title: 'Reminder: Use Flow with your mouse!',
actions: [{ text: 'Change Mic' }] // title case

// Good
title: 'You can Flow with your mouse!',
actions: [{ text: 'Change mic' }] // sentence case
```

**See also:** PR #3757, #3216, #3330, #4630, #5216

---

## 30. Variable Declarations — Use `const` by Default

**Pattern:** Dillon flags `let` used for variables that never change and encourages `const` as the default.

**Feedback to give:**
- "I think you can use `const` if these aren't expected to change. Probably a good habit to get into?"
- "Applies to any unchanging `vars` in the PR."

**See also:** PR #3368

---

## 31. Avoid `useMemo` for Trivial Computations

**Pattern:** `useMemo` for simple/fast calculations is flagged as unnecessary overhead.

**Feedback to give:**
- "this calculation is so fast, it likely doesn't even need to be in a memo."

**See also:** PR #3406

---

## 32. Function Declarations — Prefer Arrow Functions

**Pattern:** The codebase uses arrow functions as the standard. Named function declarations (`function foo()`) are not preferred.

**Feedback to give:**
- "We mostly [use] arrow functions. Open to this notation if you feel strongly about it but best to be consistent imo."

### Example
```ts
// Non-standard in this codebase
function isDomainBlockedError(data: unknown) { ... }

// Preferred
const isDomainBlockedError = (data: unknown): data is { code: 'DOMAIN_BLOCKED' } => { ... }
```

**See also:** PR #4400

---

## 33. Prop Interfaces — Prefer Inline Types for Component Props

**Pattern:** Explicit `interface Props {}` for component props is questioned. Inline prop typing is preferred unless the type is reused externally.

**Feedback to give:**
- "I know that we have historically used an interface for props but I really question the value of it until you actually need to use that prop type for something. I prefer inline prop typing because it ties the type definition to the component making it easier to move around. We can still retrieve it later using `React.ComponentProps<typeof Component>` if we need the type in a pinch."

### Example
```tsx
// Less preferred
interface Props { label: string; onToggle: () => void }
const MyComponent = ({ label, onToggle }: Props) => { ... }

// Preferred
const MyComponent = ({ label, onToggle }: { label: string; onToggle: () => void }) => { ... }
```

**See also:** PR #4919

---

## 34. IPC Listeners — Use `useRegisterIPCListener`

**Pattern:** Manual IPC listener registration in `useEffect` should use the existing `useRegisterIPCListener` hook instead.

**Feedback to give:**
- "You can use `useRegisterIPCListener` for this"

**See also:** PR #3609, #3717

---

## 35. Form Validation — Use Zod

**Pattern:** Dillon encourages Zod for validation over custom validation logic.

**Feedback to give:**
- "Not required but something to think about is using https://zod.dev/ if this validation gets a lot more complicated in the future!"
- "I would love if we could evangelize zod a little bit so that people stop writing custom form validation code"
- "Something to think about for future instances where we insert complex data from a feature flag (that anyone can change) is using zod (which I added recently) to validate it and fall back if invalid."

**See also:** PR #4227, #4375, #3558

---

## 36. Asset Organization — Icons vs. Illustrations

**Pattern:** SVGs and images should be organized correctly. Decorative graphics are illustrations, not icons.

**Feedback to give:**
- "These are not really icons. I would group them into a folder under illustrations."
- "I would call this an illustration, not an icon"
- "You can use lucide icons now instead" (for standard UI icons)

**See also:** PR #4539, #4502, #5216

---

## 37. Unit Tests for Non-Trivial Logic

**Pattern:** Complex utility functions (especially retry/timeout/jitter logic) should have unit tests.

**Feedback to give:**
- "I'd like to see a unit test for this fn that confirms it works with many variations of the options provided. Doing so would help us feel more confident that timeout, retry, and jitter logic is actually having an effect in prod."

**See also:** PR #3419

---

## 38. Conditional Cancellation / Guards — Only Act When Necessary

**Pattern:** Unconditional teardown or side effects that could be guarded are flagged.

**Feedback to give:**
- "If you cancel the dictation unconditionally, it leads to unnecessary teardown. Really, you don't need to cancel dictation unless it is actually happening."

**See also:** PR #3172

---

## 39. Thread.sleep / Blocking Calls

**Pattern:** `Thread.sleep` in Swift/C# blocks the IPC send/receive thread and is discouraged.

**Feedback to give:**
- "Thread.sleep is not ideal here because it blocks send and receive from the electron app."
- "Not sure how we do it on Windows but I wonder if there's a similar sentiment to the comment you left on my PR regarding scheduling these calls rather than thread.sleep."

**See also:** PR #3335, #3384

---

## 40. Component API Design — Discrete Size Variants, Not Raw Numbers

**Pattern:** Component props for size should use named variants (`sm`, `md`, `lg`) rather than raw numbers, so consumers cannot create inconsistent configurations.

**Feedback to give:**
- "Please break size into 'sm', 'md' etc. for the current use cases rather than providing a number."
- "Rather than providing a prop to configure this number, you can use the size prop with its discrete values to configure this gap inside the component. The reason is because it's very hard to use the size and icon padding props in a consistent way across the app."

**See also:** PR #5433

---

## Summary Checklist

Before approving a PR, verify:

- [ ] PR title follows `type(area): description` format; description is meaningful
- [ ] No unused imports, variables, or commented-out code
- [ ] Classnames use `c()` utility, not string concatenation or ternaries
- [ ] CSS uses design system tokens (no one-off hex codes, no inline styles)
- [ ] No `!important` in SCSS
- [ ] No raw `z-index` without justification
- [ ] No `useEffect` doing what an explicit callback would do better
- [ ] Complex logic extracted to hooks, not inline in components
- [ ] No duplicated logic or constants that should be extracted
- [ ] Event handler props use `on` / `handle` convention
- [ ] Dialogs use controlled `isOpen` (not conditional render)
- [ ] New components live at feature scope, not prematurely in shared `components/`
- [ ] Storybook stories are interactive, have correct backgrounds, and are non-redundant
- [ ] `yarn.lock` not included unless dependencies genuinely changed
- [ ] No `console.log` — use structured logger with `[Source]` prefix
- [ ] Typos checked (install Code Spell Checker extension)
- [ ] TODOs have owners: `// TODO(name): ...`
- [ ] Public functions have TSDoc
- [ ] Copy uses sentence case, typographic apostrophes, and plain language
- [ ] `const` used for non-reassigned variables
- [ ] For significant visual changes: screencap or Loom link in PR description
