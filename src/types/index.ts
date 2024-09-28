type Expense = {
  id: string;
  title: string;
  expensePortions: ExpensePortion[];
};

type ExpensePortion = {
  id: string;
  amount: number;
  dateAdded: string;
  description: string;
};

type NewExpensePortion = Pick<ExpensePortion, "amount" | "description">;

type Project = {
  id: string;
  name: string;
  expenses: Expense[];
  createdAt: string;
};

type ProjectStats = {
  id: string;
  name: string;
  totalExpenses: number | null;
  lastExpense: {
    title: string;
    amount: number;
    date: string;
  } | null;
};

type NewExpense = {
  title: string;
  portion: NewExpensePortion;
};

type AppContextType = {
  projects: Project[];
  getProject: (projectId: string) => Project | undefined;
  addProject: (title: string) => void;
  addExpenseToProject: (projectId: string, expense: NewExpense) => void;
  getExpense: (projectId: string, expenseId: string) => Expense | undefined;
  updateExpenseTitle: (
    projectId: string,
    expenseId: string,
    title: string
  ) => void;
  removeExpenseFromProject: (projectId: string, expenseId: string) => void;
  addExpensePortion: (
    projectId: string,
    expenseId: string,
    portion: { amount: number; description: string }
  ) => void;
  removeExpensePortion: (
    projectId: string,
    expenseId: string,
    portionId: string
  ) => void;
  updateExpensePortion: (
    projectId: string,
    expenseId: string,
    portionId: string,
    portion: { amount: number; description: string }
  ) => void;
};
