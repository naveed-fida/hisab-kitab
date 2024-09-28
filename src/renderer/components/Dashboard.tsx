import React from "react";
import { Link } from "react-router-dom";
import { CURRENCY } from "../lib/constants";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { useDashboardData } from "../lib/useDashboardData";
import { NewProjectDialog } from "./NewProjectDialog";
import { PenIcon, TrashIcon } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import { Button } from "./ui/Button";
import { EditProjectDialog } from "./EditProjectDialog";

const Dashboard: React.FC = () => {
  const { allProjectStats, addProject, deleteProject } = useDashboardData();

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="text-2xl text-gray-700 p-4 font-bold">
          Projects Dashboard
        </h1>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProjectStats.map((project) => {
          return (
            <div
              className="rounded-lg shadow-md hover:bg-violet-100 transition duration-300 ease-in-out bg-violet-50"
              key={project.id}
            >
              <Link to={`/project/${project.id}`} className="block p-6 ">
                <h2 className="text-xl text-gray-600 font-semibold mb-2">
                  {project.name}
                </h2>
                {project.totalExpenses ? (
                  <>
                    <p className="text-gray-700">
                      Total Expenses:{" "}
                      <span className="font-semibold text-gray-900">
                        {`${CURRENCY} ${project.totalExpenses.toLocaleString()}`}
                      </span>
                    </p>
                    <p className="text-gray-500">
                      Last Updated Expense: {project.lastExpense.title} - PKR $
                      {project.lastExpense.amount.toLocaleString()} on{" "}
                      {project.lastExpense.date}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No expenses yet</p>
                )}
              </Link>
              <div className="actions flex gap-2 justify-end items-center mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <PenIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <EditProjectDialog
                    project={project}
                    onSubmit={(name) => {
                      window.api.updateProject(project.id, name);
                    }}
                  />
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DeleteDialog
                    title={`Delete project: ${project.name}?`}
                    description={`Are you sure you want to delete project ${project.name}?`}
                    onConfirm={() => deleteProject(project.id)}
                  />
                </Dialog>
              </div>
            </div>
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

export default Dashboard;
