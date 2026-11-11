# Authoring a system design lesson — rubric

The content standard for one page in the **System design** track. The type model + renderers are described in
[features/learn.md](learn.md); the DS&A equivalent of this doc is [learn-authoring.md](learn-authoring.md), and
the two share a type but not a shape — read this one, not that one, for a `systems` lesson.

**What the track is.** A comprehensive interview study tool that works as a *concept* resource first and an
*applied* concept resource second: every page teaches one idea to the point where the reader can defend it under
questioning, and shows it working in a real system when a concrete instance is what makes it land. It is **not**
a case-study track — "Design a URL shortener" is Phase 2 and has its own model
([improvements/system-design-track.md](../improvements/system-design-track.md)).

**Scope of one run.** One page = one concept = one `LearnTopic` file. The chapter list, slugs, and check-off
state live in [system-design-lesson-manifest.md](../system-design-lesson-manifest.md) — that manifest, not the
reference site, is what a chapter build reads.

## 1. Sourcing — the defensibility rule

The track's credibility is the whole product, so every page carries a **traceable claim chain**:

- **Primary sources win.** Vendor/protocol docs (Postgres, Redis, AWS, Kafka, RFCs), the standard books
  (Kleppmann's *DDIA*, the Google SRE book), and the original papers (Dynamo, Raft, Bigtable, MapReduce) rank
  above any interview-prep site. Cite 2–4 in `sources`, and every URL must actually resolve.
- **No verbatim scraping**, from the reference course or anywhere. The reference supplies the *outline*: which
  concept, in which chapter, in which order. Prose, diagrams, code, and examples are authored original.
- **Every number is sourced or derived.** "A single Redis node handles ~100k ops/sec", "cross-region RTT is
  ~150ms" — attach the source, or show the arithmetic in a `numbers` section. An unattributed number that a
  reader repeats in an interview and can't defend is worse than no number.
- **Name the disagreement — and verify it.** Where practitioners genuinely disagree (when microservices pay
  off; whether 3PC is ever worth it), say so and give both positions. Confident prose over a contested claim is
  the failure mode this rule exists to prevent. But **a named position must be quotable from the source cited
  for it**, and the citation must point at the page that states it. If the sources you check turn out to
  *agree*, say that — "the sources converge here" is a finding, not a failure, and inventing an opponent to
  fill a two-column table is worse than having no table. If the page itself takes the minority view, label it
  as the page's own position.
- **Vendor claims are labelled as such.** "DynamoDB offers single-digit-millisecond latency" is marketing copy
  until you attribute it; write it as *AWS documents …*, not as a fact of nature.

## 1a. Reference fidelity — staying on course

Sourcing keeps a page *true*. This keeps it *the right page*. The reference curriculum
([AlgoMaster's System Design course](https://algomaster.io/learn/system-design/course-roadmap), indexed in the
[manifest](../system-design-lesson-manifest.md)) is authoritative for **scope, altitude and order** — which
concepts this lesson owns, how deep the track goes on them, and what the reader has already met. It is
authoritative for nothing else: prose, claims, figures, examples and diagrams are ours, sourced under §1.

**Every reference lesson has a derivable URL**: `https://algomaster.io/learn/system-design/<manifest slug>`.
The manifest's slugs *are* the reference's slugs, so no lookup table is needed. A lesson the manifest marks as
**ours, not the reference's** has no counterpart and is exempt from this section — but it must still declare, in
the manifest, which reference lesson it borders, so the overlap check below has something to run against.

### The delta

The check runs twice — the **sourcer** runs it before a page is authored, and turns it into that page's scope
line; the **auditor** re-runs it against the finished page. Both produce the same three-column delta:

| Column | Question | Verdict when it fires |
| --- | --- | --- |
| **Missing** | The reference teaches this on this page; we teach it nowhere. | Add it, or name the sibling lesson that owns it — **and open that sibling to confirm it actually delivers**. A deferral to an unwritten lesson is a promissory note, recorded as such, not a discharge. The test is *can a reader who has read only our chapter define this and use it?*, not *does the word appear?* — MTBF appeared on two chapter-02 pages and was defined on neither. A concept dropped on purpose is recorded with a reason; silence is a coverage hole. |
| **Extraneous** | We teach this; the reference's page has no counterpart. | Justify or cut. See the three legitimate justifications below. |
| **Shared** | Both cover it. | Say which does it better in one line, and why. |

**Extraneous is legitimate in exactly three cases**, and the author names which one:

1. **Depth the track adds on purpose** — a sourced figure, a real-system worked example, the interview angle.
   This is the track's whole reason to exist; the reference is thin here and we outrank it.
2. **A concept the reference teaches in a *different* lesson**, and the manifest assigns it to this one.
3. **Ours by design** — a lesson or section the manifest records as our addition. If the content is right
   and the manifest simply doesn't say so yet, the fix is a manifest row, **which the auditor opens at audit
   time rather than reporting as a defect**.
4. **Vocabulary a later lesson explicitly depends on.** Chapter 01's functional/non-functional taxonomy has no
   counterpart lesson anywhere in the reference, isn't a figure or an example, and was only "ours by design"
   because nobody had written the row — yet `system-design-interview-framework` names it as a prerequisite.
   A term a sibling cites as already-defined is justified wherever it is defined.

Anything else is drift, and drift is the mechanism by which a page about *what system design is* acquires four
paragraphs on the economics of the fourth nine. **The commonest drift is a page annexing its sibling's
subject** — which reads as depth while it is being written and as a chore while it is being read.

### Which does it better

For each shared concept, one line, and it is not a formality — it is where the reference earns its keep:

- **The reference usually wins on restraint and sequencing.** It is written to be read in eight minutes and it
  stops when the idea has landed. If its treatment of a concept is shorter than ours and the reader ends up in
  the same place, **theirs is better and ours is padded** — take its structure, not its words.
- **We usually win on evidence.** The reference asserts; we cite, derive, and name the disagreement. Where the
  reference states a number flat, ours is better *if* we sourced it — and if we didn't, we are merely longer.

"Both are fine" is a permitted verdict; "ours is better because it is more thorough" is not — thoroughness is
the claim under examination, not the defence of it.

**A delta with no losses in it is evidence the check wasn't run.** Name at least one concept the reference
handles better, or state explicitly that you looked and there isn't one. Two chapter-02 audits caught
themselves writing four consecutive "ours, because we sourced it" rows; both times, forcing a loss produced the
audit's most useful finding — once a correctness regression, where the reference scopes statelessness to app
servers and we had generalised it into a false claim.

**Extract the reference's real body text before comparing, and say how you did it.** The reference is a
client-rendered app: a plain fetch returns *a summary*, and a summary is always thinner than a page, so
comparing against one rigs every row in our favour. That is the mechanism behind the self-congratulation, and
it is a tooling failure rather than a wording one.

Two further failures, both seen in chapter 02, both silent:

- **Confirm the document you got is the one you asked for.** A CDN served one lesson's HTML under another
  lesson's URL — same shell, same nav, same styling, wrong body. An audit run against it would have produced a
  delta that was pure fiction with nothing on the page looking wrong. Check the `<title>` or canonical URL
  against the slug before comparing anything.
- **Some reference lessons are paywalled.** When the body is unobtainable, the honest output is *unmeasurable*
  — say so and fall back to the scope check. An estimated ratio derived from a "N min read" byline is not a
  measurement, and §1a already bars reading times as inputs.
  - **Run the delta against the lesson's neighbours instead.** Fetch the free lessons either side of it in the
    reference's own order and grep them for the gated lesson's subject. A curriculum's neighbours declare their
    handoffs: what they defer to it is its Missing column, and what they draw or tabulate about it is the best
    candidate for the loss §1a requires you to name. Record it as a *neighbour-derived* scope check.
  - **The gated page's nav payload still carries `difficulty`, `level` and `priority` per lesson.** Those
    survive the paywall and are a free cross-check on our `priority` and tier.
  - **"A delta with no losses" is unenforceable against a gated body**, and pushing on it invites the
    manufactured opponent §1 forbids. "I looked and could not tell" is the correct Shared verdict there; a
    confident one is suspect.
  - **§7.21 falls back to the brief's owns/defers list** as the scope contract, since there is no counterpart
    page to derive an Extraneous column from.

**When your delta contradicts the brief's, the finding is against the brief.** A chapter-02 brief listed six
sections that do not exist on its reference lesson, missed one that does, and overstated the reading time by
1.5×. The rubric already says not to trust the brief's delta; record the defect explicitly, because the next
author or re-author will otherwise inherit it.

### Altitude

The reference page's length is the **altitude signal**. Ours run longer by design — evidence and worked
examples cost words the reference doesn't spend — but a page more than **2× the reference at the same scope**
has almost certainly annexed something.

**Measure it one way only: extracted body word count on both sides** — *prose only*, links resolved to
display text, excluding code fences and figure data on both sides. (On one chapter-02 page, counting the
reference's 21 code fences and 10 diagrams flipped the ratio from 1.21× to 0.82×; prose is what §1a is asking
about, because reading cost is the thing under examination.)
`estimatedMinutes` and the reference's own "N min read" are different sites' guesses at different things and
are never inputs — on one chapter-02 page they disagreed with the word count by a factor of three, in opposite
directions.

**The sourcer records how it counted, in these same terms**, so the auditor can diff method rather than argue
opinion. A chapter-02 brief put one reference at ~4,500 words when it is 1,781 — off by 2.5× — and every
downstream figure inherited the error, including the per-lesson budget the author then wrote to. A brief whose
altitude column is wrong is worse than one with no altitude column.

**An over-2× ratio with a clean Extraneous column means the surplus is §7.13, not annexation.** Say so, and
quantify it: count the words your restatement findings remove before pronouncing on altitude. On one chapter-01
page that turned a vague "too long" into a specific 315-word cut list, and the residual was the worked example
— the one thing §6a says never to cut.

This is **corroboration, not a verdict**. Check *scope* first: if we cover strictly more concepts than the
reference does, the delta's Extraneous column is the real finding and length is only its symptom. A page can't
fail altitude without failing §7.21, and a comfortable ratio is useful mainly as licence to stop hunting for a
bloated section and go look at the Missing column instead.

## 2. Lesson archetypes and depth

A lesson's part set follows from **what kind of lesson it is**, not from a single ladder every page climbs. A
uniform part list is how a page about *what system design is* ends up with a tradeoffs table: the part was
required, so something was written into it. **A part you have nothing to say in is omitted, not filled.**

### The four archetypes

| Archetype | The lesson is | Required parts | Omit unless the lesson genuinely has one |
| --- | --- | --- | --- |
| **Orientation** | *Falsifier: how many vocabularies does the page install?* One axis is Distinction; several unrelated word-lists handed off to later lessons is Orientation. A framing or vocabulary page — "what is X", "why this chapter exists". Teaches the map and the words, not a component. *Not* simply "the chapter anchor": anchor-ness is a fact about `parent`, and chapter 02's anchor is a Mechanism page. | `definition`, `techniques` (the vocabulary), `relatedStructures`, one figure, `resources` | `whenToUse` (you don't *choose* a framing), `tradeoffs`, `implementation`, `cornerCases`, **`pitfalls`** — vocabulary can't be got *wrong* in an interview-costing way, so its pitfalls come out as restatements of the thesis or as the next lesson's subject (3 of 4 bullets, on the first Orientation page audited) |
| **Mechanism** | A component or technique you can adopt — caching, load balancing, WAL — **or a property you design toward, or a failure you design against**, where the adoptable thing is its remedy (availability → redundancy; SPOF → removing it). **The default archetype**, and the one §4's full part list was written for. | `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`, `resources` | — (`implementation`, `cornerCases`, `relatedStructures` are the Full tier) |
| **Distinction** | An X-vs-Y comparison — latency vs throughput, SQL vs NoSQL, strong vs eventual. The teaching *is* the axis that separates them. | `definition`, `techniques` + its `comparison`, `tradeoffs`, **`pitfalls`**, `interviewAngle`, `resources` | `implementation`, `example` (unless one real system makes the axis land) |
| **Procedure** | A method the reader executes — the interview framework, a deployment or migration sequence. | `definition`, `techniques` (the steps), one worked run in `example` or `implementation`, `pitfalls`, `interviewAngle`, `resources` | `cornerCases` (fold into `pitfalls`), `relatedStructures` |

The archetype is assigned in the research brief, per lesson, and the auditor checks the page against *that*
archetype's row — not against the longest one. **Checking the part list against the row is not the check** —
every page passes it, because the author read the same row. The check is the counterfactual: **name the
archetype you considered and rejected, and the part that decided it.** Every chapter-02 audit reported this as
the step that turned a checkbox into a finding, and the tell it exposes is a part that exists because a table
demanded it rather than because the lesson had something to put there.

Two falsifiers make the "omit unless" column checkable rather than rhetorical. For `tradeoffs`: *can you name
the thing the reader decides to adopt?* For `whenToUse`: *can you name what in a prompt triggers it, in words a
candidate could say out loud* — and, better still, a condition under which this is the **wrong** page? A part
that tells you when not to read it proves a choice exists.

**For `pitfalls`: can you name the passage elsewhere on the page that *fails to prevent* each mistake?** A
pitfall exists because the page taught something and a reader could still get it wrong. If the answer is "the
definition already says exactly this", the bullet is a restatement; if the answer is "nothing here teaches the
thing you'd get wrong", the bullet belongs to another lesson. A third case: if the bullet's payload is a
*technique* with a warning bolted on the front so it would fit the part, let it be what it is and move it. And
if you find yourself naming **three** passages, the page has a §7.13 cluster and the bullet is its third
statement, not its first. Both failure modes shipped in one chapter-02
`pitfalls` part, alongside a bullet the page's own worked example refuted.

**`example` is what decides Mechanism against Distinction; `implementation` decides nothing.** Both
archetypes list `implementation` as optional, so its absence cannot discriminate — a chapter-04 brief argued
Distinction from exactly that and was wrong. The test that works: §2 omits `example` from Distinction *unless
one real system makes the axis land*. If the page's worked example makes one **rung** land rather than the
axis, it is a Mechanism page whose `techniques` happens to be a table.

**For `interviewAngle`: name the passage the bullet would be redundant with if the reader had already read
it.** The same shape as the `pitfalls` falsifier, and it caught two recycled bullets on its first outing.

**For `cornerCases`: name the passage that would have to be deleted for the bullet to carry new information.**
§4 separates `cornerCases` from `pitfalls` only by a definition an author can satisfy by adjusting tone, so
this is the part where duplication hides longest. On a chapter-07 page it returned the `tradeoffs` row the
bullet was silently restating.

**A falsifier's answer often belongs to a different criterion than the one you were asked about.** The
chapter-07 cold-cache bullet was raised as possible annexation (§7.21); the falsifier showed the duplication
was with the page's *own* `tradeoffs` part, making it §7.13 — and the fix was to cut the tradeoffs cells, not
the bullet. Follow the answer, not the question.

**A further falsifier, at row level, because the part-level ones cannot see the defect they miss.** For every
`tradeoffs` row: *does it name a cost stated nowhere else on the page, with a condition under which it bites?*
A chapter-02 page passed both part-level falsifiers — it had a real adoption decision and a real recognition
cue — while three of its four rows restated the `definition`, the `interviewAngle` and the `cornerCases` in
different words. `tradeoffs` is where a page goes when the author has already said everything and the table is
still empty, so it is the part that most needs a per-row test. Most lessons are **Mechanism**; if you're reaching to justify a
different archetype in order to drop a part you found hard to write, the archetype isn't the problem.

### Depth, within an archetype

- **Stub** — `definition` only. Placeholder for a lesson whose chapter hasn't been built; never the output of a
  chapter build.
- **Core** — every part in the archetype's **Required** column, with a load-bearing figure of the kind §5
  prescribes. **The minimum bar for any page a chapter build ships.**
- **Full** — adds the archetype's optional parts where the lesson genuinely has them. Aim here for
  `priority: "high"` lessons and anything an interviewer pushes on for ten minutes (consistent hashing, CAP,
  sharding, caching strategies, consensus).

**When a required part is added to an archetype retroactively, re-audit the whole page — don't append the
part.** On a page whose thesis is already stated four times, the only bullets left to write are restatements,
and that is structurally what happened when §2 gained the Distinction `pitfalls` rule mid-chapter. A part
found is not the same artifact as a part filled.

Don't fake depth, and don't fake breadth. A short honest page beats padded prose; an omitted part with a
one-line reason in the run report beats a part written to satisfy a table.

## 3. Metadata

- **`category`** — always `"systems"` for this track, including the database and networking lessons. `databases`
  and `web` stay for the standalone technology pages (`redis`, `mongodb`, `server-side-rendering`) that are *not*
  track chapters.
- **`slug`** — taken from the manifest, which takes it from the reference, so the mapping stays auditable.
  Rename only where the manifest says so.
- **`parent`** — set every lesson in a chapter to the chapter's **anchor lesson** (its first, most general page:
  `what-is-caching` for the Caching chapter, `database-types` for Databases). This nests them in `/concepts`
  ([learn.md](learn.md) → parent/child grouping) and is what keeps a 174-topic catalog navigable. The anchor
  lesson itself has no `parent`.
