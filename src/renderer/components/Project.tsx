import { Link, useParams } from "react-router-dom";
import {
  calculateExpenseTotal,
  calculateTotalExpenses,
  getDateExpenseEdited,
  sortExpensePortionsByDate,
  sortExpensesByDate,
} from "../../utils";
import {
  CircleArrowLeft,
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  FileTextIcon,
  PenIcon,
  PlusCircle,
  PlusIcon,
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
import { useProject } from "../lib/useProject";

export function Project() {
  const { projectId } = useParams();
  const {
    project,
    addExpensePortion,
    removeExpensePortion,
    removeExpenseFromProject,
    updateExpenseTitle,
    updateExpensePortion,
    addExpenseToProject,
  } = useProject(projectId);

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
    addExpensePortion(expense.id, portion);
  };

  if (project === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="header mt-2 flex justify-between items-center">
        <h1 className="text-2xl text-slate-700 p-4 font-bold">
          {project.name}
        </h1>
        <Button className="text-md" variant="outline" asChild>
          <Link className="flex gap-2" to="/">
            <CircleArrowLeft />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <div className="project-actions flex gap-4 my-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-md flex gap-2">
                  <PlusIcon />
                  <span>Add New Expense</span>
                </Button>
              </DialogTrigger>
              <AddNewExpenseDialog
                onExpenseAddClick={(newExpense: NewExpense) =>
                  addExpenseToProject(newExpense)
                }
              />
            </Dialog>
            <Button
              variant="outline"
              className="text-md flex gap-2 items-center"
              onClick={() => {
                window.api.printPDF(project);
              }}
            >
              <FileTextIcon className="h-5 w-5" />
              <span>Save PDF</span>
            </Button>
          </div>
          <div>
            <p>
              Expenses Total: {CURRENCY}{" "}
              <span className="font-bold">
                {calculateTotalExpenses(project.expenses).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-6 bg-slate-100 p-4 rounded-md mb-2">
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Expand/Contract
          </div>
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Title
          </div>
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Total Amount ({CURRENCY})
          </div>
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Last Updated
          </div>
          <div className="text-xs col-span-2 font-medium text-slate-600 uppercase tracking-wider">
            Actions
          </div>
        </div>
        {sortExpensesByDate(project.expenses).map((expense) => (
          <div key={expense.id}>
            <div className="grid items-center grid-cols-6 bg-white px-4 py-2 rounded-md hover:bg-accent transition duration-300 ease-in-out">
              <div className="font-medium text-slate-900">
                <Button
                  variant="outline"
                  onClick={() => toggleExpandedExpenseId(expense.id)}
                >
                  {expandedExpenseId === expense.id ? (
                    <CircleChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <CircleChevronDownIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="font-medium text-slate-900">{expense.title}</div>
              <div className="text-slate-800 font-bold">
                {calculateExpenseTotal(expense).toLocaleString()}
              </div>
              <div className="text-slate-500">
                {getDateExpenseEdited(expense).toLocaleDateString()}
              </div>
              <div className="flex gap-2 col-span-2">
                <Dialog modal={true}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="h-5 w-5" />
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
                      className="flex gap-2 text-slate-700"
                    >
                      <PenIcon className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <EditExpenseDialog
                    expense={expense}
                    onSubmit={(title) => updateExpenseTitle(expense.id, title)}
                  />
                </Dialog>
                <Dialog modal={true}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex gap-2 text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DeleteDialog
                    title="Delete Expense"
                    description={`Are you sure you want to delete expense: ${expense.title}?`}
                    onConfirm={() => removeExpenseFromProject(expense.id)}
                  />
                </Dialog>
              </div>
            </div>
            {expandedExpenseId === expense.id && (
              <div className="text-sm mt-2">
                <div className="ml-4 grid grid-cols-4 bg-slate-100 p-4 rounded-md mb-2">
                  <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Description
                  </div>
                  <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Amount ({CURRENCY})
                  </div>
                  <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Date Added
                  </div>
                  <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </div>
                </div>
                {sortExpensePortionsByDate(expense.expensePortions).map(
                  (portion) => (
                    <div
                      key={portion.id}
                      className="ml-4 grid grid-cols-4 items-center bg-white px-4 py-2 rounded-md hover:bg-accent transition duration-300 ease-in-out"
                    >
                      <div className=" text-slate-700">
                        {portion.description}
                      </div>
                      <div className=" text-slate-800 font-bold">
                        {portion.amount.toLocaleString()}
                      </div>
                      <div className=" text-slate-500">
                        {new Date(portion.dateAdded).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="text-slate-700 hover:text-slate-800"
                              variant="outline"
                            >
                              <PenIcon className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <EditExpensePortionDialog
                            portion={portion}
                            onSubmit={(p: {
                              description: string;
                              amount: number;
                            }) => {
                              updateExpensePortion(expense.id, portion.id, p);
                            }}
                          />
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="text-red-500 hover:text-red-600"
                              variant="outline"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <DeleteDialog
                            title="Delete Expense Portion"
                            description="Are you sure you want to delete this expense portion?"
                            onConfirm={() =>
                              removeExpensePortion(expense.id, portion.id)
                            }
                          />
                        </Dialog>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
