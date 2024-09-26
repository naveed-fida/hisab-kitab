import React from "react";
import { Link } from "react-router-dom";
import { useExpenseData } from "../hooks/use-expense-data";
import {
  calculateTotalExpenses,
  getDateExpenseEdited,
  getLastUpdatedExpense,
  getLastUpdatedPortion,
} from "../utils";

const Dashboard: React.FC = () => {
  const { projects } = useExpenseData();

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
              <p className="text-gray-700">
                Total Expenses:{" "}
                <span className="font-semibold text-gray-900">
                  PKR {totalExpenses.toFixed(2)}
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                {lastExpense
                  ? `Last Updated Expense: ${lastExpense.title} - PKR ${
                      lastUpdatedPortion.amount
                    } on ${new Date(
                      getDateExpenseEdited(lastExpense)
                    ).toLocaleDateString()}`
                  : "No expenses yet"}
              </p>
            </Link>
          );
        })}

        <button className="p-6 bg-sky-500 text-white rounded-lg shadow-md hover:bg-sky-600 transition duration-300 ease-in-out">
          + Add New Project
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