- **`priority`** — interview weight, not difficulty. Roughly: `high` = named in most mid-level interviews
  (caching strategies, sharding, load balancing, CAP); `mid` = comes up when the design touches it (CDC, service
  mesh, erasure coding); `low` = depth signal for senior rounds (3PC, MinHash, operational transformation).
- **`estimatedMinutes`** — honest study time, floor 10. A tight single-idea page is 10–20; a meaty one 40–60.
  It is a *study* estimate (working through tables and arithmetic), never a reading time, and it is never an
  input to the §1a altitude check. Don't inflate it to clear a floor — three chapter-02 audits found pages
  declaring 2–3× their real length, which is what made the altitude ratio unreadable.
- **`tags`** — from `LearnTag`; this track uses `distributed-systems`, `messaging`, `storage`, `architecture`,
  `security`, `observability`, `devops`, `data-engineering`, `scalability`, `networking`, `caching`, `database`,
  `api`, `backend`.

## 4. The parts, in render order

Layout comes from `ARTICLE_PARTS` — supply content per part, never headings or ordering. **Which parts apply is
§2's archetype table, not this one**: the rows below define each part's *job and budget when you use it*, and a
row's presence here is not an instruction to fill it.

| Part | Heading | Use it for | Section kinds | Length |
| --- | --- | --- | --- | --- |
| `definition` | Definition | What it is and the one-sentence cost model — the thing you trade to get it. Lead with the payoff. | `prose`, `numbers` | 1–2 short paras |
| `whenToUse` | When to use | The recognition cue: **what in a design prompt signals this tool**. Written for someone mid-interview. Needs a *choice* to exist — an Orientation page has none, and omits it. | `prose`, `callout` tone `tip` | 1 para |
| `techniques` *(nested)* | Techniques | The named variants, each **bold** — LRU/LFU/FIFO, round-robin/least-connections/consistent-hash. **Split the labour**: the paragraph names and defines the variants, the table carries the axes that separate them. Never state the same axis in both. | `prose`, `comparison`, `code`; also `architecture` / `sequence` **when the variants themselves are components or steps** — an Orientation page's box vocabulary, a Procedure page's step order. Not for decoration. | 1 para + 1 figure |
| `relatedStructures` *(nested)* | Related concepts | How it sits next to a sibling lesson; link with `[[slug]]`. Say what this page covers that the sibling doesn't. | `prose` | 2–3 sentences |
| `implementation` | Implementation | The mechanism made concrete: the algorithm in ~20 lines, a config excerpt, or a protocol/procedure step list. Not production code — and for a *methodological* lesson the mechanism may not be code at all. Apply §7.4's test: delete it, and if the reader loses nothing, it was restating a table. | `code`, `prose` (+ `caption`) | 1 snippet or list |
| `example` | Worked examples | **The applied half.** One real system, walked through — the flow, the numbers, what breaks. | `prose`, `architecture`, `sequence`, `numbers` | the centerpiece |
| `tradeoffs` | Tradeoffs | What you give up **by adopting this**. Needs an adoption decision to hang off; where there is none (Orientation), the cost model in `definition` carries it and this part is omitted. | `comparison`, `prose` | 1 table + 1 para |
| `pitfalls` | Things to look out for | The mistakes that cost interviews and outages. | `callout` tone `warn` | 3–5 bullets |
| `interviewAngle` | In the interview | How this actually comes up, the follow-up an interviewer asks, and the answer that shows depth. | `callout` tone `tip`, `prose` | 3–5 bullets |
| `cornerCases` | Corner cases | The failure modes a naïve design misses — partitions, cold starts, thundering herds, clock skew. Distinct from `pitfalls`: those are *mistakes people make*, these are *conditions the world imposes*. If you can't keep them distinct, keep only `pitfalls`. | `callout` tone `info` | 3–5 bullets |
| `resources` | Learning resources | Curated external links — **real URLs only**. | `resources` | 2–4 items |

