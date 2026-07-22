"use client";

import { 
  Modal, 
  Button,
  Spinner
} from "@heroui/react";
import { AlgoQuestion, useSubmitReviewMutation } from "@/lib/store/api/algorhythmApi";
import { useState } from "react";
import { addToast } from "@heroui/toast";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: AlgoQuestion;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({ isOpen, onOpenChange, question, onReviewSubmitted }: ReviewModalProps) {
  const [submitReview, { isLoading }] = useSubmitReviewMutation();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRatingSubmit = async (rating: number, onClose: () => void) => {
    setSelectedRating(rating);
    try {
      await submitReview({ questionId: question.id, rating }).unwrap();
      addToast({ title: "Success", description: `Progress saved for ${question.title}!`, color: "success" });
      onReviewSubmitted();
      onClose();
    } catch (error) {
      addToast({ title: "Error", description: "Failed to save progress. Please try again.", color: "danger" });
    } finally {
      setSelectedRating(null);
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="max-w-2xl">
            <Modal.Header className="flex flex-col gap-1 text-center pt-8">
              <Modal.Heading className="text-2xl font-bold">Currently Solving</Modal.Heading>
              <p className="text-primary font-medium text-lg">{question.title}</p>
            </Modal.Header>
            <Modal.Body className="py-6 flex flex-col items-center text-center">
              <p className="text-default-500 max-w-md mx-auto mb-4">
                We've opened LeetCode in a new tab. Once you're done, come back here and honestly rate how difficult it was to recall the solution.
              </p>
              
              <div className="w-full h-px bg-divider my-4"></div>
              
              <h3 className="text-lg font-semibold mb-6">How was it?</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <Button 
                  color="danger" 
                  variant="flat" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onPress={() => handleRatingSubmit(1, () => onOpenChange(false))}
                  isLoading={isLoading && selectedRating === 1}
                  isDisabled={isLoading && selectedRating !== 1}
                >
                  <span className="text-xl">🟥</span>
                  <div className="flex flex-col">
                    <span className="font-bold">Blackout</span>
                    <span className="text-xs opacity-80">Couldn't recall</span>
                  </div>
                </Button>
                
                <Button 
                  color="warning" 
                  variant="flat" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onPress={() => handleRatingSubmit(2, () => onOpenChange(false))}
                  isLoading={isLoading && selectedRating === 2}
                  isDisabled={isLoading && selectedRating !== 2}
                >
                  <span className="text-xl">🟧</span>
                  <div className="flex flex-col">
                    <span className="font-bold">Struggled</span>
                    <span className="text-xs opacity-80">Needed hints</span>
                  </div>
                </Button>
                
                <Button 
                  color="success" 
                  variant="flat" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onPress={() => handleRatingSubmit(3, () => onOpenChange(false))}
                  isLoading={isLoading && selectedRating === 3}
                  isDisabled={isLoading && selectedRating !== 3}
                >
                  <span className="text-xl">🟩</span>
                  <div className="flex flex-col">
                    <span className="font-bold">Good</span>
                    <span className="text-xs opacity-80">Recalled fine</span>
                  </div>
                </Button>
                
                <Button 
                  color="primary" 
                  variant="flat" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onPress={() => handleRatingSubmit(4, () => onOpenChange(false))}
                  isLoading={isLoading && selectedRating === 4}
                  isDisabled={isLoading && selectedRating !== 4}
                >
                  <span className="text-xl">🟦</span>
                  <div className="flex flex-col">
                    <span className="font-bold">Easy</span>
                    <span className="text-xs opacity-80">Instant recall</span>
                  </div>
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-center pb-8">
              <Button color="default" variant="light" onPress={() => onOpenChange(false)} isDisabled={isLoading}>
                Cancel (Skip rating for now)
              </Button>
            </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
