import { useEffect, useState } from "react";

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    window.api.getProject(projectId).then((project) => {
      setProject(project);
    });
  });

  const addExpenseToProject = (newExpense: NewExpense) => {
    window.api.createNewExpense(projectId, newExpense).then((project) => {
      setProject(project);
    });
  };

  const removeExpenseFromProject = (expenseId: string) => {
    window.api.deleteExpense(projectId, expenseId).then((project) => {
      setProject(project);
    });
  };

  const addExpensePortion = (expenseId: string, portion: NewExpensePortion) => {
    window.api
      .addPortionToExpense(projectId, expenseId, portion)
      .then((project) => {
        setProject(project);
      });
  };

  const removeExpensePortion = (expenseId: string, portionId: string) => {
    window.api
      .removePortionFromExpense(projectId, expenseId, portionId)
      .then((project) => {
        setProject(project);
      });
  };

  const updateExpenseTitle = (expenseId: string, title: string) => {
    window.api.updateExpense(projectId, expenseId, title).then((project) => {
      setProject(project);
    });
  };

  const updateExpensePortion = (
    expenseId: string,
    portionId: string,
    portion: NewExpensePortion
  ) => {
    window.api
      .updateExpensePortion(projectId, expenseId, portionId, portion)
      .then((project) => {
        setProject(project);
      });
  };

  return {
    project,
    addExpenseToProject,
    removeExpenseFromProject,
    addExpensePortion,
    removeExpensePortion,
    updateExpenseTitle,
    updateExpensePortion,
  };
}
