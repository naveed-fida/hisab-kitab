import { useEffect, useRef, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

interface AddNewExpenseDialogProps {
  onExpenseAddClick: (expense: NewExpense) => void;
}

export function AddNewExpenseDialog({
  onExpenseAddClick,
}: AddNewExpenseDialogProps) {
  const [title, setTitle] = useState({ value: "", error: "" });
  const [portionDescription, setPortionDescription] = useState({
    value: "",
    error: "",
  });
  const [portionAmount, setPortionAmount] = useState({ value: 0, error: "" });
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleAddExpense = () => {
    if (title.value.trim() === "") {
      setTitle((prevTitle) => ({
        ...prevTitle,
        error: "Title is required",
      }));
      return;
    }

    if (portionDescription.value.trim() === "") {
      setPortionDescription((prevDescription) => ({
        ...prevDescription,
        error: "Description is required",
      }));
      return;
    }

    if (portionAmount.value <= 0) {
      setPortionAmount((prevAmount) => ({
        ...prevAmount,
        error: "Amount must be greater than 0",
      }));
      return;
    }

    onExpenseAddClick({
      title: title.value,
      portionDescription: portionDescription.value,
      portionAmount: portionAmount.value,
    });

    setTitle({ value: "", error: "" });
    setPortionDescription({ value: "", error: "" });
    setPortionAmount({ value: 0, error: "" });
    closeRef.current?.click();
  };

  useEffect(() => {
    if (title.error !== "") {
      titleRef.current?.focus();
    }
    if (portionDescription.error !== "") {
      descriptionRef.current?.focus();
    }
    if (portionAmount.error !== "") {
      amountRef.current?.focus();
    }
  }, [title.error, portionDescription.error, portionAmount.error]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Add New Expense
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddExpense();
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
          <label htmlFor="portionDescription" className="block mt-4 mb-2">
            Description
          </label>
          <input
            ref={descriptionRef}
            id="portionDescription"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={portionDescription.value}
            onChange={(e) =>
              setPortionDescription({ value: e.target.value, error: "" })
            }
          />
          {portionDescription.error ? (
            <p className="text-red-500 mt-2">{portionDescription.error}</p>
          ) : null}
          <label htmlFor="portionAmount" className="block mt-4 mb-2">
            Amount
          </label>
          <input
            ref={amountRef}
            id="portionAmount"
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={portionAmount.value}
            onChange={(e) =>
              setPortionAmount({ value: Number(e.target.value), error: "" })
            }
          />
          {portionAmount.error ? (
            <p className="text-red-500 mt-2">{portionAmount.error}</p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" className="bg-blue-600 text-white">
              Add
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
