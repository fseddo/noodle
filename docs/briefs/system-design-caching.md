# 07. Caching — research brief

**Built lesson-by-lesson**, not as a parallel chapter run: author one page, audit it, apply, then decide whether
to continue. Chapter 04 shipped three parallel-authoring collisions the cross-page linter could not see;
sequential authoring removes most of that risk because each author can read the siblings already built. What
sequencing does *not* fix is scope, so the ownership map below is decided up front and is binding.

## Reference extraction — method and results (§1a)

Bodies extracted from the RSC payload, not a summarising fetch: reassemble every `self.__next_f.push([1,"…"])`
chunk, JSON-unescape, find each `NN:T<hex>,` marker, slice `int(hex,16)` **bytes** from a UTF-8 buffer, take the
largest block, `JSON.parse` it and read `.content` (the body is markdown *inside* a JSON object). `<title>` and
`rel=canonical` verified against the requested slug on all eleven — a CDN served the wrong lesson's HTML
earlier in this project, and that check is the only defence. Script and bodies: scratchpad `ch07/`.

| Slug | Status | Prose words | Headings |
| --- | --- | --- | --- |
| `what-is-caching` | obtained | 1,688 | 26 |
| `cache-aside-pattern` | **premium-gated** | — | — |
| `read-through-vs-write-through-cache` | obtained | 2,026 | 31 |
| `write-behind-cache` | **premium-gated** | — | — |
| `caching-strategies` | obtained | 1,510 | 10 |
| `cache-eviction-policies` | obtained | 1,983 | 35 |
| `content-delivery-network-cdn` | obtained | 2,246 | 31 |
| `distributed-caching` | obtained | 2,451 | 41 |
| `cache-invalidation` | **premium-gated** | — | — |
| `cache-stampede` | **premium-gated** | — | — |
| `cache-warming` | **premium-gated** | — | — |

**Five of eleven are gated** — nearly half the chapter, against two of four in chapter 04. Counting method:
markdown `content`, fenced code and HTML comments stripped, punctuation-split. This runs ~10–12% above a
prose-only count, so **treat these as upper bounds** (chapter 04's equivalent figure was 2,129 against a
prose-only 1,859).

For the gated five: altitude is **unmeasurable** and must be reported as such — no ratio estimated from a
"N min read" byline (§1a bars it). Their delta is a **neighbour-derived scope check**: the obtainable siblings
declare what they hand off, and that is the Missing column. `caching-strategies` in particular teaches all five
write/read patterns in full and is the single best source for what the gated pattern pages owe.

The gated five are mostly *pattern* lessons, which is where a prep site's framing matters least and the
primaries matter most — Redis, Memcached, AWS ElastiCache docs, and Nishtala et al., *Scaling Memcache at
Facebook* (NSDI 2013), which is the primary source for stampede and warming behaviour at scale.

## Chapter shape

- **anchor**: `what-is-caching` (no `parent`; the other ten set `parent: "what-is-caching"`)
- **seed**: `caching-and-cdns` — a 34-line stub spanning two lessons, and **the one page in the repo currently
  failing the linter (10 must-fix)**. `what-is-caching` harvests the caching half, `content-delivery-network-cdn`
  the CDN half, then **the stub is deleted** and its `index.ts` import and registry key removed. Building this
  chapter clears that standing debt.
- **build order within the chapter**: anchor first, then the pattern cluster, then eviction, then the
  infrastructure pages, then the failure-mode pages. Rationale below.

### Inbound debt — five built pages already promise this chapter

| Promising page | What it promises |
| --- | --- |
| `what-is-system-design`:27 | low latency "bought with duplicated data you then have to keep fresh" |
| `what-is-system-design`:116 | a cache "holds what is expensive to recompute" |
| `scalability`:77 | caching as the per-tier mechanic for repeated reads |
| `latency-vs-throughput`:95 | caching as "a shorter path and less work per request" |
| `system-design-interview-framework`:231,245 | the cache in the worked URL-shortener read path, and the hot-set sizing argument |

The framework page's worked example argues **against** a distributed cache at 5 GB — so `distributed-caching`
must not contradict it, and should pick up exactly that thread: what makes the working set outgrow one node.

### Ownership map — binding

The four-page pattern cluster is the chapter's main annexation risk. **Decided:**

- **`cache-aside-pattern`** owns cache-aside end to end: the read path, the write path, the miss penalty, and
  the stale-on-write failure. It is the default pattern and the one most readers already half-know.
- **`read-through-vs-write-through-cache`** owns those two as a *pair* — the axis is who does the loading and
  when the write lands. It is the chapter's clearest **Distinction**.
