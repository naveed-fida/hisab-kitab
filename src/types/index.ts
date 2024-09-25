type Expense = {
  id: string;
  description: string;
  expensePortions: ExpensePortion[];
};

type ExpensePortion = {
  id: string;
  amount: number;
  dateAdded: string;
};

type Project = {
  id: string;
  name: string;
  expenses: Expense[];
};
