import { Button } from "./ui/Button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
}

export function DeleteDialog({
  title,
  description,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription>{description}</DialogDescription>
      <DialogFooter>
        <Button
          type="button"
          className="bg-red-600 text-white"
          onClick={onConfirm}
        >
          Delete
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
