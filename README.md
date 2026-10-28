# Assessment that Works — SETU CPD

**Module 4** of the SETU Continuing Professional Development series for
part-time and industry-based lecturers. A clean, modern, self-paced SCORM 1.2
course built as a **standalone static site** — no build step, no server
framework, no external dependencies (brand fonts are self-hosted, JS is vanilla).

Built from the *Assessment that Works: Designing Authentic, Fair and Meaningful
Assessment — Articulate Rise build script* (Unit 4), and styled to the **SETU
Online Course Brand Guide** and the *Lifelong Learning at SETU Design Toolkit*.

Derived from [`kenmccarthy/cpd-course-template`](https://github.com/kenmccarthy/cpd-course-template),
which carries the reusable shell (navigation, Rise layer, SCORM plumbing,
animations, accessibility conventions). Fixes to that shell are worth porting
back to the template so later modules inherit them.

**Audience:** Industry-based part-time lecturers with high subject expertise but
limited assessment-design experience.
**Pitch level:** NFQ Level 8 (honours bachelor degree standard), with comparative
notes on Level 7 and Level 9.
**Runtime:** ~30 minutes, 7 sections.

## Sibling modules

| Module | Course | Repository |
|---|---|---|
| 1 | Understanding Module Descriptors | [`cpd-course-module01`](https://github.com/kenmccarthy/cpd-course-module01) |
| 2 | Teaching Online | [`cpd-course-module02`](https://github.com/kenmccarthy/cpd-course-module02) |
| 3 | From Module Descriptor to Teaching Plan | [`cpd-course-module03`](https://github.com/kenmccarthy/cpd-course-module03) |
| 4 | Assessment that Works | this repo |

The shell is shared; each module keeps its own `storeKey`, so a learner's progress
in one never collides with another even when both are served from the same origin.
The script refers back to "an earlier unit" where it builds on learning outcomes
and Bloom's verbs, and again for the Level 7/8/9 comparison; it doesn't depend on
any of them being completed first.

## Course outline

| Section | Topic | Time |
|--------:|-------|-----:|
| 1 | Welcome and outcomes | 2 min |
| 2 | Alignment with learning outcomes, including right-sizing by credits | 7 min |
| 3 | Summative, formative, low stakes and high stakes | 5 min |
| 4 | Authentic assessment and adult learners | 4 min |
| 5 | Rubrics, marking schemes and feedback | 5 min |
| 6 | Assessment in the age of AI | 5 min |
| 7 | Summary and reflective activity | 2 min |

Sections are numbered **1–7** everywhere the learner sees them. Internally each
`<section class="lesson">` keeps a 0-based `data-lesson` id (`0`–`6`) — that id is
what `localStorage` progress and the SCORM bookmark use, so renumbering the display
never disturbs saved progress.

### Theory covered

Biggs' constructive alignment · Bloom's taxonomy, revised by Anderson and Krathwohl ·
ECTS and learner effort · Black and Wiliam on formative assessment · Nicol and
Macfarlane-Dick's self-regulation principles · Gulikers et al.'s five-dimensional
framework for authentic assessment · Knowles's andragogy · Reddy and Andrade on
rubrics · Sadler on knowing what quality looks like · Hattie and Timperley's three
feedback questions · Carless and Boud's feedback literacy · the Perkins et al. AI
Assessment Scale · Lodge et al. on secured and open assessment.

## Checks, reflections and completion

The script has **six quick checks** and **ten reflection fields**, and does not ask
for a graded quiz or a pass mark. So:

- `finalQuiz` in `js/course.config.js` is **empty**; no check is graded.
- The course reports SCORM **`completed`**, never `passed`/`failed`, and **sends no
  score**. `<adlcp:masteryscore>` is omitted from `imsmanifest.xml`.
- The four single-answer checks (`kc1b`, `kc2`, `kc4`, `kc5`) are still written as
  `cmi.interactions.n` entries, so per-question results appear in the LMS. The two
  drag-and-sort checks are tracked as activities.
- If you do want a pass mark, list the question ids in `finalQuiz`, mark those
  checks `data-final`, and restore the manifest line. Everything adapts.

The script supplied feedback for the **correct** answer to each check, and nothing
for a wrong one. The wrong-answer wording, and all of the feedback for the fourth
check, are mine, written from the same reasoning — please read them.

## Interactions (all native, no libraries)

| Activity | Section | Type |
|---|---|---|
| Assessment at Levels 7/8/9 (`levels-tabs`) | 2 | Tabs, keyboard-operable, defaults to Level 8 |
| **Match outcome to evidence** (`outcome-match`) | 2 | Drag, tap or keyboard; nine assessments, three outcomes, one catch-all box |
| Credits to hours (`credits-flip`) | 2 | Three reveal cards |
| Knowledge check: workload | 2 | Single answer with retry |
| **Purpose × stakes matrix** (`matrix-flip`) | 3 | Four quadrants that start unlabelled |
| Knowledge check: formative | 3 | Single answer with retry |
| Four questions about any task (`authentic-flip`) | 4 | Four reveal cards |
| **Sort onto the spectrum** (`spectrum-match`) | 4 | Two boxes, four tasks |
| Knowledge check: feedback | 5 | Single answer with retry |
| Knowledge check: AI | 6 | Single answer with retry |
| Reflections | 1–7 | Ten ungraded prompts, exportable |
| **Echo + action plan** | 7 | Reads the opening answer back, then three sentence stems |

### Figures and components

Inline SVG or CSS, theme-aware: the alignment triangle (§2), the credits-to-effort
bar (§2), the authenticity spectrum (§4), the sample analytic rubric (§5), the
weak-versus-stronger feedback comparison (§5) and the five-step AI-use scale (§6).

## Widgets available to any course

Carried in the shell and used only when a course provides their markup. Each one's
markup contract is documented at the top of its block in `js/interactions.js`.

- **Reveal cards** (`[data-flip]`) — select a card to reveal its back. Used here as
  a row of cards (credits, the four authenticity questions) and, inside a
  `.matrix`, as a 2×2 grid whose quadrants start unlabelled.
- **Echo** (`[data-echo]`) — shows the learner something they wrote earlier, read
  live from saved state and written with `textContent` only.
- **Side-tab explorer** (`.tabs--side`), **checklist with a progress ring**
  (`[data-checklist]`) and **scenario chooser** (`[data-scenario]`) — not used in
  this course.

`[data-match]`, `[data-tabs]`, `[data-flip]`, `[data-checklist]` and
`[data-scenario]` are all keyed by their attribute value, which becomes the
`interaction.complete` id, so a page can carry several of each. Add a widget's id
to `activities` in `js/course.config.js` if it should count toward *activities
explored*.

The matching widget takes distractors: a token whose `data-level` matches no drop
is wrong everywhere, so give the exercise a catch-all box (the outcome match here
uses `weak`). An optional `data-perfect="…"` replaces the default "perfect!".

## Rise-style learner experience (Lifelong Learning at SETU look)

The template follows the Articulate Rise pattern and the *Lifelong Learning at SETU
Design Toolkit* (see `docs/design-toolkit.md`):

- **Course overview page** — the front door: a Slate Grey hero with a gradient
  **U-shape** panel (title, subtitle, tagline "LEARN MORE. GO FURTHER."), a large
  cropped **gradient crest**, a *Start / Continue* button, and **lesson cards**
  showing duration and live status (not started / in progress / completed) with a
  progress bar. Also reachable from the sidebar's "Course overview" item.
- **Hero banner per lesson** — every lesson opens with the *same treatment as the
  overview*: a Slate Grey block with a gradient **U-panel** (eyebrow "Section N of 7",
  title, read time), the large cropped **gradient crest**, and a progress strip on
  the right (one segment per section, completed ones in Grass Green) with a
  "N of 7 sections completed" line. The eyebrow and strip are rendered by
  `js/rise.js` from `Course.SECTIONS`, so the counts are never hand-typed. To add a
  cover photo, place `<img class="hero__bg" src="assets/…" alt="">` as the first
  child of the `.hero` element — it sits behind the crest at reduced opacity.
- **Continue-button reveal** — lesson content is paced in chunks separated by
  `<div class="gate" data-gate></div>` markers. Each *Continue* reveals the next chunk
  with a staggered entrance and scrolls to it; the lesson's Next/Previous bar appears
  only after the last gate. Progress through the gates persists and feeds the lesson
  cards. `Course.rise.revealAll(lessonEl)` opens a lesson fully (testing/accessibility).
- **Horizontal slide transitions** — lessons slide in from the right (forward) or the
  left (back) with a crossfade; a plain swap under `prefers-reduced-motion`. The
  outgoing lesson is pinned at the scroll position the learner was reading (so that
  part is what slides away), the scroll reset is instant rather than smooth, and
  blocks already in view settle at once instead of staggering in on top of the slide —
  one motion per page change, no judder.
- **Rise block layout** — a wider 900px content column for full-bleed blocks, with prose
  held to a ~70-character measure for readability.

### Programme colour year

`programmeYear` in `js/course.config.js` selects the Lifelong Learning accent trio
(always on Slate Grey + White). It drives section accents, tints, mesh gradients,
heroes and cards:

| Year | Accent trio |
|---|---|
| `"2026/27"` (default) | Heather Purple · Sunset Red · Clover Pink |
| `"2027/28"` | Barrow Blue · Suir Blue · Grass Green |
| `"2028/29"` | Sea Green · Sunrise Yellow · Suir Blue |

Section accents cycle through the trio via `data-accent="1|2|3"` on each lesson.
Semantic colours stay fixed (Grass Green = correct, Sunset Red = incorrect).

### Tagline font

The campaign tagline uses **Compressa Condensed Black**, a licensed face. Drop
`assets/fonts/compressa.woff2` into the repo to enable it; until then it falls back to
DM Sans Bold. Set `showTagline: false` in the config to hide the tagline entirely.

### Icons

All UI icons come from a single **inline SVG sprite** at the top of `index.html`
(24px line icons adapted from Lucide, ISC licence) — no emoji, no icon font, no
external requests, so they render identically on every OS and LMS. Use one with

```html
<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>
```

or from JavaScript with `Course.icon("check")`. Icons are decorative (the adjacent
text carries the meaning); add new `<symbol id="i-…">` entries to the sprite as
needed. Sizing follows the surrounding font size (`.icon` = 1.05em) with a few
context overrides in `css/styles.css` under *Icons + accessibility utilities*.

## Accessibility

The template is built to WCAG 2.1 AA and audited with axe-core (no violations
across the overview, lessons and the dark theme). Conventions to keep when
authoring new courses:

- **Landmarks & skip link** — `<main id="scroll">`, `<nav aria-label="Course
  sections">`, and a "Skip to course content" link that appears on keyboard focus.
- **Page changes are announced** — a visually hidden live region (`#a11yStatus`)
  receives "Section N of 7: …", "Course overview", "More of this section revealed"
  etc. via `Course.announce(text)`; focus moves to the new lesson's `<h1>` (or the
  newly revealed chunk after *Continue*) so screen-reader and keyboard users land on
  the new content. The active navigation item carries `aria-current="page"`.
- **Real widget semantics** — the level explorer is an ARIA tab list (roving
  tabindex, ←/→/Home/End); reveal cards are real `<button>`s with `aria-expanded`,
  and the hidden face is genuinely hidden until it opens; knowledge-check options
  are grouped under their question, feedback and scores are `role="status"`;
  reflection textareas are labelled by their prompt; matching tokens are
  keyboard-operable buttons and every placement/removal is announced.
- **Rubric table** — a real `<table>` with a caption, `scope="col"` and
  `scope="row"` headers, inside a focusable, labelled scroll region so keyboard
  users can reach the columns that overflow on a phone.
- **Label in Name** (WCAG 2.5.3) — each lesson card on the overview takes its
  accessible name from its visible content rather than a separate `aria-label`, so
  a voice-control user can say what they see. Only a "Section" prefix and the
  revealed percentage are added, and both are screen-reader-only.
- **Keyboard** — everything works without a mouse: `Esc` closes the mobile menu
  (focus returns to the menu button), the global ←/→ page shortcuts stay out of the
  way of controls, and `:focus-visible` rings are visible on every colour (white on
  slate/gradients, accent elsewhere).
- **Contrast** — text tokens and the sidebar's white-on-slate opacities meet 4.5:1;
  colour is never the only signal (correct/incorrect also show a tick/cross and text).
- **Motion** — every animation and transition, including the slide between lessons,
  is disabled under `prefers-reduced-motion`.
- **Structure** — one `<h1>` per lesson, headings step by one level, figures are
  `role="img"` with a text alternative, decorative art is `aria-hidden`.

## SCORM 1.2 packaging

The course ships ready to package for an LMS. A single **SCO** (`index.html`) and
an `imsmanifest.xml` are included; `js/scorm.js` maps the course onto the SCORM
1.2 data model. It is a **no-op when no LMS is present**, so the same files still
run standalone from `file://`.

**Build the uploadable zip:**

```bash
python3 scripts/build_scorm.py
# -> dist/<course-slug>-scorm12.zip  (manifest at the root)
```

Upload that zip to your LMS, or to <https://cloud.scorm.com> to validate.

**What it reports**

| SCORM (CMI) field | Meaning |
|---|---|
| `cmi.core.lesson_status` | **`completed`** for this course (reflection-led, no graded quiz). With a `finalQuiz` configured it reports `passed` / `failed` instead |
| `cmi.core.score.raw` | Not sent for this course. With a graded quiz: final-quiz percentage (min 0, max 100) |
| `cmi.core.lesson_location` | Bookmark — the section the learner was on |
| `cmi.suspend_data` | Compact resume state (visited sections, Continue-gate progress, answers, activities). Kept **well under the SCORM 1.2 ~4 KB cap**; reflections are **excluded** (private, and local only) |
| `cmi.core.session_time` | Time on task |
| `cmi.interactions.n` | One entry per knowledge-check answer — see *Analytics* |

**Test the adapter offline:** append `?scorm=mock` to the URL to inject a mock
LMS that logs every SCORM call to an in-memory store (used by the automated tests).

## Analytics

Per the chosen design, the **LMS is the analytics store**: every knowledge-check
answer is written as a `cmi.interactions.n` entry, so completion
and per-question results appear in the LMS's own reporting — no third-party
scripts, no external calls, and nothing that breaks the standalone/offline
property. Reflection prompts report only that a note was saved and how long it
was, never its text.

- **Event bus** — all interactions emit typed events through `js/core.js`
  (`section.view`, `knowledge_check.answer`, `interaction.complete`,
  `quiz.complete`, `course.complete`, …). SCORM and analytics subscribe to these.
- **Dev event inspector** — append `?debug=1` to see a live on-screen log of
  every event (and whether an LMS is connected).
- **Optional self-hosted sink** — for non-LMS hosting, set
  `Course.analytics.endpoint = "https://…"` to POST events via `sendBeacon`.
  Disabled by default.

## Running it

It's static, so any of these work:

```bash
# Simplest: just open the file
open index.html            # macOS   (or double-click it)

# Or serve it (recommended for a shared/hosted copy)
python3 -m http.server 8000
# then visit http://localhost:8000
```

Deploy by copying the whole folder to any static host (GitHub Pages, Netlify,
an LMS file area, a shared drive, etc.).

## File structure

```
.
├── index.html                 # all course content + interactive markup (+ inline icon sprite)
├── imsmanifest.xml            # SCORM 1.2 package manifest (single SCO)
├── css/styles.css             # SETU design tokens, layout, components, animations
├── js/
│   ├── course.config.js       # per-course identity (title, slug, institution, storeKey, pass mark, activities)
│   ├── core.js                # state store and the event bus (foundation)
│   ├── scorm.js               # SCORM 1.2 adapter (+ ?scorm=mock test harness)
│   ├── analytics.js           # dev event inspector + optional endpoint sink
│   ├── animations.js          # scroll-reveal, count-ups, self-building diagrams
│   ├── confetti.js            # brand-coloured canvas confetti
│   ├── interactions.js        # reveal cards, echo (+ shell checklist / scenario chooser)
│   ├── dashboard.js           # results dashboard + export-my-notes
│   ├── rise.js                # overview page, lesson cards, Continue-reveal
│   └── app.js                 # navigation, progress, theme, core widgets
├── scripts/
│   ├── build_scorm.py         # builds dist/<slug>-scorm12.zip
│   └── init_course.py         # interactive setup for a new course's identity
└── assets/
    ├── MONO_WHITE.png         # official SETU reversed (white) logo — used in the UI
    ├── MONO_BLACK.png         # official SETU mono-black logo (for light backgrounds)
    ├── RGB.png                # official SETU full-colour logo
    └── fonts/                 # self-hosted DM Sans + Inter (variable WOFF2)
```

Load order in `index.html`: `course.config → core → scorm → analytics →
animations → confetti → interactions → dashboard → rise → app`. `course.config.js`
must load before `core.js` (which reads `window.CourseConfig`), and
`scorm.js` runs early so it can restore `suspend_data` into the shared state
before the widgets read it.

## Logos

The official SETU logo files are used directly. The interface shows
`assets/MONO_WHITE.png` (the reversed/white lockup) in the sidebar and mobile
top bar, both of which sit on Slate Grey. `MONO_BLACK.png` and `RGB.png` are
kept in `assets/` for use on light backgrounds (e.g. print, certificates, or a
light header if you add one). Clear space is preserved around the logo and it is
displayed well above the 60px minimum.

`assets/favicon.png` is used as the browser-tab icon. `assets/setu-symbol.png`
(the official SETU "U" symbol) is used everywhere the course shows its "U"
motif — the cover graphic, the small eyebrow icon on each section, and the
watermark behind statement panels — via a CSS `mask-image` on the `.cover__u`,
`.u-mark`, and `.u-watermark` classes in `css/styles.css`, so it's still tinted
with `currentColor` (white on Slate, accent colours, dark-mode-aware) rather
than baked in as a fixed-colour image.

## Placeholders / items needing your input

Marked in-course with a *[Placeholder …]* note where a learner would see the gap.

- **AI-use scale labels** (Section 6) — the script names only the two ends of the
  scale, "No AI" and "Full AI use with critical evaluation", and says to adapt
  Perkins et al. (2024). The three middle steps are my wording, not the paper's.
  Replace them with the published scale, or your institution's version, before
  publishing. A visible note in the course says so.
- **Further links** — the script gives only domain names for three sources, so
  those are linked at the root (`teachingandlearning.ie`, `qqi.ie`, `ai.setu.ie`)
  and nothing deeper has been guessed. The N-TUTORR Assessment Redesign Framework
  has no link at all. Add the specific pages before publishing.
- **SETU's AI position** (Section 6) is reproduced as the script states it. The
  script itself notes the guidance is updated regularly; check it against
  `ai.setu.ie` on the day you publish.
- **Institutional regulations** — the resource list carries a note to add your
  assessment regulations or programme handbook, including any workload or
  word-count equivalencies.
- **References carry no DOIs.** The script supplied none, and inventing them would
  be worse than leaving the citations plain.
- **Hero photos** — the overview and section heroes use the gradient crest; add
  approved SETU photography via `<img class="hero__bg">` if preferred.

### Deliberately not built

The script's build notes mention three things that depend on the LMS rather than
the course: a *"Read others' ideas"* shared board for the authentic-task
reflection, a *"Email me my plan"* option, and a certificate and feedback-form link
on the final block. The course offers a **Download my responses** file instead,
which needs no server. Add the others in your LMS if you want them.

## Brand fonts

DM Sans and Inter (both open-source, and both named in the SETU guide) are
self-hosted as variable WOFF2 files under `assets/fonts/`, so the course renders
with the correct brand typography **offline and with no external requests**. If
you ever need additional weights/styles, add the WOFF2s and extend the
`@font-face` block at the top of `css/styles.css`.

All diagrams called for in the script (the alignment triangle, the credits-to-effort
bar, the authenticity spectrum) are rendered as inline SVG or CSS in the SETU
palette, so they stay crisp and theme-aware without external images.

## A note on dark mode

The SETU guide describes a white-background identity. An optional, restrained
**slate-based dark theme** is included as a learner accessibility feature (toggle
in the sidebar). The default is the on-brand light theme; the dark theme keeps
Slate Grey and the approved accents.
