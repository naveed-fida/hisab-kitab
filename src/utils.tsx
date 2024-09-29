import { createId } from "@paralleldrive/cuid2";
import { CURRENCY } from "./renderer/lib/constants";

export const calculateTotalExpenses = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => {
    return total + calculateExpenseTotal(expense);
  }, 0);
};

export const calculateExpenseTotal = (expense: Expense) => {
  return expense.expensePortions.reduce(
    (total, portion) => total + portion.amount,
    0
  );
};

export const getLastUpdatedExpense = (expenses: Expense[]) => {
  if (expenses.length === 0) return null;
  return expenses.reduce((latest, expense) => {
    return getDateExpenseEdited(expense) > getDateExpenseEdited(latest)
      ? expense
      : latest;
  });
};

export const getLastUpdatedPortion = (expense: Expense) => {
  if (expense === null || expense.expensePortions.length === 0) return null;
  return expense.expensePortions.reduce((latest, portion) => {
    return new Date(portion.dateAdded) > new Date(latest.dateAdded)
      ? portion
      : latest;
  });
};

export const getDateExpenseEdited = (expense: Expense) => {
  return expense.expensePortions.reduce((latest, portion) => {
    const latestDate = new Date(latest);
    const currentDate = new Date(portion.dateAdded);

    return currentDate > latestDate ? currentDate : latestDate;
  }, new Date("1970-01-01"));
};

export const sortExpensesByDate = (expenses: Expense[]) => {
  return expenses.sort((a, b) => {
    return (
      getDateExpenseEdited(b).getTime() - getDateExpenseEdited(a).getTime()
    );
  });
};

export const sortExpensePortionsByDate = (portions: ExpensePortion[]) => {
  return portions.sort((a, b) => {
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });
};

export const sortProjectsByDate = (projects: Project[]) => {
  return projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const buildNewProject = (name: string): Project => {
  return {
    id: createId(),
    name,
    expenses: [],
    createdAt: new Date().toISOString(),
  };
};

export function slugify(title: string) {
  return title
    .trim()
    .replace(/ +/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

export const buildStatsForProject = (project: Project) => {
  const totalExpenses = calculateTotalExpenses(project.expenses);
  const lastExpense = getLastUpdatedExpense(project.expenses);
  const lastUpdatedPortion = getLastUpdatedPortion(lastExpense);

  return {
    id: project.id,
    name: project.name,
    totalExpenses,
    lastExpense: lastExpense
      ? {
          title: lastExpense.title,
          amount: lastUpdatedPortion.amount,
          date: new Date(
            getDateExpenseEdited(lastExpense)
          ).toLocaleDateString(),
        }
      : null,
  };
};

export const TableForPDF = ({ project }: { project: Project }) => {
  return (
    <html lang="en">
      <head>
        <style>
          {`
          @media print {
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: .9rem;
              border: none;
            }
            th, td {
              padding: 8px;
              border: none;
              text-align: center;
            }
            thead tr {
              background-color: #475569 !important;
              color: #f8fafc !important;
            }
            tbody tr:nth-child(even) {
              background-color: #cbd5e1;
            }
            tbody tr:nth-child(odd) {
              background-color: white;
            }
            h2 {
              font-size: 1.2rem;
              font-weight: bold;
              margin-bottom: 1rem;
            }
            h1 {
              padding: 8px 16px;
              background-color: #334155;
              font-size: 1.5rem;
              font-weight: bold;
              color: #f8fafc;
              margin-bottom: 3rem;
            }
          }
          `}
        </style>
      </head>
      <body>
        <div>
          <h1>Expenses List for {project.name}</h1>
          <div>
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  padding: "8px",
                  minWidth: "100px",
                  border: "1px solid #cbd5e1",
                }}
              >
                Total Expenses
              </span>
              <span
                style={{
                  padding: "8px",
                  backgroundColor: "#cbd5e1",
                  minWidth: "100px",
                }}
              >
                {CURRENCY}{" "}
                {calculateTotalExpenses(project.expenses).toLocaleString()}
              </span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Amount</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {project.expenses.map((expense) => {
                return (
                  <tr key={expense.id}>
                    <td>{expense.title}</td>
                    <td>{calculateExpenseTotal(expense).toLocaleString()}</td>
                    <td>
                      <table>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date Added</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortExpensePortionsByDate(
                            expense.expensePortions
                          ).map((portion) => {
                            return (
                              <tr key={portion.id}>
                                <td>{portion.description}</td>
                                <td>{portion.amount.toLocaleString()}</td>
                                <td>
                                  {new Date(
                                    portion.dateAdded
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  );
};
