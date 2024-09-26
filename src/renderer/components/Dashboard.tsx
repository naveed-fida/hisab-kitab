import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  calculateTotalExpenses,
  getDateExpenseEdited,
  getLastUpdatedExpense,
  getLastUpdatedPortion,
} from "../../utils";
import { CURRENCY } from "../lib/constants";
import { useAppData } from "../lib/dataStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "./ui/Dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/Button";

const Dashboard: React.FC = () => {
  const { projects, addProject } = useAppData();

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="text-2xl text-gray-700 p-4 font-bold">
          Projects Dashboard
        </h1>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const totalExpenses = calculateTotalExpenses(project.expenses);
          const lastExpense = getLastUpdatedExpense(project.expenses);
          const lastUpdatedPortion = getLastUpdatedPortion(lastExpense);

          return (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="block p-6 rounded-lg shadow-md hover:bg-violet-100 transition duration-300 ease-in-out bg-violet-50"
            >
              <h2 className="text-xl text-gray-600 font-semibold mb-2">
                {project.name}
              </h2>
              {project.expenses.length > 0 ? (
                <>
                  <p className="text-gray-700">
                    Total Expenses:{" "}
                    <span className="font-semibold text-gray-900">
                      {`${CURRENCY} ${totalExpenses.toFixed(2)}`}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    {lastExpense
                      ? `Last Updated Expense: ${lastExpense.title} - PKR ${
                          lastUpdatedPortion.amount
                        } on ${new Date(
                          getDateExpenseEdited(lastExpense)
                        ).toLocaleDateString()}`
                      : "No expenses yet"}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No expenses yet</p>
              )}
            </Link>
          );
        })}

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="p-6 bg-sky-500 text-white rounded-lg shadow-md hover:bg-sky-600 transition duration-300 ease-in-out"
            >
              + Add New Project
            </button>
          </DialogTrigger>
          <NewProjectDialog onProjectAddClick={(title) => addProject(title)} />
        </Dialog>
      </div>
    </div>
  );
};

interface NewProjectDialogProps {
  onProjectAddClick: (projectName: string) => void;
}

function NewProjectDialog({ onProjectAddClick }: NewProjectDialogProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = useState({ value: "", error: "" });

  useEffect(() => {
    if (name.error !== "") {
      nameRef.current?.focus();
    }
  }, [name.error]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">
          Add New Project
        </DialogTitle>
      </DialogHeader>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.value) {
              setName({ ...name, error: "Project name is required" });
              return;
            }
            onProjectAddClick(name.value);
            closeRef.current?.click();
          }}
        >
          <label htmlFor="projectName" className="block mb-2">
            Project Name
          </label>
          <input
            id="projectName"
            ref={nameRef}
            type="text"
            value={name.value}
            onChange={(e) => setName({ value: e.target.value, error: "" })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit">Add</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" ref={closeRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}

export default Dashboard;
