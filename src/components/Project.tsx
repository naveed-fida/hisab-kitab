import { Link, useParams } from "react-router-dom";
import { useExpenseData } from "../hooks/use-expense-data";
import { calculateExpenseTotal, getDateExpenseEdited } from "../utils";
import {
  CircleArrowLeft,
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  PlusCircle,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { AddPortionDialog } from "./AddPortionDialog";
import { DeleteDialog } from "./DeleteDialog";

export function Project() {
  const { projectId } = useParams();
  const { getProject, addExpensePortion, removeExpensePortion } =
    useExpenseData();
  const project = getProject(projectId);
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(
    null
  );

  const toggleExpandedExpenseId = (expenseId: string) => {
    setExpandedExpenseId((prevExpenseId) =>
      prevExpenseId === expenseId ? null : expenseId
    );
  };

  const handlePortionAddClick = (
    expense: Expense,
    portion: {
      description: string;
      amount: number;
    }
  ) => {
    addExpensePortion(projectId, expense.id, portion);
  };

  return (
    <div className="p-4">
      <div className="header mt-2 flex justify-between items-start">
        <h1 className="text-2xl text-gray-700 p-4 font-bold">{project.name}</h1>
        <Button className="text-md" asChild>
          <Link className="flex gap-2" to="/">
            <CircleArrowLeft />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div>
        <div className="grid grid-cols-5 bg-gray-50 p-4 rounded-md">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Amount
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </div>
        </div>
        {project.expenses.map((expense) => (
          <div key={expense.id}>
            <div className="grid grid-cols-5 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out">
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
                {expense.title}
              </div>
              <div className="text-sm text-gray-700">
                PKR {calculateExpenseTotal(expense).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {getDateExpenseEdited(expense).toLocaleDateString()}
              </div>
              <Dialog modal={true}>
                <DialogTrigger asChild>
                  <Button className="flex gap-2">
                    <PlusCircle />
                    Add More
                  </Button>
                </DialogTrigger>
                <AddPortionDialog
                  expense={expense}
                  onPortionAddClick={(portion) =>
                    handlePortionAddClick(expense, portion)
                  }
                />
              </Dialog>
            </div>
            {expandedExpenseId === expense.id && (
              <div>
                <div className="ml-4 grid grid-cols-4 bg-gray-50 p-4 rounded-md">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
                </div>
                {expense.expensePortions.map((portion) => (
                  <div
                    key={portion.id}
                    className="ml-4 grid grid-cols-4 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out"
                  >
                    <div className="text-sm text-gray-700">
                      {portion.description}
                    </div>
                    <div className="text-sm text-gray-700">
                      PKR {portion.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(portion.dateAdded).toLocaleDateString()}
                    </div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="text-red-500 hover:text-red-600"
                            variant="outline"
                          >
                            <TrashIcon />
                          </Button>
                        </DialogTrigger>
                        <DeleteDialog
                          title="Delete Expense Portion"
                          description="Are you sure you want to delete this expense portion?"
                          onConfirm={() =>
                            removeExpensePortion(
                              project.id,
                              expense.id,
                              portion.id
                            )
                          }
                        />
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
