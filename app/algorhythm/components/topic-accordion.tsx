"use client";

import { Accordion, Chip, Button, ProgressCircle } from "@heroui/react";
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  ChevronDown,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";
import { AlgoQuestion, HeatmapTopic } from "@/lib/store/api/algorhythmApi";
import { useMemo } from "react";

interface TopicAccordionProps {
  topics: HeatmapTopic[];
  searchQuery: string;
  selectedDifficulty: string; // "ALL" | "EASY" | "MEDIUM" | "HARD"
  selectedStatus: string; // "ALL" | "SOLVED" | "UNSOLVED"
  solvedQuestions: Set<string>;
  onToggleSolved: (questionId: string) => void;
  expandedKeys?: string[];
  onExpandedChange?: (keys: string[]) => void;
}

const DIFFICULTY_ORDER = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

const DIFFICULTY_COLOR_MAP = {
  EASY: {
    chipColor: "success" as const,
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  MEDIUM: {
    chipColor: "warning" as const,
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  HARD: {
    chipColor: "danger" as const,
    border: "border-rose-500/20",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

export default function TopicAccordion({
  topics,
  searchQuery,
  selectedDifficulty,
  selectedStatus,
  solvedQuestions,
  onToggleSolved,
}: TopicAccordionProps) {
  // Filter and group questions by topic and difficulty
  const processedTopics = useMemo(() => {
    return topics
      .map((topic) => {
        // Filter questions by search, difficulty, and status
        const filteredQuestions = topic.questions.filter((q) => {
          const matchesSearch =
            searchQuery.trim() === "" ||
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.topic.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDifficulty =
            selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;

          const isSolved = solvedQuestions.has(q.id) || q.status === "MASTERED" || q.status === "REVIEW";
          const matchesStatus =
            selectedStatus === "ALL" ||
            (selectedStatus === "SOLVED" && isSolved) ||
            (selectedStatus === "UNSOLVED" && !isSolved);

          return matchesSearch && matchesDifficulty && matchesStatus;
        });

        if (filteredQuestions.length === 0) return null;

        // Count difficulty counts for total topic
        const easyCount = filteredQuestions.filter((q) => q.difficulty === "EASY").length;
        const mediumCount = filteredQuestions.filter((q) => q.difficulty === "MEDIUM").length;
        const hardCount = filteredQuestions.filter((q) => q.difficulty === "HARD").length;

        const topicSolvedCount = filteredQuestions.filter(
          (q) => solvedQuestions.has(q.id) || q.status === "MASTERED" || q.status === "REVIEW"
        ).length;

        // Group by difficulty inside topic
        const groupedByDifficulty = {
          EASY: filteredQuestions
            .filter((q) => q.difficulty === "EASY")
            .sort((a, b) => a.title.localeCompare(b.title)),
          MEDIUM: filteredQuestions
            .filter((q) => q.difficulty === "MEDIUM")
            .sort((a, b) => a.title.localeCompare(b.title)),
          HARD: filteredQuestions
            .filter((q) => q.difficulty === "HARD")
            .sort((a, b) => a.title.localeCompare(b.title)),
        };

        return {
          name: topic.name,
          totalQuestions: filteredQuestions.length,
          solvedCount: topicSolvedCount,
          easyCount,
          mediumCount,
          hardCount,
          groupedByDifficulty,
        };
      })
      .filter(Boolean) as {
      name: string;
      totalQuestions: number;
      solvedCount: number;
      easyCount: number;
      mediumCount: number;
      hardCount: number;
      groupedByDifficulty: {
        EASY: AlgoQuestion[];
        MEDIUM: AlgoQuestion[];
        HARD: AlgoQuestion[];
      };
    }[];
  }, [topics, searchQuery, selectedDifficulty, selectedStatus, solvedQuestions]);

  if (processedTopics.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-default-200/50 bg-default-100/30">
        <Code2 className="mx-auto h-12 w-12 text-default-400 mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">No questions found</h3>
        <p className="text-sm text-default-500 max-w-sm mx-auto">
          Try adjusting your search query or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Accordion selectionMode="multiple" className="w-full space-y-3">
        {processedTopics.map((topic) => {
          const progressPercent = Math.round(
            (topic.solvedCount / topic.totalQuestions) * 100
          );

          return (
            <Accordion.Item
              key={topic.name}
              className="border border-default-200/60 rounded-xl bg-background/60 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-primary/40 shadow-sm"
            >
              <Accordion.Heading>
                <Accordion.Trigger className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-default-100/40 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {topic.name}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-default-100 text-default-600 font-medium">
                          {topic.solvedCount}/{topic.totalQuestions} solved
                        </span>
                      </div>

                      {/* Difficulty distribution badges */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        {topic.easyCount > 0 && (
                          <span className="text-emerald-500 font-medium">
                            {topic.easyCount} Easy
                          </span>
                        )}
                        {topic.easyCount > 0 && (topic.mediumCount > 0 || topic.hardCount > 0) && (
                          <span className="text-default-300">•</span>
                        )}
                        {topic.mediumCount > 0 && (
                          <span className="text-amber-500 font-medium">
                            {topic.mediumCount} Medium
                          </span>
                        )}
                        {topic.mediumCount > 0 && topic.hardCount > 0 && (
                          <span className="text-default-300">•</span>
                        )}
                        {topic.hardCount > 0 && (
                          <span className="text-rose-500 font-medium">
                            {topic.hardCount} Hard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-1 w-24">
                      <div className="w-full bg-default-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-default-500 font-medium">
                        {progressPercent}%
                      </span>
                    </div>

                    <Accordion.Indicator className="text-default-400 transition-transform duration-200 group-data-[expanded=true]:rotate-180">
                      <ChevronDown className="h-5 w-5" />
                    </Accordion.Indicator>
                  </div>
                </Accordion.Trigger>
              </Accordion.Heading>

              <Accordion.Panel>
                <Accordion.Body className="p-4 pt-1 bg-default-50/20 border-t border-default-100">
                  <div className="space-y-5 mt-2">
                    {(["EASY", "MEDIUM", "HARD"] as const).map((difficulty) => {
                      const questions = topic.groupedByDifficulty[difficulty];
                      if (questions.length === 0) return null;

                      const config = DIFFICULTY_COLOR_MAP[difficulty];

                      return (
                        <div key={difficulty} className="space-y-2">
                          {/* Difficulty section header */}
                          <div className="flex items-center gap-2 px-2 py-1">
                            <span
                              className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${config.badge}`}
                            >
                              {difficulty} ({questions.length})
                            </span>
                            <div className="h-px bg-default-200/60 flex-1" />
                          </div>

                          {/* Question cards list */}
                          <div className="grid grid-cols-1 gap-2">
                            {questions.map((question) => {
                              const isSolved =
                                solvedQuestions.has(question.id) ||
                                question.status === "MASTERED" ||
                                question.status === "REVIEW";

                              return (
                                <div
                                  key={question.id}
                                  className="group/item flex items-center justify-between gap-3 p-3 rounded-lg border border-default-200/50 bg-background/80 hover:bg-default-100/50 transition-all duration-200 hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => onToggleSolved(question.id)}
                                      className="text-default-400 hover:text-primary transition-colors focus:outline-none shrink-0"
                                      title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                                    >
                                      {isSolved ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-default-300 group-hover/item:text-default-400" />
                                      )}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <a
                                        href={question.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 inline-flex items-center gap-1.5 ${
                                          isSolved ? "line-through text-default-400" : ""
                                        }`}
                                      >
                                        {question.title}
                                      </a>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      color={config.chipColor}
                                      className="capitalize text-xs font-medium"
                                    >
                                      {difficulty.toLowerCase()}
                                    </Chip>

                                    <Button
                                      as="a"
                                      href={question.leetcodeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      size="sm"
                                      variant="tertiary"
                                      className="text-xs h-8 px-2.5 gap-1.5 font-medium text-default-600 hover:text-primary"
                                    >
                                      <span>Solve</span>
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}
