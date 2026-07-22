"use client";

import { ProgressCircle, Card, CardContent, Chip, Button } from "@heroui/react";
import { Brain, LockKey, CircleDashed, CheckCircle } from "@phosphor-icons/react";
import { useGetQuestionsQuery, useGetDueReviewsQuery, AlgoQuestion } from "@/lib/store/api/algorhythmApi";
import { useState } from "react";
import ReviewModal from "./components/review-modal";
import AlgoTable from "./components/algo-table";

const tabs = [
  { key: "due-today", label: "Due Today", icon: Brain },
  { key: "vault", label: "The Vault", icon: LockKey },
];

export default function AlgorhythmPage() {
  const { data: questions, isLoading: isLoadingQuestions } = useGetQuestionsQuery();
  const { data: dueReviews, isLoading: isLoadingReviews, refetch } = useGetDueReviewsQuery();
  
  const [activeTab, setActiveTab] = useState("due-today");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<AlgoQuestion | null>(null);

  const handleSolve = (question: AlgoQuestion) => {
    setSelectedQuestion(question);
    window.open(question.leetcodeUrl, "_blank");
    setIsOpen(true);
  };

  const masteredCount = questions?.filter(q => q.status === 'MASTERED').length || 0;
  const totalCount = questions?.length || 150;
  const completionPercentage = Math.round((masteredCount / totalCount) * 100) || 0;

  if (isLoadingQuestions || isLoadingReviews) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <ProgressCircle size="lg" aria-label="Loading..." isIndeterminate />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            AlgoRhythm
          </h1>
          <p className="text-default-500">Master AlgoRhythm through Spaced Repetition.</p>
        </div>
        
        <Card className="bg-default-50 border-none shadow-none">
          <CardContent className="flex flex-row items-center gap-4 py-3">
            <ProgressCircle
              value={completionPercentage}
              color="primary"
              showValueLabel={true}
              classNames={{
                svg: "w-12 h-12",
                value: "text-sm font-semibold",
              }}
            />
            <div>
              <p className="text-sm font-medium">Overall Mastery</p>
              <p className="text-xs text-default-500">{masteredCount} of {totalCount} completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Tab Bar — avoids HeroUI Tabs collection component */}
      <div className="w-full border-b border-divider mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-0 h-12 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-default-500 hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.key === "due-today" && dueReviews && dueReviews.length > 0 && (
                  <Chip size="sm" color="danger" variant="flat">{dueReviews.length}</Chip>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "due-today" && (
        <div className="py-2">
          {!dueReviews || dueReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-divider rounded-xl bg-default-50">
              <div className="text-success mb-4">
                <CheckCircle size={48} weight="fill" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
              <p className="text-default-500 max-w-sm">
                You have completed all your scheduled reviews for today. Check out the Vault to learn something new.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dueReviews.map((review) => (
                <Card key={review.id} className="border border-divider">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <Chip size="sm" variant="flat" color="warning">Review</Chip>
                      <Chip 
                        size="sm" 
                        variant="dot" 
                        color={review.question.difficulty === 'EASY' ? 'success' : review.question.difficulty === 'MEDIUM' ? 'warning' : 'danger'}
                      >
                        {review.question.difficulty}
                      </Chip>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 truncate" title={review.question.title}>
                      {review.question.title}
                    </h3>
                    <p className="text-sm text-default-500 mb-6">{review.question.topic}</p>
                    <Button 
                      color="primary" 
                      className="w-full font-medium"
                      onPress={() => handleSolve(review.question)}
                    >
                      Solve Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "vault" && (
        <div className="py-2">
          <AlgoTable questions={questions || []} onSolve={handleSolve} />
        </div>
      )}

      {selectedQuestion && (
        <ReviewModal 
          isOpen={isOpen} 
          onOpenChange={setIsOpen} 
          question={selectedQuestion} 
          onReviewSubmitted={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}