`operations` and `practice` stay unused on this track: there is no per-operation Big-O table for a concept, and
there are no bank problems to practise against (Phase 2's case studies fill that role).

## 5. Diagrams — pick the right kind

The reference course leans on animated diagrams; ours are **typed data, never images**, so they stay
theme-aware, searchable, and diffable. Four kinds carry this track:

- **`architecture`** — *topology*: which components exist and what talks to what.
  `nodes: { id, label, tier, note? }[]` + `edges: { from, to, label?, dashed? }[]`. The renderer columns nodes
  left→right by `tier` (`client` / `edge` / `service` / `data`) and stacks same-tier nodes vertically, so you
  author no coordinates — only the tier assignment, which is itself the teaching. Use it whenever the lesson is
  about where a box sits in a system. **Do not use the `graph` kind** — it auto-lays nodes on a circle for
  graph *algorithms*, and reads as noise for a topology.
- **`sequence`** — *ordering over time*: who sends what, in what order. `actors: string[]` (lifelines, left to
  right) + `steps: { from, to, label, note?, dashed? }[]`. `from === to` draws a self-call; `dashed` marks a
  response or async hop. Handshakes (TLS, WebSocket upgrade), commit protocols (2PC/3PC/Saga), consensus
  rounds, OAuth flows. If the lesson's core idea is "step 3 happens before step 4", this is the kind.
- **`comparison`** — *X vs Y*: a free-form table. `columns: string[]` (the first heads the row-label column and
  is usually `""`) + `rows: { label, cells }[]`, where `cells.length === columns.length - 1`. The whole
  `Tradeoffs` chapter, every `techniques` variant table. Cells go through `renderInline`, so `` `code` `` and
  `[[links]]` work.
- **`numbers`** — *back-of-envelope*: `rows: { quantity, value, derivation? }[]`. Capacity estimates, latency
  budgets, storage math. **Every row shows its arithmetic or its source** (rule §1) — `derivation` is optional
  in the type but not in the rubric.

One diagram minimum per Core page, and it must be the *load-bearing* one — the diagram that makes the idea
click, not decoration beside prose that already said it. A second is fine when it shows a different axis
(topology *and* timing); three is usually a sign the page should split. **The `comparison` in `tradeoffs` and
the variant table in `techniques` don't count against that budget** — both are the shape §4 prescribes for
their part, not figures the author chose to add. The budget is about discretionary pictures.

## 6. Prose rules

Same inline formatter as the rest of the bank ([renderInline](../../src/learn/article/sections/renderInline.tsx)):
`` `code` ``, `*emphasis*`, `**bold**`, `[[glossary-or-slug]]`, `[[slug|display text]]`. Not full markdown.

- **Short paragraphs**, split on `\n\n`. A wall of prose is the most common failure on a concept page.
- **Bold the named thing** the first time it appears — **write-through**, **quorum**, **head-of-line blocking**.
- **Cross-link liberally** with `[[slug]]`, and **give a forward reference a display label**. A slug whose
  lesson exists renders under that lesson's *title*; a slug whose lesson doesn't exist yet has no title to
  borrow, so a bare `[[three-pillars-observability]]` puts kebab-case in the middle of your sentence.
  Write `[[three-pillars-observability|observability]]` — the link still lights up when that chapter lands,
  and reads as prose until it does. The linter flags the bare case.
- **Second person for the reader, never for the interviewer.** "You'd reach for a queue here" is fine;
  personifying or second-guessing the interviewer is not.
- **No hedging filler.** "It's important to note that", "in today's fast-paced world" — cut on sight.

## 6a. Economy — say it once, say it fully, say it the same way

Three failure modes, all of which make a page *worse for learning*, and all of which are gated by
`node scripts/lintTopics.mjs <slug>`:

**Restatement is a defect, not a style nit.** A page that says the same thing in a paragraph and again in a
table row has not taught it twice — it has taught it once and then charged the reader a second time to
discover that. The commonest shapes: a `techniques` table restating the paragraph above it (§4 splits that
labour: the paragraph *names and defines* the variants, the table carries the *axes* that separate them); a
`cornerCases` bullet recycling a `pitfalls` bullet; a `tradeoffs` cell repeating a pitfall. When two passages
make the same point, one owns it and the other is cut — not softened, cut.

**Long-windedness is the same defect wearing more words.** A 60-word sentence, a 130-word paragraph, a
`techniques` part over its budget: each is a place where the writing stopped being read. Every part in §4
carries a length, and those lengths are budgets, not suggestions.

**But terseness that stops teaching is also a failure**, and the linter enforces floors as well as caps. A
`definition` of one sentence, a `tradeoffs` part with two clauses, a page that names a concept and never shows
it working — these fail just as surely, and they are harder to spot because thin reads as disciplined. The
balance: **cut repetition and filler to the bone; never cut the worked example, the derivation, the concrete
instance, or the reason a claim is true.** Length spent on a second *explanation* of something is waste;
length spent on the first *demonstration* of it is the page.

**Consistency is part of the design.** Every lesson on this track is one of 174 and will be read next to its
siblings, so the house shape is not optional: the parts in §4's order and semantics, the section kind §5
prescribes for each part, `category: "systems"`, `parent` on the chapter anchor, 2–4 `sources`, a
load-bearing figure. A page that invents its own structure costs the reader the orientation every other page
gave them. The linter checks all of this mechanically.

**A budget is a ceiling, not a target.** The §4 lengths bound what a part *may* cost, not what it should. Two
pages written up against every cap produce a chapter that clears every check and reads as a slog, and the caps
themselves were calibrated from real pages — so writing to them is circular. The number to aim at is the one
§1a gives you: the reference's treatment of the same scope, plus what evidence and a worked example cost.

**The linter is a floor, not a ceiling.** It catches near-verbatim restatement, budget overruns and structural
drift. It cannot catch a paraphrase that says the same thing in different words, padding that is merely
uninteresting, or a diagram that is decorative — those stay the auditor's judgment (§7.13, §7.14). A finding
it raises that you believe is *correct as written* must be justified in the run report, not silently ignored.

**Read code-block comments as prose.** A `code` section's comments are the only prose inside it, and they are a
favourite home for a point the page already made — a chapter-04 page shipped comments that restated two
`pitfalls` bullets through a clean run. The linter now feeds comment lines into the repetition pass, but the
budgets still exclude them, so an auditor reads them like any other passage.

## 7. Acceptance criteria — one lesson

A page ships only when **all** of these hold. The auditor checks them one by one.

1. **Archetype and tier** — the page carries every part in its §2 archetype's **Required** column (Core), and
   `priority: "high"` pages reach Full where the archetype's optional parts genuinely apply. A part outside the
   archetype's set is present only because the lesson had something real to put in it. Never manufacture a part
   to clear a tier — an omission with a one-line reason in the run report is the correct outcome, and a part
   written to satisfy a table is a §7.21 finding.
2. **Cost model stated.** The `definition` says what the concept costs, not only what it buys.
3. **Recognition cue present.** `whenToUse` tells the reader what in a prompt should make them reach for this.
4. **Load-bearing diagram.** At least one `architecture` / `sequence` / `comparison` / `numbers` section, of the
   kind §5 prescribes for this lesson's shape, and it carries information the prose doesn't.
5. **Tradeoffs are real.** Named costs with the conditions under which they bite — not "adds complexity".
6. **Every asserted number is sourced or derived** (§1) — every figure the page states as true *of the world*.
   Illustrative targets and worked-example inputs (a latency budget a candidate would *propose* in an
   interview, an assumed request rate) are exempt from sourcing but **must be labelled as assumptions**, so a
   reader never mistakes a chosen input for a measured fact.
7. **`sources` has 2–4 entries**, primary-source-weighted, and every URL resolves. A claim may instead be
   attributed to a `resources` URL **provided the prose names that source inline** — `sources` is the 2–4 that
   carry the page's spine, not the exhaustive citation list.
8. **`resources` URLs resolve** and are distinct from `sources`.
9. **Cross-links** — at least two `[[slug]]` links to sibling lessons, every slug matching the manifest (a
   typo'd slug degrades silently and never recovers), and `parent` set to the chapter anchor — *anchor lessons
   excepted*, since they have no parent (§3).
10. **Interview angle** answers a question an interviewer would actually ask, with the depth-signalling answer.
11. **No duplication with a sibling.** If two lessons in the chapter would say the same paragraph, one owns it
    and the other links to it. The `relatedStructures` part exists for exactly this handoff.
12. **Every attributed position is quotable from its cited URL** — not merely plausible, and not merely
    balanced-looking. This is the check that catches a manufactured disagreement.
13. **No passage makes the same point twice on one page** (§6a). §7.11 covers duplication with a *sibling*;
    this covers the page with itself, which is the commonest form of length that isn't depth. Near-verbatim
    cases are caught by the linter; paraphrase is the auditor's call.
14. **Every part is inside its §4 length budget — floor and cap alike** (§6a). Over the cap is padding; under
    the floor is a page that stopped teaching. Neither ships.
15. **No filler.** "It's important to note", "in today's", "when it comes to", "in order to", "the fact that" —
    the linter carries the enforceable list; cut anything on it.
16. **Structural consistency** (§6a) — §4's parts and semantics, §5's kind per part, `category: "systems"`,
    2–4 `sources`, a load-bearing figure, `parent` on non-anchor lessons. This page must read as one of a set.
17. **`node scripts/lintTopics.mjs <slug>` reports zero must-fix**, or every remaining finding is justified in
    writing in the run report as correct-as-written. Silence is not justification.
18. **`npx tsc --noEmit` and `npx eslint src/learn` are clean**, and the topic is registered in
    [topics/index.ts](../../src/learn/data/topics/index.ts).
19. **No render check.** Don't boot the app to confirm it looks right — the maintainer reviews rendering. Confirm
    the section *data* is well-formed and stop there.
20. **Reference delta run and recorded** (§1a). The reference lesson at
    `https://algomaster.io/learn/system-design/<slug>` was fetched, and the page's Missing / Extraneous /
    Shared columns are in the run report. Every **Missing** row is either covered here or assigned to a named
    sibling; every **Extraneous** row names which of §1a's three justifications it claims.
21. **Nothing extraneous survives unjustified.** A section, paragraph or table with no counterpart in the
    reference and no §1a justification is cut, not shortened. This is the criterion that catches a page
    annexing its sibling's subject — the failure that reads as depth and costs the reader a chapter.
22. **Altitude held** (§1a). The page is inside 2× the reference lesson's reading time at the same scope, or
    the run report says which §1a justification buys the extra length.

## 8. Acceptance criteria — one chapter

On top of every lesson passing §7:

1. **Coverage** — every lesson in the manifest's chapter table exists, with its manifest slug, or is recorded as
   deliberately dropped with a reason. No silent omissions.
2. **Chapter wired** — the chapter is in `TRACKS["system-design"].chapters` in
   [curriculum.ts](../../src/learn/data/curriculum.ts), in curriculum (not build) order, with its lessons in the
   manifest's order.
3. **Anchor lesson** — the chapter's first lesson is its most general, and every other lesson `parent`s to it.
4. **Seeds resolved** — every "Seed / notes" row in the manifest is either harvested into the new page and the
   old file deleted, or the old slug is kept and rewritten. No stub left shadowing a new lesson.
5. **Arc reads** — the chapter's pages read in order without forward references to lessons that don't exist yet,
   and without three pages re-teaching the same background.
6. **`node scripts/lintTopics.mjs --chapter <slugs…>` is clean**, including the cross-page repetition pass —
   the failure mode that only appears once a chapter has been authored in parallel and no single author could
   have seen.
7. **Manifest updated** — every ☐ ticked, and the chapter's row in the summary table.
8. **Chapter-level reference delta** (§1a). Run the delta once more across the whole chapter, not page by
   page: a concept the reference teaches *somewhere in this chapter* must be taught *somewhere in ours*, and a
   concept we teach twice because two pages each thought it was theirs is an ownership-map failure. Per-lesson
   deltas cannot see either.
9. **Docs updated** — [learn.md](learn.md) if the content model changed at all; this rubric if a new convention
   was established.

## 9. Skeleton

```ts
import type { LearnTopic } from "@/learn/data/topic";

export const cacheStampede = {
  slug: "cache-stampede",
  title: "Cache stampede",
  category: "systems",
  archetype: "mechanism",
  parent: "what-is-caching",
  summary: "One expired key, ten thousand simultaneous misses — and the origin falls over.",
  tags: ["caching", "scalability", "distributed-systems"],
  priority: "mid",
  estimatedMinutes: 25,
  parts: {
    definition: [{ kind: "prose", body: "What it is + what it costs." }],
    whenToUse: [{ kind: "prose", body: "The cue that this is the problem you have." }],
    techniques: [
      { kind: "prose", body: "**Request coalescing** — … **Probabilistic early expiry** — …" },
      { kind: "comparison", columns: ["", "Coalescing", "Early expiry"], rows: [/* … */] },
    ],
    relatedStructures: [{ kind: "prose", body: "Sits next to [[cache-invalidation]], which covers …" }],
    implementation: [{ kind: "code", lang: "javascript", caption: "…", source: "…" }],
    example: [
      { kind: "prose", body: "The concrete system." },
      { kind: "sequence", actors: ["Client", "Cache", "Origin"], steps: [/* … */] },
      { kind: "numbers", rows: [{ quantity: "…", value: "…", derivation: "…" }] },
    ],
    tradeoffs: [{ kind: "comparison", columns: [/* … */], rows: [/* … */] }],
    pitfalls: [{ kind: "callout", tone: "warn", items: ["…", "…", "…"] }],
    interviewAngle: [{ kind: "callout", tone: "tip", items: ["…", "…", "…"] }],
    cornerCases: [{ kind: "callout", tone: "info", items: ["…", "…", "…"] }],
    resources: [{ kind: "resources", items: [{ label: "…", url: "https://…", type: "article" }] }],
  },
  sources: [{ label: "…", url: "https://…" }],
} satisfies LearnTopic;
```
