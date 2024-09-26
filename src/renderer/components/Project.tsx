import { Link, useParams } from "react-router-dom";
import { useExpenseData } from "../hooks/use-expense-data";
import { calculateExpenseTotal, getDateExpenseEdited } from "../../utils";
import {
  CircleArrowLeft,
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  PenIcon,
  PlusCircle,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { AddPortionDialog } from "./AddPortionDialog";
import { DeleteDialog } from "./DeleteDialog";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { EditExpensePortionDialog } from "./EditExpensePortionDialog";
import { CURRENCY } from "../lib/constants";
import { AddNewExpenseDialog } from "./AddNewExpenseDialog";

export function Project() {
  const { projectId } = useParams();
  const {
    getProject,
    addExpensePortion,
    removeExpensePortion,
    removeExpenseFromProject,
    updateExpenseTitle,
    updateExpensePortion,
    addExpenseToProject,
  } = useExpenseData();
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
        <Button className="text-md" variant="outline" asChild>
          <Link className="flex gap-2" to="/">
            <CircleArrowLeft />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div>
        <div className="project-actions mb-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add New Expense</Button>
            </DialogTrigger>
            <AddNewExpenseDialog
              onExpenseAddClick={(newExpense: NewExpense) =>
                addExpenseToProject(projectId, newExpense)
              }
            />
          </Dialog>
        </div>
        <div className="grid grid-cols-6 bg-gray-50 p-4 rounded-md">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Expand/Contract
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Amount ({CURRENCY})
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </div>
          <div className="text-xs col-span-2 font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </div>
        </div>
        {project.expenses.map((expense) => (
          <div key={expense.id}>
            <div className="grid grid-cols-6 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out">
              <div className=" font-medium text-gray-900">
                <Button
                  variant="outline"
                  onClick={() => toggleExpandedExpenseId(expense.id)}
                >
                  {expandedExpenseId === expense.id ? (
                    <CircleChevronUpIcon />
                  ) : (
                    <CircleChevronDownIcon />
                  )}
                </Button>
              </div>
              <div className=" font-medium text-gray-900">{expense.title}</div>
              <div className=" text-gray-800 font-bold">
                {calculateExpenseTotal(expense).toFixed(2)}
              </div>
              <div className=" text-gray-500">
                {getDateExpenseEdited(expense).toLocaleDateString()}
              </div>
              <div className="flex gap-2 col-span-2">
                <Dialog modal={true}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle />
                    </Button>
                  </DialogTrigger>
                  <AddPortionDialog
                    expense={expense}
                    onPortionAddClick={(portion) =>
                      handlePortionAddClick(expense, portion)
                    }
                  />
                </Dialog>
                <Dialog modal={true}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex gap-2 text-red-500"
                    >
                      <TrashIcon />
                    </Button>
                  </DialogTrigger>
                  <DeleteDialog
                    title="Delete Expense"
                    description={`Are you sure you want to delete expense: ${expense.title}?`}
                    onConfirm={() =>
                      removeExpenseFromProject(project.id, expense.id)
                    }
                  />
                </Dialog>
                <Dialog modal={true}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex gap-2 text-slate-700"
                    >
                      <PenIcon />
                    </Button>
                  </DialogTrigger>
                  <EditExpenseDialog
                    expense={expense}
                    onSubmit={(title) =>
                      updateExpenseTitle(project.id, expense.id, title)
                    }
                  />
                </Dialog>
              </div>
            </div>
            {expandedExpenseId === expense.id && (
              <div className="text-sm">
                <div className="ml-4 grid grid-cols-4 bg-gray-50 p-4 rounded-md">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount ({CURRENCY})
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </div>
                </div>
                {expense.expensePortions.map((portion) => (
                  <div
                    key={portion.id}
                    className="ml-4 grid grid-cols-4 bg-white p-4 rounded-md hover:bg-violet-100 transition duration-300 ease-in-out"
                  >
                    <div className=" text-gray-700">{portion.description}</div>
                    <div className=" text-gray-800 font-bold">
                      {portion.amount.toFixed(2)}
                    </div>
                    <div className=" text-gray-500">
                      {new Date(portion.dateAdded).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="text-slate-700 hover:text-slate-800"
                            variant="outline"
                          >
                            <PenIcon />
                          </Button>
                        </DialogTrigger>
                        <EditExpensePortionDialog
                          portion={portion}
                          onSubmit={(p: {
                            description: string;
                            amount: number;
                          }) => {
                            updateExpensePortion(
                              project.id,
                              expense.id,
                              portion.id,
                              p
                            );
                          }}
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
