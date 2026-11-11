import type { LearnTopic } from "@/learn/data/topic";

export const cacheAsidePattern = {
  slug: "cache-aside-pattern",
  title: "Cache-aside pattern",
  category: "systems",
  archetype: "mechanism",
  parent: "what-is-caching",
  summary:
    "The application checks the cache, loads on a miss, and deletes on write — and the delete, rather than an update, is the whole trick.",
  tags: ["caching", "backend", "scalability"],
  priority: "high",
  estimatedMinutes: 15,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Cache-aside** puts the application in charge. A read checks the cache first; on a miss it reads the " +
          "store, writes the value back into the cache, and returns it. A write goes to the store and then " +
          "removes the cached copy. AWS calls this shape **lazy loading**; Nishtala et al. call it a " +
          "*demand-filled look-aside cache*. Nothing sits between your code and either system — the cache is a " +
          "second thing your code talks to, not a layer your reads pass through.\n\n" +
          "What that buys is control per key: this entity gets five minutes, that one is never cached, and the " +
          "rule lives at the site that knows why. What it costs is three code paths — the read, the fill, and " +
          "the removal on write — at every place that touches the key, plus a first read per key that always " +
          "pays the store and never stops doing so.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for cache-aside when reads dominate, the value is addressable by a key you can derive from the " +
          "request — product rows, user profiles, feature config — and the team is willing to own cache code " +
          "in the application. It is the default for exactly " +
          "that reason: it asks nothing of the cache product beyond `GET`, `SET` and `DEL`, so any key-value " +
          "store will do.\n\n" +
          "Wrong page when the cache has to be invisible to application code — that is " +
          "[[read-through-vs-write-through-cache|read-through]] — or when the write path is what needs the help " +
          "([[write-behind-cache|write-behind]]). Microsoft's guidance adds a third rejection worth saying out " +
          "loud: when most requests miss anyway, checking the cache and filling it can cost more than it saves.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "Cache-aside fixes the read path — check, miss, load, populate — and leaves one decision open: what " +
          "the write path does to the cached copy once the store has committed. Three answers are in use.\n\n" +
          "**Invalidate on write** deletes the key and lets the next reader refill it. Microsoft and Facebook's " +
          "memcache both describe it as the default; AWS does not, and reaches for a write-through update or a " +
          "TTL instead — so the choice below is a live one, not a settled one. **Update on write** writes the " +
          "new value straight into the cache. **Expire only** touches the " +
          "cache on a write not at all and lets the TTL carry it — the honest choice when the writer is a batch " +
          "job that has no idea which keys it disturbed.\n\n" +
          "Who does the *loading* is a different question, and the one " +
          "[[read-through-vs-write-through-cache|read-through and write-through]] answer; " +
          "[[caching-strategies|caching strategies]] is where all of them get set side by side.",
      },
      {
        kind: "comparison",
        columns: [
          "",
          "After two writes whose cache calls are reordered",
          "The read right after a write",
          "Work added to the write path",
        ],
        rows: [
          {
            label: "Invalidate (delete)",
            cells: [
              "Key absent either way — the next read refills from the store",
              "A miss, paying the full fill",
              "One delete, which usually finds nothing there",
            ],
          },
          {
            label: "Update (set)",
            cells: [
              "Whichever set landed last wins, which may be the superseded value",
              "A hit on the new value — if the sets landed in commit order",
              "One set, carrying a value the writer already has in hand",
            ],
          },
          {
            label: "Expire only (TTL)",
            cells: [
              "Both writes invisible to the cache",
              "A hit on the pre-write value until the key expires",
              "None",
            ],
          },
        ],
        caption: "The three write-path policies, by what each leaves in the cache.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "[[what-is-caching|The anchor]] covers what a cache buys and what a hit ratio measures; this page is " +
          "the read and write path underneath it. The pattern next door — the cache loading its own misses — is " +
          "[[read-through-vs-write-through-cache|read-through and write-through]]. Getting one delete to many " +
          "caches at once is [[cache-invalidation|invalidation]]; what leaves when memory fills is " +
          "[[cache-eviction-policies|eviction]].",
      },
    ],
    implementation: [
      {
        kind: "prose",
        body:
          "Five lines of read, two of write. Microsoft's cache-aside guidance calls out the ordering of those " +
          "two explicitly, and it is the only part of the snippet that is not obvious on sight.",
      },
      {
        kind: "code",
        lang: "typescript",
        source:
          "const TTL_SECONDS = 300;\n" +
          "const key = (id: string) => `product:${id}`;\n" +
          "\n" +
          "const readProduct = async (id: string): Promise<Product | null> => {\n" +
          "  const cached = await cache.get(key(id));\n" +
          "  if (cached !== null) return JSON.parse(cached) as Product;\n" +
          "  const row = await store.readProduct(id);\n" +
          "  if (row) await cache.set(key(id), JSON.stringify(row), TTL_SECONDS);\n" +
          "  return row;\n" +
          "};\n" +
          "\n" +
          "const writeProduct = async (id: string, patch: ProductPatch) => {\n" +
          "  await store.updateProduct(id, patch);\n" +
          "  // Commit first: a key dropped before the commit can be refilled with the pre-write row.\n" +
          "  await cache.del(key(id));\n" +
          "};",
        caption: "Cache-aside in full. Every branch above is a place the pattern can be implemented wrong.",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "One key, `product:918`, on a catalog serving **20,000 reads per second** — an assumed peak, not a " +
          "measurement. Two admins edit the same price within a few milliseconds: A sets it to 10, B to 12. The " +
          "store serialises them on the row lock, so it commits 10 then 12 and ends up correct. The two cache " +
          "calls that follow are separate network operations, and nothing orders them against each other.",
      },
      {
        kind: "sequence",
        actors: ["Writer A", "Writer B", "Cache", "Store"],
        steps: [
          { from: "Writer A", to: "Store", label: "UPDATE price = 10", note: "Commits first." },
          {
            from: "Writer B",
            to: "Store",
            label: "UPDATE price = 12",
            note: "The store now holds 12 and will keep holding it.",
          },
          { from: "Writer B", to: "Cache", label: "SET price = 12 — update policy" },
          {
            from: "Writer A",
            to: "Cache",
            label: "SET price = 10 — A's call was delayed and lands last",
            note: "Cache holds 10; every read is a hit, so nothing re-consults the store until the TTL runs out.",
          },
          { from: "Writer B", to: "Cache", label: "DEL price — delete policy, same race replayed" },
          {
            from: "Writer A",
            to: "Cache",
            label: "DEL price — lands last again",
            note: "A delete on an absent key changes nothing, so either ordering ends with the key gone.",
          },
        ],
        caption:
          "One reordering, run twice. The last four steps are the same race under each write policy.",
      },
      {
        kind: "prose",
        body:
          "Under the update policy the cache is left holding a value the store no longer has, and no reader will " +
          "discover it, because a stale hit is still a hit. Under the delete policy the two operations are " +
          "interchangeable: Redis documents `DEL` as ignoring a key that does not exist, so whichever lands " +
          "second is a no-op and both orderings converge on *absent* — a state that is never wrong, only " +
          "slower. Nishtala et al. give this as Facebook's reason for deleting rather than updating: deletes are " +
          "idempotent, and memcache is not the authoritative source of the data.\n\n" +
          "The discipline is cheap precisely because most of those deletes hit nothing. The same paper reports " +
          "that only 4% of the deletes its invalidation pipeline issues result in an actual invalidation.\n\n" +
          "The other half of the bill is the fill. AWS counts a miss as three trips rather than one, and the " +
          "pattern pays that again every time a key expires or is evicted. How often it comes round has a floor " +
          "you can compute before any traffic exists.",
      },
      {
        kind: "numbers",
        rows: [
          {
            quantity: "Distinct keys kept",
            value: "200,000",
            derivation: "Assumption: the products kept hot — each one re-read inside every TTL window.",
          },
          {
            quantity: "TTL on each key",
            value: "300 s",
            derivation: "Assumption: five minutes of tolerated staleness.",
          },
          {
            quantity: "Fills forced by expiry alone",
            value: "667/s",
            derivation: "200,000 ÷ 300 s — each key expires once per window and the next reader refills it.",
          },
          {
            quantity: "The same floor at a 150 s TTL",
            value: "1,333/s",
            derivation: "200,000 ÷ 150 s — halving the window doubles the fills.",
          },
          {
            quantity: "Floor on the miss rate at the assumed peak",
            value: "3.3%",
            derivation: "667 ÷ 20,000 — expiry only; evictions, restarts and brand-new keys land on top.",
          },
        ],
        caption: "The first-read penalty, priced as a rate the store must serve no matter what.",
      },
      {
        kind: "prose",
        body:
          "Request volume appears nowhere in that arithmetic. Serve 2,000 reads a second or 20,000 and the same " +
          "667 fills still have to be paid, because the rate is set by how many keys you keep and how long you " +
          "keep them.\n\n" +
          "That holds while traffic is heavy enough that every kept key is asked for again inside its window. " +
          "Under heavy skew the cold tail expires unrequested, and the real figure is lower.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you gain", "What you give up", "When it bites"],
        rows: [
          {
            label: "Cache logic in your code",
            cells: [
              "Per-key decisions made where the data is understood — key shape, lifetime, what is never cached at all",
              "No mechanism makes two call sites agree on the key format, and nothing fails loudly when they don't",
              "When a second service caches the same row under a different key format: two half-populated copies, and a delete that clears one of them",
            ],
          },
          {
            label: "Delete instead of update",
            cells: [
              "Concurrent writes converge whatever order their cache calls land in",
              "Not one slow read but as many simultaneous ones as the key is popular",
              "On a key written often and read constantly — the more popular it is, the more readers meet it empty at once ([[cache-stampede|stampede]] is that taken to its limit)",
            ],
          },
          {
            label: "The cache as an optional dependency",
            cells: [
              "A cache outage degrades reads to store latency instead of failing them",
              "A fallback path that lives in your code and is exercised only during incidents, including the timeout that decides how long a read waits before giving up",
              "When the cache is slow rather than down: reads pay the timeout *and* the store, so the cheapest path in the system becomes the most expensive",
            ],
          },
          {
            label: "Filling on demand",
            cells: [
              "Memory holds only the keys somebody actually asked for",
              "A cache that learns from traffic rather than from value — anything requested once is stored, including keys nobody will ask for twice",
              "During a scan or a bulk import that walks keys in order: the fill path pushes out the hot set it took hours to build, and the [[cache-eviction-policies|eviction policy]] is all that pushes back",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Rows one and three are the same bill in different currencies: control comes from putting the cache in " +
          "application code, so each failure mode arrives as a code path you own and have to test. Rows two and " +
          "four are what a demand-filled cache costs — it holds what was asked for, and nothing else.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Firing the delete and not caring whether it landed.** A write that returns as soon as the store " +
            "commits, with the `DEL` in flight behind it, cannot notice a dropped one — and a dropped one is " +
            "invisible, since the cache goes on answering happily. Retry it, and put the failure somewhere you " +
            "will see it.",
          "**Filling from a replica.** The read path and the write path need not talk to the same node. Update " +
            "the primary, delete the key, then let the next fill read a lagging [[read-replicas|read replica]], " +
            "and you have written the old row back into the cache — where it sits for a full TTL, having " +
            "survived a correct invalidation.",
          "**No policy for a row that isn't there.** Never caching the absence makes every lookup of an " +
            "unknown id a store query, which a caller who can generate ids turns into a load test. Caching it " +
            "hides the row somebody inserts a second later. Decide per key class, and keep negative entries " +
            "short-lived.",
          "**Writers that never run your code.** A migration, an admin console or an ETL job writing straight " +
            "to the store issues no delete, so the cached copy survives the change. Route them through the same " +
            "path, or accept the TTL as the only thing that will correct them.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"Why delete rather than update the cache?\"** is the follow-up this pattern always draws, and the " +
            "answer is one sentence: deletes commute, sets don't. The interesting part is what you add next — " +
            "deleting makes concurrent writes *converge*, not the cache *fresh*, and freshness is still whatever " +
            "the TTL says.",
          "**Keep a TTL under the deletes, and say why.** A delete is a message, and messages go missing. " +
            "Nishtala et al. measured Facebook's pipeline at four nines of deletes landing within a second " +
            "inside the master region, three nines when they originate and land outside it. The TTL bounds what " +
            "the missing ones cost.",
          "**Name where the cache code lives.** \"The application manages the cache\" is the pattern; the " +
            "design answer is *which* application code — one data-access module per entity, owning the key " +
            "format, the fill and the delete, rather than the sequence copied into every handler that needs the " +
            "row. It is the cheapest answer to \"how do you stop someone forgetting the delete?\"",
          "**\"Why not write-through?\"** Answer with the workload, not with the pattern's virtues: how often " +
            "the same key is read soon after it is written, and whether any screen needs to show a value the " +
            "instant it is saved. The axis itself is " +
            "[[read-through-vs-write-through-cache|read-through versus write-through]].",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "**A slow fill can undo an invalidation that was issued correctly.** A reader misses and fetches the " +
            "old row, then stalls; the write commits and deletes a key that isn't there yet; the reader's " +
            "write-back finally lands. Nishtala et al. name this a *stale set*, and it is why memcached hands " +
            "out a lease token on a miss and refuses a set whose token a delete has since invalidated.",
          "**Nothing fills a set of keys atomically.** A page assembled from three cache-aside reads can catch " +
            "a write between the second and the third, and the pattern has no way to say the three belong " +
            "together. Per-key freshness is all it offers; anything stronger is a " +
            "[[consistency-models|consistency model]] you implement elsewhere.",
          "**A delete only reaches the cache it was addressed to.** With an in-process cache per service " +
            "instance, the write path clears one heap and leaves every other instance holding its own copy " +
            "until that copy expires. Microsoft says as much about private caches; the usual answer is " +
            "[[distributed-caching|one shared cache]].",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "memcached — Programming with memcached (key design, and `delete` vs `set` for invalidation)",
            url: "https://github.com/memcached/memcached/wiki/Programming",
            type: "article",
          },
          {
            label: "Azure Architecture Center — Caching guidance",
            url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Azure Architecture Center — Cache-Aside pattern",
      url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside",
    },
    {
      label: "Nishtala et al., Scaling Memcache at Facebook (NSDI '13)",
      url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf",
    },
    {
      label: "Amazon ElastiCache — Caching strategies (lazy loading)",
      url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html",
    },
    { label: "Redis — DEL", url: "https://redis.io/docs/latest/commands/del/" },
  ],
} satisfies LearnTopic;
