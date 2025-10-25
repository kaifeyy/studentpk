import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40 hover-elevate active-elevate-2"
      data-testid="button-fab"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
