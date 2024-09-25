import { Link, useParams } from "react-router-dom";
import { useExpenseData } from "../hooks/use-expense-data";
import { calculateExpenseTotal, getDateExpenseEdited } from "../utils";
import {
  CircleArrowLeft,
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Button } from "./ui/Button";

export function Project() {
  const { projectId } = useParams();
  const { getProject, getExpense } = useExpenseData();
  const project = getProject(projectId);
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(
    null
  );
  const [selectedAddMoreExpenseId, setSelectedAddMoreExpenseId] = useState<
    string | null
  >(null);

  const toggleExpandedExpenseId = (expenseId: string) => {
    setExpandedExpenseId((prevExpenseId) =>
      prevExpenseId === expenseId ? null : expenseId
    );
  };

  return (
    <div className="p-4">
      <div className="header mt-2 flex justify-between items-start">
        <h1 className="text-2xl text-gray-700 p-4 font-bold">{project.name}</h1>
        <Link
          className="flex bg-slate-700 text-slate-50 p-2 gap-2 rounded-md"
          to="/"
        >
          <CircleArrowLeft />
          Back to Dashboard
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-5 bg-gray-50 p-4 rounded-md">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Amount
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </div>
        </div>
        {project.expenses.map((expense) => (
          <>
            <div
              key={expense.id}
              className="grid grid-cols-5 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out"
            >
              <div className="text-sm font-medium text-gray-900">
                <Button onClick={() => toggleExpandedExpenseId(expense.id)}>
                  {expandedExpenseId === expense.id ? (
                    <CircleChevronUpIcon />
                  ) : (
                    <CircleChevronDownIcon />
                  )}
                </Button>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {expense.description}
              </div>
              <div className="text-sm text-gray-700">
                ${calculateExpenseTotal(expense).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {getDateExpenseEdited(expense).toLocaleDateString()}
              </div>
              <div>
                <Button
                  onClick={() => setSelectedAddMoreExpenseId(expense.id)}
                  className="flex gap-2"
                >
                  <PlusCircle />
                  Add More
                </Button>
              </div>
            </div>
            {expandedExpenseId === expense.id && (
              <div>
                <div className="ml-4 grid grid-cols-2 bg-gray-50 p-4 rounded-md">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </div>
                </div>
                {expense.expensePortions.map((portion) => (
                  <div
                    key={portion.id}
                    className="ml-4 grid grid-cols-2 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out"
                  >
                    <div className="text-sm text-gray-700">
                      ${portion.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(portion.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ))}
      </div>
      {selectedAddMoreExpenseId && (
        <AddPortionDialog
          open={!!selectedAddMoreExpenseId}
          onOpenChange={(open) =>
            setSelectedAddMoreExpenseId(open ? selectedAddMoreExpenseId : null)
          }
          expense={getExpense(project.id, selectedAddMoreExpenseId)}
        />
      )}
    </div>
  );
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense;
}

function AddPortionDialog({ open, onOpenChange, expense }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="p-4">
          <h2 className="text-xl font-semibold">
            Add more {expense.description}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button className="flex gap-2" type="button">
                <PlusCircle />
                <span>Add</span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
