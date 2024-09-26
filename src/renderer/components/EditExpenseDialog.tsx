import { useRef, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { DialogClose } from "@radix-ui/react-dialog";

interface EditExpenseDialogProps {
  expense: Expense;
  onSubmit: (title: string) => void;
}

export function EditExpenseDialog({
  expense,
  onSubmit,
}: EditExpenseDialogProps) {
  const [title, setTitle] = useState({ value: expense.title, error: "" });
  const titleRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleEdit = () => {
    if (title.value.trim() === "") {
      setTitle((prevTitle) => ({
        ...prevTitle,
        error: "Title is required",
      }));
      return;
    }

    onSubmit(title.value);
    closeRef.current?.click();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Edit {expense.title}
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            ref={titleRef}
            id="title"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={title.value}
            onChange={(e) => setTitle({ value: e.target.value, error: "" })}
          />
          {title.error ? (
            <p className="text-red-500 mt-2">{title.error}</p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" className="bg-blue-600 text-white">
              Save
            </Button>
            <DialogClose asChild>
              <Button ref={closeRef} type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
