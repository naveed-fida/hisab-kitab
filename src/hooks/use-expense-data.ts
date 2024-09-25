import { useState } from "react";

export function useExpenseData() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Gul Agha's House",
      expenses: [
        {
          id: "1",
          description: "Cement",
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-01" },
            { id: "2", amount: 200, dateAdded: "2024-09-02" },
          ],
        },
        {
          id: "2",
          description: "Bricks",
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-03" },
            { id: "2", amount: 200, dateAdded: "2024-09-04" },
          ],
        },
        {
          id: "3",
          description: "Wood",
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-05" },
            { id: "2", amount: 200, dateAdded: "2024-09-06" },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Mirdeen's Mosque",
      expenses: [
        {
          id: "4",
          description: "Cement",
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-07" },
            { id: "2", amount: 200, dateAdded: "2024-09-08" },
          ],
        },
        {
          id: "5",
          description: "Bricks",
          amount: 200,
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-09" },
            { id: "2", amount: 200, dateAdded: "2024-09-10" },
          ],
        },
        {
          id: "6",
          description: "Wood",
          amount: 200,
          date: "2024-09-17",
          expensePortions: [
            { id: "1", amount: 100, dateAdded: "2024-09-11" },
            { id: "2", amount: 200, dateAdded: "2024-09-12" },
          ],
        },
      ],
    },
  ]);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const addExpenseToProject = (projectId: string, expense: Expense) => {
    setProjects((oldProjects) => {
      return oldProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expenses: [...project.expenses, expense],
          };
        }
        return project;
      });
    });
  };

  const removeExpenseFromProject = (projectId: string, expenseId: string) => {
    setProjects((oldProjects) => {
      return oldProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expenses: project.expenses.filter(
              (expense) => expense.id !== expenseId
            ),
          };
        }
        return project;
      });
    });
  };

  const addExpensePortion = (
    projectId: string,
    expenseId: string,
    amount: number
  ) => {
    setProjects((oldProjects) => {
      return oldProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expenses: project.expenses.map((expense) => {
              if (expense.id === expenseId) {
                return {
                  ...expense,
                  expensePortions: [
                    ...expense.expensePortions,
                    {
                      id: `${expense.expensePortions.length + 2}`,
                      amount,
                      dateAdded: new Date().toISOString(),
                    },
                  ],
                };
              }
              return expense;
            }),
          };
        }
        return project;
      });
    });
  };

  const removeExpensePortion = (
    projectId: string,
    expenseId: string,
    portionId: string
  ) => {
    setProjects((oldProjects) => {
      return oldProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expenses: project.expenses.map((expense) => {
              if (expense.id === expenseId) {
                return {
                  ...expense,
                  expensePortions: expense.expensePortions.filter(
                    (portion) => portion.id !== portionId
                  ),
                };
              }
              return expense;
            }),
          };
        }
        return project;
      });
    });
  };

  const getProject = (projectId: string) => {
    return projects.find((project) => project.id === projectId);
  };

  const getExpense = (projectId: string, expenseId: string) => {
    const project = getProject(projectId);
    return project?.expenses.find((expense) => expense.id === expenseId);
  };

  return {
    projects,
    getProject,
    addProject,
    addExpenseToProject,
    addExpensePortion,
    removeExpensePortion,
    removeExpenseFromProject,
    getExpense,
  };
}
