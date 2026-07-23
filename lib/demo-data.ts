import { AlgoQuestion, HeatmapData } from "@/lib/store/api/algorhythmApi";

/**
 * Generate realistic demo heatmap data so new users can preview the Memory Matrix.
 * Simulates a user who has solved ~40 problems with varying retention levels.
 */
export function generateDemoHeatmapData(): HeatmapData {
  const now = new Date();

  const demoTopics: { name: string; problems: { title: string; difficulty: "EASY" | "MEDIUM" | "HARD"; daysAgo: number | null; status: "UNSEEN" | "LEARNING" | "REVIEW" | "MASTERED"; interval: number }[] }[] = [
    {
      name: "Arrays & Hashing",
      problems: [
        { title: "Contains Duplicate", difficulty: "EASY", daysAgo: 0, status: "MASTERED", interval: 30 },
        { title: "Valid Anagram", difficulty: "EASY", daysAgo: 1, status: "MASTERED", interval: 20 },
        { title: "Two Sum", difficulty: "EASY", daysAgo: 2, status: "REVIEW", interval: 6 },
        { title: "Group Anagrams", difficulty: "MEDIUM", daysAgo: 5, status: "REVIEW", interval: 4 },
        { title: "Top K Frequent Elements", difficulty: "MEDIUM", daysAgo: 8, status: "REVIEW", interval: 3 },
        { title: "Product of Array Except Self", difficulty: "MEDIUM", daysAgo: 14, status: "LEARNING", interval: 2 },
        { title: "Valid Sudoku", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Encode and Decode Strings", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Longest Consecutive Sequence", difficulty: "MEDIUM", daysAgo: 20, status: "LEARNING", interval: 1 },
      ],
    },
    {
      name: "Two Pointers",
      problems: [
        { title: "Valid Palindrome", difficulty: "EASY", daysAgo: 0, status: "MASTERED", interval: 25 },
        { title: "Two Sum II", difficulty: "MEDIUM", daysAgo: 3, status: "REVIEW", interval: 6 },
        { title: "3Sum", difficulty: "MEDIUM", daysAgo: 7, status: "REVIEW", interval: 3 },
        { title: "Container With Most Water", difficulty: "MEDIUM", daysAgo: 12, status: "LEARNING", interval: 2 },
        { title: "Trapping Rain Water", difficulty: "HARD", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Sliding Window",
      problems: [
        { title: "Best Time to Buy and Sell Stock", difficulty: "EASY", daysAgo: 1, status: "MASTERED", interval: 15 },
        { title: "Longest Substring Without Repeating", difficulty: "MEDIUM", daysAgo: 4, status: "REVIEW", interval: 5 },
        { title: "Longest Repeating Character Replacement", difficulty: "MEDIUM", daysAgo: 10, status: "LEARNING", interval: 2 },
        { title: "Minimum Window Substring", difficulty: "HARD", daysAgo: 18, status: "LEARNING", interval: 1 },
        { title: "Permutation in String", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Sliding Window Maximum", difficulty: "HARD", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Stack",
      problems: [
        { title: "Valid Parentheses", difficulty: "EASY", daysAgo: 0, status: "MASTERED", interval: 30 },
        { title: "Min Stack", difficulty: "MEDIUM", daysAgo: 2, status: "REVIEW", interval: 8 },
        { title: "Evaluate Reverse Polish Notation", difficulty: "MEDIUM", daysAgo: 6, status: "REVIEW", interval: 4 },
        { title: "Generate Parentheses", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Daily Temperatures", difficulty: "MEDIUM", daysAgo: 9, status: "LEARNING", interval: 2 },
        { title: "Car Fleet", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Largest Rectangle in Histogram", difficulty: "HARD", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Binary Search",
      problems: [
        { title: "Binary Search", difficulty: "EASY", daysAgo: 1, status: "MASTERED", interval: 20 },
        { title: "Search a 2D Matrix", difficulty: "MEDIUM", daysAgo: 3, status: "REVIEW", interval: 5 },
        { title: "Koko Eating Bananas", difficulty: "MEDIUM", daysAgo: 11, status: "LEARNING", interval: 2 },
        { title: "Find Minimum in Rotated Sorted Array", difficulty: "MEDIUM", daysAgo: 15, status: "LEARNING", interval: 1 },
        { title: "Search in Rotated Sorted Array", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Time Based Key Value Store", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Median of Two Sorted Arrays", difficulty: "HARD", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Linked List",
      problems: [
        { title: "Reverse Linked List", difficulty: "EASY", daysAgo: 0, status: "MASTERED", interval: 30 },
        { title: "Merge Two Sorted Lists", difficulty: "EASY", daysAgo: 2, status: "REVIEW", interval: 10 },
        { title: "Linked List Cycle", difficulty: "EASY", daysAgo: 5, status: "REVIEW", interval: 4 },
        { title: "Reorder List", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Remove Nth Node From End", difficulty: "MEDIUM", daysAgo: 7, status: "LEARNING", interval: 2 },
        { title: "Add Two Numbers", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Trees",
      problems: [
        { title: "Invert Binary Tree", difficulty: "EASY", daysAgo: 1, status: "MASTERED", interval: 25 },
        { title: "Maximum Depth of Binary Tree", difficulty: "EASY", daysAgo: 2, status: "MASTERED", interval: 18 },
        { title: "Same Tree", difficulty: "EASY", daysAgo: 4, status: "REVIEW", interval: 6 },
        { title: "Subtree of Another Tree", difficulty: "EASY", daysAgo: 6, status: "REVIEW", interval: 4 },
        { title: "Lowest Common Ancestor", difficulty: "MEDIUM", daysAgo: 10, status: "LEARNING", interval: 2 },
        { title: "Binary Tree Level Order Traversal", difficulty: "MEDIUM", daysAgo: 13, status: "LEARNING", interval: 1 },
        { title: "Validate BST", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Kth Smallest Element in BST", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Graphs",
      problems: [
        { title: "Number of Islands", difficulty: "MEDIUM", daysAgo: 3, status: "REVIEW", interval: 5 },
        { title: "Clone Graph", difficulty: "MEDIUM", daysAgo: 8, status: "LEARNING", interval: 2 },
        { title: "Pacific Atlantic Water Flow", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Course Schedule", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Graph Valid Tree", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
    {
      name: "Dynamic Programming",
      problems: [
        { title: "Climbing Stairs", difficulty: "EASY", daysAgo: 2, status: "REVIEW", interval: 8 },
        { title: "House Robber", difficulty: "MEDIUM", daysAgo: 5, status: "REVIEW", interval: 4 },
        { title: "House Robber II", difficulty: "MEDIUM", daysAgo: 9, status: "LEARNING", interval: 2 },
        { title: "Longest Palindromic Substring", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
        { title: "Coin Change", difficulty: "MEDIUM", daysAgo: 16, status: "LEARNING", interval: 1 },
        { title: "Word Break", difficulty: "MEDIUM", daysAgo: null, status: "UNSEEN", interval: 0 },
      ],
    },
  ];

  const topics = demoTopics.map((topic) => ({
    name: topic.name,
    questions: topic.problems.map((p, idx) => {
      const lastReviewed = p.daysAgo !== null
        ? new Date(now.getTime() - p.daysAgo * 24 * 60 * 60 * 1000).toISOString()
        : null;

      return {
        id: `demo-${topic.name}-${idx}`,
        title: p.title,
        slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        difficulty: p.difficulty,
        topic: topic.name,
        leetcodeUrl: `https://leetcode.com/problems/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`,
        status: p.status,
        nextReviewDate: lastReviewed
          ? new Date(new Date(lastReviewed).getTime() + p.interval * 24 * 60 * 60 * 1000).toISOString()
          : null,
        lastReviewedAt: lastReviewed,
        intervalDays: p.interval,
        easeFactor: 2.5,
        reviewCount: p.status === "MASTERED" ? 5 : p.status === "REVIEW" ? 3 : p.status === "LEARNING" ? 1 : 0,
      } as AlgoQuestion;
    }),
  }));

  const allQuestions = topics.flatMap((t) => t.questions);
  const nowDate = new Date();

  return {
    topics,
    stats: {
      totalSolved: allQuestions.filter((q) => q.status !== "UNSEEN").length,
      dueToday: allQuestions.filter((q) => q.nextReviewDate && new Date(q.nextReviewDate) <= nowDate).length,
      decaying: allQuestions.filter((q) => {
        if (q.status === "UNSEEN" || q.status === "MASTERED") return false;
        if (!q.lastReviewedAt) return false;
        const daysSince = (nowDate.getTime() - new Date(q.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince > 3;
      }).length,
      mastered: allQuestions.filter((q) => q.status === "MASTERED").length,
    },
  };
}
