import { contextBridge, ipcRenderer } from "electron";

export type ContextBridgeApi = {
  getAllProjectStats: () => Promise<ProjectStats[]>;
  getProject: (id: string) => Promise<Project | null>;
  createProject: (name: string) => Promise<ProjectStats[]>;
  deleteProject: (id: string) => Promise<ProjectStats[]>;
  updateProject: (id: string, name: string) => Promise<ProjectStats[]>;
  createNewExpense: (
    projectId: string,
    newExpense: NewExpense
  ) => Promise<Project>;
  deleteExpense: (projectId: string, expenseId: string) => Promise<Project>;
  updateExpense: (
    projectId: string,
    expenseId: string,
    title: string
  ) => Promise<Project>;
  addPortionToExpense: (
    projectId: string,
    expenseId: string,
    portion: NewExpensePortion
  ) => Promise<Project>;
  removePortionFromExpense: (
    projectId: string,
    expenseId: string,
    portionId: string
  ) => Promise<Project>;
  updateExpensePortion: (
    projectId: string,
    expenseId: string,
    portionId: string,
    portion: NewExpensePortion
  ) => Promise<Project>;
  printPDF: (project: Project) => Promise<void>;
};

const exposedApi: ContextBridgeApi = {
  getAllProjectStats: () => {
    return ipcRenderer.invoke("get-all-project-stats");
  },
  getProject(id: string) {
    return ipcRenderer.invoke("get-project", id);
  },
  createProject: (name: string) => {
    return ipcRenderer.invoke("create-project", name);
  },
  deleteProject: (id: string) => {
    return ipcRenderer.invoke("delete-project", id);
  },
  updateProject: (id: string, name: string) => {
    return ipcRenderer.invoke("update-project", id, name);
  },
  createNewExpense: (projectId: string, newExpense: NewExpense) => {
    return ipcRenderer.invoke("create-new-expense", projectId, newExpense);
  },
  deleteExpense: (projectId: string, expenseId: string) => {
    return ipcRenderer.invoke("delete-expense", projectId, expenseId);
  },
  updateExpense: (projectId: string, expenseId: string, title: string) => {
    return ipcRenderer.invoke("update-expense", projectId, expenseId, title);
  },
  addPortionToExpense: (
    projectId: string,
    expenseId: string,
    portion: NewExpensePortion
  ) => {
    return ipcRenderer.invoke(
      "add-portion-to-expense",
      projectId,
      expenseId,
      portion
    );
  },
  removePortionFromExpense: (
    projectId: string,
    expenseId: string,
    portionId: string
  ) => {
    return ipcRenderer.invoke(
      "remove-portion-from-expense",
      projectId,
      expenseId,
      portionId
    );
  },
  updateExpensePortion: (
    projectId: string,
    expenseId: string,
    portionId: string,
    portion: NewExpensePortion
  ) => {
    return ipcRenderer.invoke(
      "update-expense-portion",
      projectId,
      expenseId,
      portionId,
      portion
    );
  },

  printPDF: (project: Project) => {
    return ipcRenderer.invoke("print-pdf", project);
  },
};

contextBridge.exposeInMainWorld("api", exposedApi);
