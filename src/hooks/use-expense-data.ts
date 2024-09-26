import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";

export function useExpenseData() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: createId(),
      name: "Gul Agha's House",
      expenses: [
        {
          id: createId(),
          title: "Cement",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-01",
              description: "4 bags",
            },
            {
              id: createId(),
              amount: 200,
              dateAdded: "2024-09-02",
              description: "8 bags",
            },
          ],
        },
        {
          id: createId(),
          title: "Bricks",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-03",
              description: "100 Ct",
            },
            {
              id: createId(),
              amount: 200,
              dateAdded: "2024-09-04",
              description: "200 Ct",
            },
          ],
        },
        {
          id: createId(),
          title: "Wood",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-05",
              description: "50 kg",
            },
            {
              id: createId(),
              amount: 200,
              dateAdded: "2024-09-06",
              description: "100 kg",
            },
          ],
        },
      ],
    },
    {
      id: createId(),
      name: "Mirdeen's Mosque",
      expenses: [
        {
          id: createId(),
          title: "Cement",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-07",
              description: "4 bags",
            },
            {
              id: createId(),
              amount: 200,
              dateAdded: "2024-09-08",
              description: "8 bags",
            },
          ],
        },
        {
          id: createId(),
          title: "Bricks",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-09",
              description: "100 Ct",
            },
            {
              id: createId(),
              amount: 200,
              dateAdded: "2024-09-10",
              description: "200 Ct",
            },
          ],
        },
        {
          id: createId(),
          title: "Wood",
          expensePortions: [
            {
              id: createId(),
              amount: 100,
              dateAdded: "2024-09-11",
              description: "50 kg",
            },
            {
              id: createId(),
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

  const addExpenseToProject = (projectId: string, expense: NewExpense) => {
    setProjects((oldProjects) => {
      return oldProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            expenses: [
              ...project.expenses,
              {
                id: createId(),
                title: expense.title,
                expensePortions: [
                  {
                    id: createId(),
                    amount: expense.portionAmount,
                    description: expense.portionDescription,
                    dateAdded: new Date().toISOString(),
                  },
                ],
              },
            ],
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
                      id: createId(),
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

  const updateExpenseTitle = (
    projectId: string,
    expenseId: string,
    title: string
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
                  title,
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

  const updateExpensePortion = (
    projectId: string,
    expenseId: string,
    portionId: string,
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
                  expensePortions: expense.expensePortions.map((p) => {
                    if (p.id === portionId) {
                      return {
                        ...p,
                        amount: portion.amount,
                        description: portion.description,
                      };
                    }
                    return p;
                  }),
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

  return {
    projects,
    getProject,
    addProject,
    addExpenseToProject,
    addExpensePortion,
    removeExpensePortion,
    removeExpenseFromProject,
    getExpense,
    updateExpenseTitle,
    updateExpensePortion,
  };
}
