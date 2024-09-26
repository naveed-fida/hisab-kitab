import {
  calculateTotalExpenses,
  getDateExpenseEdited,
  getLastUpdatedExpense,
  getLastUpdatedPortion,
  sortProjectsByDate,
} from "../../utils";
import { useAppData } from "./dataStore";

interface DashboardData {
  projectsStats: {
    id: string;
    name: string;
    totalExpenses: number | null;
    lastExpense: {
      title: string;
      amount: number;
      date: string;
    } | null;
  }[];

  addProject: (title: string) => void;
}

export function useDashboardData(): DashboardData {
  const { projects, addProject } = useAppData();

  const projectsStats = sortProjectsByDate(projects).map((project) => {
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
  });

  return {
    projectsStats,
    addProject,
  };
}
