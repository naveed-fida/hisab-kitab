import { useEffect, useRef, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface EditExpensePortionDialogProps {
  portion: ExpensePortion;
  onSubmit: (portion: { description: string; amount: number }) => void;
}

export function EditExpensePortionDialog({
  portion,
  onSubmit,
}: EditExpensePortionDialogProps) {
  const [amount, setAmount] = useState({ value: portion.amount, error: "" });
  const [description, setDescription] = useState({
    value: portion.description,
    error: "",
  });
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleEditPortion = () => {
    if (amount.value <= 0) {
      setAmount((prevAmount) => ({
        ...prevAmount,
        error: "Amount must be greater than 0",
      }));
      return;
    }

    if (description.value.trim() === "") {
      setDescription((prevDescription) => ({
        ...prevDescription,
        error: "Description is required",
      }));
      return;
    }

    onSubmit({ amount: amount.value, description: description.value });
    closeRef.current?.click();
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription({ value: e.target.value, error: "" });
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount({ value: Number(e.target.value), error: "" });
  };

  useEffect(() => {
    if (amount.error !== "") {
      amountRef.current?.focus();
    }
    if (description.error !== "") {
      descriptionRef.current?.focus();
    }
  }, [amount.error, description.error]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Edit Expense Portion
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditPortion();
          }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="amount" className="font-medium">
                Description
              </label>
              <Input
                id="portion-description"
                onChange={onDescriptionChange}
                value={description.value}
                ref={descriptionRef}
                type="text"
                className="mt-2"
              />
              {description.error !== "" ? (
                <span className="text-red-500 ">{description.error}</span>
              ) : null}
            </div>
            <div>
              <label htmlFor="amount" className="font-medium">
                Amount
              </label>
              <Input
                id="amount"
                ref={amountRef}
                onChange={onAmountChange}
                value={amount.value}
                type="number"
                className="mt-2"
                onWheel={(e) => e.preventDefault()}
              />
              {amount.error !== "" ? (
                <span className="text-red-500 ">{amount.error}</span>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button className="flex gap-2" type="submit">
              <span>Update</span>
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