- **`write-behind-cache`** owns write-behind: the buffer, the flush, and the durability hole that makes it
  different in kind rather than degree.
- **`caching-strategies`** owns **only the comparison and the selection rule**. It re-explains no pattern.
  Its job is the table the other three cannot each carry, plus *how to choose*. If it cannot be written without
  restating a pattern, that is the signal the split is wrong — say so rather than padding it.
- **write-around** has **no lesson in the manifest** and the reference teaches it inside `caching-strategies`.
  Assign it to `caching-strategies` as one row of the comparison plus one clause. Record as a §1a Missing row
  discharged in-chapter, not silently dropped.

Everything else:

- **cache layers** (browser / CDN / application / distributed / buffer pool) → `what-is-caching` names all
  five as a map, one clause each, and hands each to its owner. It teaches none of them.
- **hit ratio and how to measure it** → `what-is-caching`. Nobody else derives it.
- **the thundering herd** → `cache-stampede` owns it entirely. The anchor may name it in one clause; the
  reference's anchor teaches it as an anti-pattern and **we must not**, or the stampede lesson has nothing left.
- **eviction policies** (LRU/LFU/FIFO/TTL) → `cache-eviction-policies`. The anchor does not list them.
- **distributed cache topology, sharding, replication** → `distributed-caching`; the ring itself stays
  `[[consistent-hashing]]` (built, ch. 02), which that page must link rather than re-teach.
- **CDN edge selection** → `content-delivery-network-cdn`, which links `[[dns-load-balancing]]` and
  `[[anycast-routing]]` (both built, ch. 04) rather than re-teaching how an edge is chosen.
- **invalidation vs expiry** → `cache-invalidation` owns invalidation; TTL-as-expiry is the anchor's, one clause.
- **warming and cold start** → `cache-warming`.
- **consistency between cache and store** → shared boundary: `cache-invalidation` owns the *mechanism*,
  `what-is-caching` states the *cost* in one sentence as part of its cost model. Neither teaches
  `[[consistency-models]]` (built, ch. 02).

### Forward references (link, don't depend on)

`redis`, `memcached`, `read-replicas`, `sharding`, `database-indexing`, `api-gateways`, `three-pillars-observability`.
All must carry display labels (§6) or they render kebab-case mid-sentence.

---

## Lesson 1 — What is Caching? — `what-is-caching`

**This is the only lesson specified in full below; the rest are specified as each is reached**, per the
lesson-by-lesson build. The ownership map above is already binding on all eleven.

- **archetype**: **mechanism**. Counterfactual to argue in the page's run report: *Orientation*, since it is
  the chapter anchor and reads as "what is X". §2 no longer treats anchor-ness as an Orientation signal, and
  the deciding test is `whenToUse` — there is a real adoption decision with a sayable trigger (a read that is
  expensive and repeated) and a real rejection condition (a write-heavy path, or data that must be current).
  Note chapter 02's anchor is also a Mechanism page.
- **tier**: Full. `priority: "high"`, `estimatedMinutes: 18`, tags `["caching", "scalability", "backend"]`.
- **length note**: budget **1,400–1,700 words**. The reference is 1,688 (upper bound). The anchor's danger is
  breadth, not depth: its reference page teaches layers, anti-patterns, distributed caching *and* the
  thundering herd, four of which are other lessons in this chapter. **Name and hand off; do not teach.**
- **cost model**: buys latency and load relief by keeping a second copy of something; costs you *staleness*
  and a second thing to reason about — every cached value is a bet that the source has not changed.
- **recognition cue**: a read that is expensive, repeated, and tolerant of being slightly old. Wrong page when
  the workload is write-heavy, when every read must be current, or when the data is cheap to recompute.
- **must deliver (inbound debt)**: why a cache buys latency *and* throughput (five pages point here); the
  hit-ratio arithmetic and why a modest miss rate can dominate the mean; the cost model in the anchor's own
  words, since `what-is-system-design` cites it as the canonical example of buying a quality with another.
- **owns**: the definition and cost model; the five cache layers as a *map*, one clause each with links; hit
  and miss, hit ratio, and how to measure it; what to cache (the 80/20 shape); TTL as expiry, in one clause.
- **defers**: eviction → `[[cache-eviction-policies]]`; the four write/read patterns → `[[caching-strategies]]`
  and its three siblings; stampede → `[[cache-stampede]]`; invalidation → `[[cache-invalidation]]`; topology →
  `[[distributed-caching]]`; edges → `[[content-delivery-network-cdn]]`; the ring → `[[consistent-hashing]]`.
