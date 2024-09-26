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

type Project = {
  id: string;
  name: string;
  expenses: Expense[];
};

type NewExpense = {
  title: string;
  portionDescription: string;
  portionAmount: number;
};
