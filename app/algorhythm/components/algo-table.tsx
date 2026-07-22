"use client";

import { Chip, Button } from "@heroui/react";
import { LockKey, Brain, ArrowsClockwise, Star } from "@phosphor-icons/react";
import { AlgoQuestion } from "@/lib/store/api/algorhythmApi";
import { useState, useMemo } from "react";

interface AlgoTableProps {
  questions: AlgoQuestion[];
  onSolve: (question: AlgoQuestion) => void;
}

export default function AlgoTable({ questions, onSolve }: AlgoTableProps) {
  const [filterTopic, setFilterTopic] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const topics = useMemo(
    () => Array.from(new Set(questions.map((q) => q.topic))),
    [questions]
  );

  const filteredItems = useMemo(() => {
    let filtered = [...questions];
    if (filterTopic !== "all") filtered = filtered.filter((q) => q.topic === filterTopic);
    if (filterStatus !== "all") filtered = filtered.filter((q) => q.status === filterStatus);
    return filtered;
  }, [questions, filterTopic, filterStatus]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "UNSEEN":    return <LockKey size={20} className="text-default-400" />;
      case "LEARNING":  return <Brain size={20} className="text-primary" />;
      case "REVIEW":    return <ArrowsClockwise size={20} className="text-warning" />;
      case "MASTERED":  return <Star size={20} weight="fill" className="text-success" />;
      default:          return <LockKey size={20} />;
    }
  };

  const difficultyColor = (d: string): "success" | "warning" | "danger" =>
    d === "EASY" ? "success" : d === "MEDIUM" ? "warning" : "danger";

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterTopic}
            onChange={(e) => { setFilterTopic(e.target.value); setPage(1); }}
            className="rounded-lg border border-default-200 bg-default-100 px-3 py-2 text-sm text-default-700 outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-default-200 bg-default-100 px-3 py-2 text-sm text-default-700 outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="UNSEEN">Unseen</option>
            <option value="LEARNING">Learning</option>
            <option value="REVIEW">Review</option>
            <option value="MASTERED">Mastered</option>
          </select>
        </div>
        <span className="text-default-400 text-sm">Total {filteredItems.length} problems</span>
      </div>

      {/* Plain HTML Table — avoids ALL React Aria collection components */}
      <div className="rounded-xl border border-divider overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-default-50">
              <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-default-500 uppercase tracking-wider">STS</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-default-500 uppercase tracking-wider">TITLE</th>
              <th className="w-28 px-4 py-3 text-left text-xs font-semibold text-default-500 uppercase tracking-wider">DIFFICULTY</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-default-500 uppercase tracking-wider">TOPIC</th>
              <th className="w-24 px-4 py-3 text-center text-xs font-semibold text-default-500 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-default-400">
                  No questions found for the selected filters.
                </td>
              </tr>
            ) : (
              items.map((question) => (
                <tr key={question.id} className="hover:bg-default-50 transition-colors">
                  <td className="px-4 py-3">{statusIcon(question.status)}</td>
                  <td className="px-4 py-3 font-medium">{question.title}</td>
                  <td className="px-4 py-3">
                    <Chip size="sm" variant="flat" color={difficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Chip>
                  </td>
                  <td className="px-4 py-3 text-default-500">{question.topic}</td>
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" color="primary" variant="flat" onPress={() => onSolve(question)}>
                      Solve
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Pagination — no React Aria collection */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-divider hover:bg-default-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-default-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    page === p
                      ? "bg-primary text-white border-primary"
                      : "border-divider hover:bg-default-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-divider hover:bg-default-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
