import { createId } from "@paralleldrive/cuid2";
import { createContext, ProviderProps, useContext, useState } from "react";

const AppDataContext = createContext<AppContextType | null>(null);

export function AppDataProvider(props: ProviderProps<{ projects: Project[] }>) {
  const [projects, setProjects] = useState<Project[]>(props.value.projects);

  const addProject = (title: string) => {
    const newProject: Project = {
      id: createId(),
      name: title,
      expenses: [],
    };
    setProjects([...projects, newProject]);
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

  return (
    <AppDataContext.Provider
      {...props}
      value={{
        projects,
        addProject,
        addExpenseToProject,
        getProject,
        getExpense,
        updateExpenseTitle,
        removeExpenseFromProject,
        addExpensePortion,
        removeExpensePortion,
        updateExpensePortion,
      }}
    />
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData can only be used under AppDataProvider");
  }

  return context;
}
