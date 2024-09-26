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
