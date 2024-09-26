import { useState } from "react";

export function useExpenseData() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Gul Agha's House",
      expenses: [
        {
          id: "1",
          title: "Cement",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-01",
              description: "4 bags",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-02",
              description: "8 bags",
            },
          ],
        },
        {
          id: "2",
          title: "Bricks",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-03",
              description: "100",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-04",
              description: "200",
            },
          ],
        },
        {
          id: "3",
          title: "Wood",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-05",
              description: "50 kg",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-06",
              description: "100 kg",
            },
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
          title: "Cement",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-07",
              description: "4 bags",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-08",
              description: "8 bags",
            },
          ],
        },
        {
          id: "5",
          title: "Bricks",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-09",
              description: "100",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-10",
              description: "200",
            },
          ],
        },
        {
          id: "6",
          title: "Wood",
          expensePortions: [
            {
              id: "1",
              amount: 100,
              dateAdded: "2024-09-11",
              description: "50 kg",
            },
            {
              id: "2",
              amount: 200,
              dateAdded: "2024-09-12",
              description: "100 kg",
            },
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
    portion: { amount: number; description: string }
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
                      amount: portion.amount,
                      description: portion.description,
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
