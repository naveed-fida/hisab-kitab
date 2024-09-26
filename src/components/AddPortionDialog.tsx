import { useEffect, useRef, useState } from "react";
import { DialogContent, DialogHeader } from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { PlusCircle } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface DialogProps {
  expense: Expense;
  onPortionAddClick: (portion: { amount: number; description: string }) => void;
}

export function AddPortionDialog({ expense, onPortionAddClick }: DialogProps) {
  const [amount, setAmount] = useState({ value: 0, error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleAddPortion = () => {
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

    onPortionAddClick({ amount: amount.value, description: description.value });
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
          Add more {expense.title}
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddPortion();
          }}
        >
          <div className="flex flex-col gap-4">
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
                <span className="text-red-500 text-sm">{amount.error}</span>
              ) : null}
            </div>
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
                <span className="text-red-500 text-sm">
                  {description.error}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-4">
            <Button className="flex gap-2" type="submit">
              <PlusCircle className="h-5 w-5" />
              <span>Add</span>
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