- **diagram**: `numbers` for the hit-ratio arithmetic is the strongest candidate — it is the one thing on the
  page a reader cannot get from prose, and it discharges the inbound promise from `latency-vs-throughput`.
  **Do not draw the client→edge→service→data topology** (`what-is-system-design` owns it; a chapter-02 page had
  that diagram deleted for redrawing it), and do not draw a cache-layer stack that duplicates the layer list.
- **seed**: harvest `src/learn/data/topics/cachingAndCdns.ts` — keep any sentence that is correct and any
  source URL that resolves; rewrite everything else. The file is deleted after `content-delivery-network-cdn`
  has taken the CDN half, **not** before.
- **sources**: `UNVERIFIED` — the author fetches and verifies every URL before citing. Candidates: Redis
  documentation, AWS ElastiCache caching-strategies docs, and Nishtala et al. *Scaling Memcache at Facebook*
  (NSDI 2013) for a measured hit-ratio figure. **A brief that hands over an unfetched URL is how chapter 02
  shipped a manufactured disagreement — treat these as candidates, never citations.**

---

## Lesson 2 — Cache-Aside Pattern — `cache-aside-pattern`

**Reference premium-gated.** Altitude **unmeasurable** — report it that way, estimate no ratio from a byline
(§1a bars it). The delta is a **neighbour-derived scope check** against `caching-strategies` §2, which is
obtainable and teaches cache-aside in ~230 words. That section is what this page owes a reader, and going
past it is this page's job — but every addition needs a §1a justification named.

**What the neighbour declares** (paraphrased; the author reads the extract at scratchpad `ch07/caching-strategies.md`):
the application manages the cache directly; read = check cache, on miss read the store, populate, return;
write = update the store and usually *delete* the entry rather than update it; the cache is a speed boost, not
required storage, so a cache outage degrades rather than breaks; it suits simple key-value stores and lets
different data carry different TTLs; the cost is application code on three paths (read, fill, delete), a slow
first read per key, and staleness when a delete is forgotten.

- **archetype**: **mechanism**. Counterfactual to argue: *Distinction* — the page will want to contrast
  cache-aside against read-through, and that is `read-through-vs-write-through-cache`'s axis, not this page's.
  The deciding test is `example`: if the worked example makes one **rung** land (this pattern, working) it is
  Mechanism; if it makes an **axis** land it has annexed the sibling.
- **tier**: Full. `priority: "high"`, `estimatedMinutes: 15`, tags `["caching", "backend", "scalability"]`.
- **length note**: budget **1,200–1,500 words**. No reference count to calibrate against, so budget from
  scope. The anchor is 1,464 prose words and is a broader subject; this page should not exceed it.
- **cost model**: buys full control over what is cached and for how long — different rules per data class —
  and costs you three code paths on every read site, plus a first-read penalty per key that never goes away.
- **recognition cue**: read-heavy, key-value-shaped, and the team is willing to own the cache logic. Wrong
  page when the cache must be transparent to application code (that is read-through) or when the write path
  is what needs the help (write-through / write-behind).
- **owns**: the read path and the write path in full; **delete-don't-update on write**, and why (an update
  races; a delete is idempotent and lets the next reader repopulate from the source of truth); the
  cache-is-optional property and what a cache outage actually does; the first-read penalty.
- **must NOT teach**: read-through or write-through as alternatives beyond one clause and a link — the axis
  belongs to `[[read-through-vs-write-through-cache]]`; the comparison table and the selection rule, which
  are `[[caching-strategies]]`'s only content; eviction, stampede, invalidation, topology.
- **the sharpest thing available**: the **delete-vs-update** decision is the pattern's real teaching and the
  neighbour states it flatly ("usually deletes") without saying why.
  **Corrected 2026-09-04 by the author, and the correction matters.** I wrote that an update can leave the
  cache permanently stale where "a delete cannot". That overstates it. Delete makes concurrent *writes*
  converge; it does **not** fix the read-fill interleaving — Nishtala's *stale set*, where a slow fill lands
  after a delete and writes back a value read before it. That residual is why memcached issues lease tokens.
  The page is written to the accurate claim: the worked example bounds itself to write/write, and
  `cornerCases` owns the surviving read/fill race. Do not restate the stronger version anywhere in this
  chapter.
- **diagram**: `sequence` is the strong candidate — the read-miss path (check, miss, load, populate, return)
  and the write path (update store, delete key) are orderings, and the interleaving that makes delete safer
  than update is *only* expressible as ordering. Do **not** draw a topology.
- **sources**: `UNVERIFIED`. Candidates: AWS ElastiCache caching-strategies (`/dg/Strategies.html` — note the
  `mem-ug` path 301s), Redis documentation, and Nishtala et al. NSDI '13, which describes exactly this
  delete-on-write discipline at scale. **Fetch and verify every URL before citing.**
