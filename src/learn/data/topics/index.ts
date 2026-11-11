import type { LearnTopic, TopicSummary } from "@/learn/data/topic";
import { arrays } from "./arrays";
import { strings } from "./strings";
import { hashMaps } from "./hashMaps";
import { sets } from "./sets";
import { linkedLists } from "./linkedLists";
import { stacks } from "./stacks";
import { queues } from "./queues";
import { trees } from "./trees";
import { binarySearchTrees } from "./binarySearchTrees";
import { heaps } from "./heaps";
import { tries } from "./tries";
import { graphs } from "./graphs";
import { adjacencyMatrix } from "./adjacencyMatrix";
import { matrix } from "./matrix";
import { twoPointers } from "./twoPointers";
import { slidingWindow } from "./slidingWindow";
import { prefixSum } from "./prefixSum";
import { binarySearch } from "./binarySearch";
import { sorting } from "./sorting";
import { recursion } from "./recursion";
import { backtracking } from "./backtracking";
import { breadthFirstSearch } from "./breadthFirstSearch";
import { depthFirstSearch } from "./depthFirstSearch";
import { dynamicProgramming } from "./dynamicProgramming";
import { greedy } from "./greedy";
import { divideAndConquer } from "./divideAndConquer";
import { bitManipulation } from "./bitManipulation";
import { intervals } from "./intervals";
import { unionFind } from "./unionFind";
import { topologicalSort } from "./topologicalSort";
import { math } from "./math";
import { bigO } from "./bigO";
import { relationalDatabases } from "./relationalDatabases";
import { nosqlDatabases } from "./nosqlDatabases";
import { mongodb } from "./mongodb";
import { redis } from "./redis";
import { databaseIndexing } from "./databaseIndexing";
import { clientSideRendering } from "./clientSideRendering";
import { serverSideRendering } from "./serverSideRendering";
import { staticSiteGeneration } from "./staticSiteGeneration";
import { restApis } from "./restApis";
import { cachingAndCdns } from "./cachingAndCdns";
import { whatIsSystemDesign } from "./whatIsSystemDesign";
import { systemDesignInterviewFramework } from "./systemDesignInterviewFramework";
import { scalability } from "./scalability";
import { availability } from "./availability";
import { reliability } from "./reliability";
import { singlePointOfFailureSpof } from "./singlePointOfFailureSpof";
import { latencyVsThroughput } from "./latencyVsThroughput";
import { consistentHashing } from "./consistentHashing";
import { capTheorem } from "./capTheorem";
import { consistencyModels } from "./consistencyModels";
import { loadBalancers } from "./loadBalancers";
import { loadBalancingAlgorithms } from "./loadBalancingAlgorithms";
import { dnsLoadBalancing } from "./dnsLoadBalancing";
import { anycastRouting } from "./anycastRouting";
import { whatIsCaching } from "./whatIsCaching";

/**
 * The learning bank, keyed by slug, in study-plan order: data structures, then algorithms/techniques,
 * then complexity. `satisfies` keeps the key/value relationship checked while each authored topic keeps
 * its precise literal types. Mirrors the `problems` registry shape.
 */
export const topics = {
  // Data structures
  arrays,
  strings,
  "hash-maps": hashMaps,
  sets,
  "linked-lists": linkedLists,
  stacks,
  queues,
  trees,
  "binary-search-trees": binarySearchTrees,
  heaps,
  tries,
  graphs,
  "adjacency-matrix": adjacencyMatrix,
  matrix,
  // Algorithms & techniques
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  "prefix-sum": prefixSum,
  "binary-search": binarySearch,
  sorting,
  recursion,
  backtracking,
  "breadth-first-search": breadthFirstSearch,
  "depth-first-search": depthFirstSearch,
  "dynamic-programming": dynamicProgramming,
  greedy,
  "divide-and-conquer": divideAndConquer,
  "bit-manipulation": bitManipulation,
  intervals,
  "union-find": unionFind,
  "topological-sort": topologicalSort,
  math,
  // Complexity
  "big-o": bigO,
  // Databases
  "relational-databases": relationalDatabases,
  "nosql-databases": nosqlDatabases,
  mongodb,
  redis,
  "database-indexing": databaseIndexing,
  // Web & rendering
  "client-side-rendering": clientSideRendering,
  "server-side-rendering": serverSideRendering,
  "static-site-generation": staticSiteGeneration,
  "rest-apis": restApis,
  // Systems
  "caching-and-cdns": cachingAndCdns,
  // System design — Introduction to system design
  "what-is-system-design": whatIsSystemDesign,
  "system-design-interview-framework": systemDesignInterviewFramework,
  // System design — Core concepts
  scalability,
  availability,
  reliability,
  "single-point-of-failure-spof": singlePointOfFailureSpof,
  "latency-vs-throughput": latencyVsThroughput,
  "consistent-hashing": consistentHashing,
  "cap-theorem": capTheorem,
  "consistency-models": consistencyModels,
  // System design — Load balancing
  "load-balancers": loadBalancers,
  "load-balancing-algorithms": loadBalancingAlgorithms,
  "dns-load-balancing": dnsLoadBalancing,
  "anycast-routing": anycastRouting,
  // System design — Caching
  "what-is-caching": whatIsCaching,
} satisfies Record<string, LearnTopic>;

export type TopicSlug = keyof typeof topics;

export const getTopic = (slug: string): LearnTopic | undefined =>
  (topics as Record<string, LearnTopic>)[slug];

export const listTopics = (): LearnTopic[] => Object.values(topics);

/** Client-safe list for the landing grid + search — drops the article `sections`. */
export const listTopicSummaries = (): TopicSummary[] =>
  listTopics().map(({ slug, title, category, summary, tags, parent }) => ({
    slug,
    title,
    category,
    summary,
    tags,
    parent,
  }));
