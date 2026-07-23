"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ProgressCircle,
  Chip,
  Input,
  Select,
  Label,
  ListBox,
  Button,
  Key,
} from "@heroui/react";
import { Search, Code2, Filter, LogIn, UserPlus } from "lucide-react";
import {
  useGetHeatmapDataQuery,
  useGetQuestionsQuery,
} from "@/lib/store/api/algorhythmApi";
import { generateDemoHeatmapData } from "@/lib/demo-data";
import { useAppSelector } from "@/lib/store/hooks";
import NextLink from "next/link";
import TopicAccordion from "./components/topic-accordion";
import CircularProgressTracker from "./components/circular-progress-tracker";

const DIFFICULTY_OPTIONS = [
  { id: "ALL", name: "All Difficulty" },
  { id: "EASY", name: "Easy" },
  { id: "MEDIUM", name: "Medium" },
  { id: "HARD", name: "Hard" },
];

const STATUS_OPTIONS = [
  { id: "ALL", name: "All Status" },
  { id: "SOLVED", name: "Solved" },
  { id: "UNSOLVED", name: "Unsolved" },
];

export default function AlgorhythmPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: heatmapData, isLoading: isLoadingHeatmap } =
    useGetHeatmapDataQuery(undefined, { skip: !isAuthenticated });
  const { data: questionsData, isLoading: isLoadingQuestions } =
    useGetQuestionsQuery(undefined, { skip: !isAuthenticated });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Key>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<Key>("ALL");
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(
    new Set()
  );

  // Use demo data if API returns empty/no activity or while logged out
  const fallbackData = useMemo(() => generateDemoHeatmapData(), []);

  const displayData = useMemo(() => {
    if (isAuthenticated && heatmapData && heatmapData.topics && heatmapData.topics.length > 0) {
      return heatmapData;
    }
    return fallbackData;
  }, [isAuthenticated, heatmapData, fallbackData]);

  // Sync initial solved status from data
  useEffect(() => {
    if (displayData?.topics) {
      const initialSolved = new Set<string>();
      displayData.topics.forEach((t) => {
        t.questions.forEach((q) => {
          if (q.status === "MASTERED" || q.status === "REVIEW") {
            initialSolved.add(q.id);
          }
        });
      });
      setSolvedQuestions(initialSolved);
    }
  }, [displayData]);

  const handleToggleSolved = (questionId: string) => {
    setSolvedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Compute aggregate statistics
  const stats = useMemo(() => {
    if (!displayData?.topics) {
      return {
        total: 0,
        solved: 0,
        easyTotal: 0,
        easySolved: 0,
        mediumTotal: 0,
        mediumSolved: 0,
        hardTotal: 0,
        hardSolved: 0,
      };
    }

    let total = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    displayData.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        total++;
        const isSolved =
          solvedQuestions.has(q.id) ||
          q.status === "MASTERED" ||
          q.status === "REVIEW";

        if (q.difficulty === "EASY") {
          easyTotal++;
          if (isSolved) easySolved++;
        } else if (q.difficulty === "MEDIUM") {
          mediumTotal++;
          if (isSolved) mediumSolved++;
        } else if (q.difficulty === "HARD") {
          hardTotal++;
          if (isSolved) hardSolved++;
        }
      });
    });

    const solved = solvedQuestions.size;

    return {
      total,
      solved,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
    };
  }, [displayData, solvedQuestions]);

  if (isAuthenticated && isLoadingHeatmap && isLoadingQuestions) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <ProgressCircle
          size="lg"
          aria-label="Loading questions..."
          isIndeterminate
        />
        <p className="text-sm text-default-500 font-medium">
          Loading Question Bank...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Logged Out Guest Banner */}
      {!isAuthenticated && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Guest Preview Mode
                </h3>
                <Chip size="sm" color="primary" variant="flat" className="text-[11px] font-semibold">
                  Preview
                </Chip>
              </div>
              <p className="text-xs text-default-500 mt-0.5">
                You are currently exploring the DSA Question Bank in preview mode. Log in or create an account to save your solving progress!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              as={NextLink}
              href="/login"
              color="primary"
              size="sm"
              className="flex-1 sm:flex-initial text-xs font-semibold gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In</span>
            </Button>
            <Button
              as={NextLink}
              href="/signup"
              variant="tertiary"
              size="sm"
              className="flex-1 sm:flex-initial text-xs font-semibold gap-1.5 text-default-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </Button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-default-200/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                AlgoRhythm
              </h1>
              <Chip color="primary" variant="flat" size="sm" className="font-semibold">
                DSA Vault
              </Chip>
            </div>
            <p className="text-default-500 text-sm">
              Curated Data Structures & Algorithms practice roadmap.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Question Bank */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Bank Header & Filtering Toolbar */}
          <div className="p-4 rounded-2xl border border-default-200/60 bg-background/80 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">
                  Question Bank
                </h2>
              </div>
            </div>

            {/* Filter Bar: Search Input & HeroUI Select Components */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Search Input */}
              <div className="sm:col-span-6">
                <Input
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Search className="h-4 w-4 text-default-400" />}
                  size="sm"
                  variant="flat"
                  isClearable
                  onClear={() => setSearchQuery("")}
                  className="w-full"
                />
              </div>

              {/* Difficulty Select Dropdown (HeroUI Select) */}
              <div className="sm:col-span-3">
                <Select
                  className="w-full"
                  value={selectedDifficulty}
                  onChange={(val) => setSelectedDifficulty(val || "ALL")}
                  size="sm"
                >
                  <Label className="text-[11px] font-semibold text-default-500 uppercase tracking-wider mb-1 block">
                    Difficulty
                  </Label>
                  <Select.Trigger className="w-full h-9 rounded-lg border border-default-200 bg-default-100/60 px-3 py-1 text-xs font-medium">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {DIFFICULTY_OPTIONS.map((opt) => (
                        <ListBox.Item
                          key={opt.id}
                          id={opt.id}
                          textValue={opt.name}
                          className="text-xs py-1.5"
                        >
                          {opt.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Status Select Dropdown (HeroUI Select) */}
              <div className="sm:col-span-3">
                <Select
                  className="w-full"
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val || "ALL")}
                  size="sm"
                >
                  <Label className="text-[11px] font-semibold text-default-500 uppercase tracking-wider mb-1 block">
                    Status
                  </Label>
                  <Select.Trigger className="w-full h-9 rounded-lg border border-default-200 bg-default-100/60 px-3 py-1 text-xs font-medium">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {STATUS_OPTIONS.map((opt) => (
                        <ListBox.Item
                          key={opt.id}
                          id={opt.id}
                          textValue={opt.name}
                          className="text-xs py-1.5"
                        >
                          {opt.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Accordions View */}
          {displayData?.topics && (
            <TopicAccordion
              topics={displayData.topics}
              searchQuery={searchQuery}
              selectedDifficulty={String(selectedDifficulty)}
              selectedStatus={String(selectedStatus)}
              solvedQuestions={solvedQuestions}
              onToggleSolved={handleToggleSolved}
            />
          )}
        </div>

        {/* Right Column: Problem Solving Dashboard (Fixed/Sticky Sidebar) */}
        <div className="lg:col-span-4 sticky top-24">
          <CircularProgressTracker stats={stats} />
        </div>
      </div>
    </div>
  );
}
