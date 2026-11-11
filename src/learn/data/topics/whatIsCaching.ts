import type { LearnTopic } from "@/learn/data/topic";

export const whatIsCaching = {
  slug: "what-is-caching",
  title: "What is caching?",
  category: "systems",
  archetype: "mechanism",
  summary:
    "Keep a copy of an expensive result close to the request — and pay for it in staleness.",
  tags: ["caching", "scalability", "backend"],
  priority: "high",
  estimatedMinutes: 18,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **cache** is a fast store holding a copy of a result you already computed or fetched, keyed so the " +
          "next request for the same thing can skip the work. That copy is what you are buying: a read that " +
          "would have cost a query, a plan and a disk seek becomes a memory lookup.\n\n" +
          "The copy is also the price. A cached value is a bet that the source has not changed since you took " +
          "it, and whoever reads next settles the bet — so a cache buys latency and origin relief with " +
          "**staleness**. The usual way to bound the bet is a **TTL**, a per-key expiry after which a read is " +
          "treated as a miss and goes back to the source. AWS documents TTL as exactly that, and is explicit " +
          "that it does not guarantee a value is never stale — only that it keeps one from getting *too* " +
          "stale.\n\n" +
          "Two words carry the rest of the chapter. A **cache hit** is a read the cache answers by itself; a " +
          "**cache miss** is one it cannot, which falls through to the source and pays the full cost. The " +
          "**hit ratio** is hits over hits plus misses — and on its own it says nothing, because what it is " +
          "worth depends entirely on what a miss costs.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a cache when a read is **expensive, repeated, and tolerant of being slightly old** — all " +
          "three. A product page assembled from six queries and viewed ten thousand times an hour is the shape. " +
          "The same page viewed once is not, and neither is a lookup an index already answers in a millisecond.\n\n" +
          "Repetition is usually more extreme than people expect, which is what makes caching pay at all. " +
          "Nishtala et al. report that on Facebook's memcached fleet a single key can account for 20% of one " +
          "server's requests. You are not caching the data; you are caching the head of a very skewed " +
          "distribution, and a tier sized to that head captures most of the benefit.\n\n" +
          "Wrong page when the workload is write-heavy, when every read must reflect the last write, or when " +
          "recomputing the value is cheaper than the network hop it takes to ask for it.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "Caching is less a component than a position, and a single read can pass through five of them. A " +
          "**browser cache** holds responses on the user's own device under HTTP `Cache-Control` and `ETag`. " +
          "A **CDN cache** holds them at an edge near the user — [[content-delivery-network-cdn|CDNs]] own " +
          "that layer, including how an edge gets picked. An **application cache** lives in the service " +
          "process's own heap, so a read of it crosses no network at all. A **distributed cache** — Redis, " +
          "Memcached — is a separate service every instance talks to across the network; " +
          "[[distributed-caching|distributed caching]] covers its topology. A **database buffer pool** keeps hot " +
          "pages in the database's memory and is managed for you.\n\n" +
          "Naming which one you mean is not pedantry: it decides who is able to remove an entry. You can delete " +
          "a key from Redis in a millisecond. You cannot reach into a browser that already has your response.",
      },
      {
        kind: "comparison",
        columns: ["", "Who can remove an entry", "Copies of one value", "Readers served per entry"],
        rows: [
          {
            label: "Browser",
            cells: [
              "Only the user's browser — unless you asked for revalidation, in which case the origin decides on the next conditional request",
              "One per device",
              "One",
            ],
          },
          {
            label: "CDN edge",
            cells: [
              "You, through a purge API, edge by edge",
              "One per point of presence",
              "Everyone routed to that edge",
            ],
          },
          {
            label: "Application (in-process)",
            cells: [
              "The process itself — or a restart",
              "One per service instance",
              "Everyone that instance serves",
            ],
          },
          {
            label: "Distributed cache",
            cells: [
              "Any client, by key, immediately",
              "One per cache node",
              "Every instance in the fleet",
            ],
          },
          {
            label: "Database buffer pool",
            cells: [
              "Nobody — the engine's own replacement policy",
              "One per database node",
              "Every query on that node",
            ],
          },
        ],
        caption: "The five layers, by the axis that matters operationally: reach, and who controls it.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "This page owns the definition, the layers as a map, and the hit ratio. What the layers are made of " +
          "belongs to siblings. *How* an application talks to a cache is [[cache-aside-pattern|cache-aside]], " +
          "[[read-through-vs-write-through-cache|read-through and write-through]], and " +
          "[[write-behind-cache|write-behind]], set side by side in [[caching-strategies|caching strategies]]. " +
          "What leaves when memory fills is [[cache-eviction-policies|eviction policy]]. Dropping a key the " +
          "moment its source changes, instead of waiting out a TTL, is [[cache-invalidation|invalidation]]. Two " +
          "failure modes have pages of their own: a popular key expiring under load " +
          "([[cache-stampede|cache stampede]]) and an empty cache after a restart ([[cache-warming|warming]]).",
      },
    ],
    implementation: [
      {
        kind: "prose",
        body:
          "A cache is a key-value store, so the key is the whole contract. It has to be a pure function of the " +
          "request, and every input the response varies on has to appear in it.",
      },
      {
        kind: "code",
        lang: "typescript",
        source:
          "const CACHE_VERSION = \"v2\"; // bump when the stored shape changes: retires every old entry at once\n" +
          "const TTL_SECONDS = 300; // the staleness this field tolerates — not the freshness we would prefer\n" +
          "\n" +
          "type ProductRequest = { id: string; locale: string; currency: string };\n" +
          "\n" +
          "const productKey = ({ id, locale, currency }: ProductRequest) =>\n" +
          "  `product:${CACHE_VERSION}:${id}:${locale}:${currency}`;\n" +
          "\n" +
          "// productKey({ id: \"91\", locale: \"en-GB\", currency: \"GBP\" }) === \"product:v2:91:en-GB:GBP\"",
        caption: "Key derivation for a cached product record. The read path itself is cache-aside's subject.",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "Take a product-detail read path at **20,000 reads per second** at peak, against a database read that " +
          "costs **20 ms** and a distributed cache lookup that costs **1 ms**. All three are assumptions a " +
          "candidate would state out loud, not measurements — the arithmetic is the point, and it holds at any " +
          "inputs.\n\n" +
          "A miss pays both hops: 1 ms to ask the cache and be told no, then 20 ms at the database. So mean " +
          "latency is the hit ratio against 1 ms plus the miss ratio against 21 ms, and the database sees the " +
          "misses and nothing else.",
      },
      {
        kind: "numbers",
        rows: [
          {
            quantity: "Cache lookup",
            value: "1 ms",
            derivation: "Assumed input — an in-memory lookup one network hop away.",
          },
          {
            quantity: "Miss path",
            value: "21 ms",
            derivation: "1 ms to miss in the cache + 20 ms assumed database read.",
          },
          {
            quantity: "Mean latency at 95% hits",
            value: "2.0 ms",
            derivation: "0.95 × 1 ms + 0.05 × 21 ms = 0.95 + 1.05.",
          },
          {
            quantity: "Share of that mean spent on misses",
            value: "53%",
            derivation: "1.05 / 2.0 = 0.525 — the miss term over the total.",
          },
          {
            quantity: "Mean latency at 90% hits",
            value: "3.0 ms",
            derivation: "0.90 × 1 ms + 0.10 × 21 ms = 0.9 + 2.1 — five points of ratio, 50% worse mean.",
          },
          {
            quantity: "Database reads/s at 95% hits",
            value: "1,000/s",
            derivation: "20,000 reads/s × 0.05.",
          },
          {
            quantity: "Database reads/s at 90% hits",
            value: "2,000/s",
            derivation: "20,000 × 0.10 — the same five points double origin load.",
          },
          {
            quantity: "Database reads/s at a measured 1.76% miss rate",
            value: "352/s",
            derivation:
              "20,000 × 0.0176; miss rate is Facebook's wildcard memcache pool per server (Nishtala et al., Table 2), which the caption calls a 7-day average and §7.2 describes as the highest 4-minute average over a month — closer to peak than to steady state.",
          },
        ],
        caption: "Hit ratio priced two ways: what the reader waits for, and what the origin has to survive.",
      },
      {
        kind: "prose",
        body:
          "Two things fall out. Misses are one request in twenty and more than half the wait, which is why the " +
          "number worth tuning is the *miss path* — and why a p99 over this workload is really a measurement of " +
          "the database, not of the cache.\n\n" +
          "And origin load moves inversely with a ratio people quote as though it were nearly maxed out at 95%. " +
          "Serviceable read throughput stops being bounded by what the database can serve and becomes what the " +
          "database can serve *divided by the miss rate*. That is the sense in which one component buys both " +
          "halves of [[latency-vs-throughput|latency and throughput]]: a shorter path for the reader, and less " +
          "work reaching the part of the system that cannot be replicated cheaply.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you gain", "What you give up", "When the cost bites"],
        rows: [
          {
            label: "The TTL dial",
            cells: [
              "Every second of TTL is origin reads you never pay for",
              "A bounded window in which readers see a superseded value",
              "When a write and a read of one key straddle the window — a price changed at 10:00 and honoured until 10:05",
            ],
          },
          {
            label: "Memory footprint",
            cells: [
              "Origin reads fall in proportion to how much of the hot set fits",
              "A memory tier provisioned and paid for at hot-set size",
              "When the hot set outgrows the tier — the ratio tapers, so the tier stops paying for itself long before it stops working ([[cache-eviction-policies|eviction policies]])",
            ],
          },
          {
            label: "A second system",
            cells: [
              "A read tier you can size, restart and fail independently of the database",
              "Something new that can be up, down, slow, or confidently wrong",
              "Mid-incident, when every debugging session now opens with \"is this value stale?\"",
            ],
          },
          {
            label: "Capacity planning",
            cells: [
              "Growth in read traffic lands on the cache rather than on origin hardware",
              "An origin sized for the miss rate instead of the request rate",
              "The first minute after any event that empties it",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "No row here moves alone. A shorter TTL buys freshness by costing hit ratio; the hits you lose are " +
          "origin load you then have to provision for. Adopting a cache means picking one point along that chain " +
          "and " +
          "being able to say why that point.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Caching what was already cheap.** You have added a hop, a copy to keep honest, and a fresh way to " +
            "be wrong, for no measurable gain — and you now maintain all three forever.",
          "**Treating the cache as the store.** A cache can drop a key you never told it to drop. Redis " +
            "documents that once `maxmemory` is reached it evicts by the configured policy until usage is back " +
            "under the limit — safe, in its own words, precisely because entries are copies of data persisted " +
            "elsewhere. Anything living only in cache is data you have already lost.",
          "**Quoting a ratio with no miss cost attached.** Report the pair, and watch the " +
            "eviction rate beside it: a steady ratio with climbing evictions means the working set is about to " +
            "stop fitting.",
          "**A key missing something the response varies on.** Locale, currency, feature flag, and above all " +
            "the viewer's identity — omit one and the cache will faithfully hand the first user's answer to the " +
            "second. This is where an authorization bug becomes a data leak.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**Quantify the box.** \"Put a cache in front of it\" is a drawing; naming the ratio you expect and " +
            "the load that leaves the origin is a design. The follow-up is *why that ratio*, and the answer is " +
            "a sizing argument — hot set against memory bought, the same argument " +
            "[[system-design-interview-framework|the interview framework]] uses to refuse a distributed cache " +
            "at 5 GB.",
          "**Answer the staleness question with a number.** \"Eventually consistent\" is a shrug. \"Product " +
            "description: 10 minutes. Stock count: 30 seconds. Price at checkout: never cached.\" The " +
            "granularity is the signal — it says you priced each read rather than the system.",
          "**Name a read you deliberately left uncached.** Most candidates cache everything on the diagram. A " +
            "stated exclusion shows you treated the copy as something that costs, not as free speed.",
          "**Have an answer for \"why not just add read replicas?\"** They fix different halves: a " +
            "[[read-replicas|read replica]] adds machines doing the same work, a cache removes the work. A " +
            "replica still executes every query — the I/O and the row assembly; a cache returns a finished answer. Read-heavy systems " +
            "usually end up with both, and the cache goes in front.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "**A cold cache serves nothing.** The Google SRE book's chapter on cascading failures puts it flatly: " +
            "with a completely empty cache, 100% of requests are costly, and a service not provisioned to run " +
            "that way is at greater risk of outage. A new cluster, a restart, or a flush each produce one — " +
            "filling it before traffic arrives is [[cache-warming|cache warming]].",
          "**What happens when the cache is down is decided in advance, not during the incident.** *Fail open* " +
            "sends misses to the origin and may take it with you; *fail closed* returns errors and keeps the " +
            "origin alive; serving the last known value keeps you up on data you know is wrong. Which one is " +
            "right depends on whether the origin can carry the uncached rate — a number the hit-ratio arithmetic " +
            "above already gives you.",
          "**Your hit ratio belongs to your traffic, not to your cache.** A crawler walking the long tail, a " +
            "campaign that changes which items are hot, or a client version that keys requests differently can " +
            "halve it overnight with nothing inside the system having changed. It moves before latency does, " +
            "which makes it the metric worth alerting on.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "RFC 9111 — HTTP Caching",
            url: "https://www.rfc-editor.org/rfc/rfc9111.html",
            type: "doc",
          },
          {
            label: "memcached — Overview (project wiki)",
            url: "https://github.com/memcached/memcached/wiki/Overview",
            type: "article",
          },
          {
            label: "PostgreSQL — shared_buffers and the buffer pool",
            url: "https://www.postgresql.org/docs/current/runtime-config-resource.html",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Nishtala et al., Scaling Memcache at Facebook (NSDI '13)",
      url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf",
    },
    {
      label: "Google SRE Book — Addressing Cascading Failures",
      url: "https://sre.google/sre-book/addressing-cascading-failures/",
    },
    {
      label: "Amazon ElastiCache — Caching strategies (TTL, hits and misses)",
      url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html",
    },
    { label: "Redis — Key eviction", url: "https://redis.io/docs/latest/develop/reference/eviction/" },
  ],
} satisfies LearnTopic;
