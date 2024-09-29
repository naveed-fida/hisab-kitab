import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  PrintToPDFOptions,
} from "electron";
import path from "path";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { createId } from "@paralleldrive/cuid2";
import {
  buildNewProject,
  buildStatsForProject,
  TableForPDF,
  slugify,
} from "./utils";
import { renderToString } from "react-dom/server";
import React from "react";
import squirrelStartup from "electron-squirrel-startup";

const OS_HOME = app.getPath("home");
const DATA_DIR_NAME = "HisabKitab";
const DATA_DIR = path.join(OS_HOME, "Dropbox", DATA_DIR_NAME);
const PROJECTS_STATS_FILE_PATH = path.join(DATA_DIR, "stats.json");
const PROJECT_FILE_PREFIX = "project-";
const PDF_HTML_PATH = path.join(DATA_DIR, "pdf.html");

const pdfOptions: PrintToPDFOptions = {
  pageSize: "A4",
  printBackground: true,
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    title: "HisabKitab",
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const mainWindow = createWindow();

  ipcMain.handle("print-pdf", (event, project: Project) => {
    const htmlContents = renderToString(
      React.createElement(TableForPDF, { project })
    );
    writeFileSync(PDF_HTML_PATH, htmlContents);
    const newWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    newWindow.loadFile(PDF_HTML_PATH);
    newWindow.webContents.on("did-finish-load", () => {
      newWindow.webContents.printToPDF(pdfOptions).then((data) => {
        const fileName = dialog.showSaveDialogSync(mainWindow, {
          title: `Save PDF for ${project.name}`,
          defaultPath: path.join(
            app.getPath("desktop"),
            `${slugify(project.name)}.pdf`
          ),
          buttonLabel: "Save PDF",
        });

        if (fileName) {
          writeFileSync(fileName, data);
        }
        newWindow.close();
      });
    });
  });
  ipcMain.handle("get-all-project-stats", () => {
    const fileExists = existsSync(PROJECTS_STATS_FILE_PATH);
    if (!fileExists) {
      // create file
      writeFileSync(PROJECTS_STATS_FILE_PATH, JSON.stringify([]));
    }
    const stats = readFileSync(PROJECTS_STATS_FILE_PATH, "utf-8");

    return JSON.parse(stats);
  });
  ipcMain.handle("get-project", (event, id: string) => {
    try {
      const projectFilePath = path.join(
        DATA_DIR,
        `${PROJECT_FILE_PREFIX}${id}.json`
      );
      const project = readFileSync(projectFilePath, "utf-8");
      return JSON.parse(project);
    } catch (e) {
      return null;
    }
  });

  ipcMain.handle("create-project", (event, name: string) => {
    const stats = readFileSync(PROJECTS_STATS_FILE_PATH, "utf-8");
    const parsedStats = JSON.parse(stats);
    const newProject = buildNewProject(name);
    const statsForNewProject = buildStatsForProject(newProject);
    const updatedStats = [...parsedStats, statsForNewProject];
    writeFileSync(PROJECTS_STATS_FILE_PATH, JSON.stringify(updatedStats));
    writeFileSync(
      path.join(DATA_DIR, `${PROJECT_FILE_PREFIX}${newProject.id}.json`),
      JSON.stringify(newProject)
    );
    return updatedStats;
  });

  ipcMain.handle("delete-project", (event, id: string) => {
    const stats = readFileSync(PROJECTS_STATS_FILE_PATH, "utf-8");
    const parsedStats = JSON.parse(stats);
    const updatedStats = parsedStats.filter(
      (project: ProjectStats) => project.id !== id
    );
    writeFileSync(PROJECTS_STATS_FILE_PATH, JSON.stringify(updatedStats));
    unlinkSync(path.join(DATA_DIR, `${PROJECT_FILE_PREFIX}${id}.json`));
    return updatedStats;
  });

  ipcMain.handle("update-project", (event, id: string, name: string) => {
    const projectFilePath = path.join(
      DATA_DIR,
      `${PROJECT_FILE_PREFIX}${id}.json`
    );
    const projectContents = readFileSync(projectFilePath, "utf-8");
    const parsedProject = JSON.parse(projectContents);
    const updatedProject = {
      ...parsedProject,
      name,
    };
    const updatedStats = saveUpdatedStatsForProject(updatedProject);
    writeFileSync(projectFilePath, JSON.stringify(updatedProject));
    return updatedStats;
  });

  ipcMain.handle("create-new-expense", (event, projectId, newExpense) => {
    const projectFilePath = path.join(
      DATA_DIR,
      `${PROJECT_FILE_PREFIX}${projectId}.json`
    );
    const projectContents = readFileSync(projectFilePath, "utf-8");
    const parsedProject = JSON.parse(projectContents);
    const createdExpense = {
      id: createId(),
      title: newExpense.title,
      expensePortions: [
        {
          id: createId(),
          amount: newExpense.portion.amount,
          description: newExpense.portion.description,
          dateAdded: new Date().toISOString(),
        },
      ],
    };
    const updatedProject = {
      ...parsedProject,
      expenses: [...parsedProject.expenses, createdExpense],
    };
    saveUpdatedStatsForProject(updatedProject);
    writeFileSync(projectFilePath, JSON.stringify(updatedProject));
    return updatedProject;
  });

  ipcMain.handle("delete-expense", (event, projectId, expenseId) => {
    const projectFilePath = path.join(
      DATA_DIR,
      `${PROJECT_FILE_PREFIX}${projectId}.json`
    );
    const projectContents = readFileSync(projectFilePath, "utf-8");
    const parsedProject = JSON.parse(projectContents);
    const updatedProject = {
      ...parsedProject,
      expenses: parsedProject.expenses.filter(
        (expense: Expense) => expense.id !== expenseId
      ),
    };
    saveUpdatedStatsForProject(updatedProject);
    writeFileSync(projectFilePath, JSON.stringify(updatedProject));
    return updatedProject;
  });

  ipcMain.handle("update-expense", (event, projectId, expenseId, title) => {
    const projectFilePath = path.join(
      DATA_DIR,
      `${PROJECT_FILE_PREFIX}${projectId}.json`
    );
    const projectContents = readFileSync(projectFilePath, "utf-8");
    const parsedProject = JSON.parse(projectContents);
    const updatedProject = {
      ...parsedProject,
      expenses: parsedProject.expenses.map((expense: Expense) => {
        if (expense.id === expenseId) {
          return {
            ...expense,
            title,
          };
        }
        return expense;
      }),
    };
    saveUpdatedStatsForProject(updatedProject);
    writeFileSync(projectFilePath, JSON.stringify(updatedProject));
    return updatedProject;
  });

  ipcMain.handle(
    "add-portion-to-expense",
    (event, projectId, expenseId, portion) => {
      const projectFilePath = path.join(
        DATA_DIR,
        `${PROJECT_FILE_PREFIX}${projectId}.json`
      );
      const projectContents = readFileSync(projectFilePath, "utf-8");
      const parsedProject = JSON.parse(projectContents);
      const updatedProject = {
        ...parsedProject,
        expenses: parsedProject.expenses.map((expense: Expense) => {
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
      saveUpdatedStatsForProject(updatedProject);
      writeFileSync(projectFilePath, JSON.stringify(updatedProject));
      return updatedProject;
    }
  );

  ipcMain.handle(
    "remove-portion-from-expense",
    (event, projectId, expenseId, portionId) => {
      const projectFilePath = path.join(
        DATA_DIR,
        `${PROJECT_FILE_PREFIX}${projectId}.json`
      );
      const projectContents = readFileSync(projectFilePath, "utf-8");
      const parsedProject = JSON.parse(projectContents);
      const updatedProject = {
        ...parsedProject,
        expenses: parsedProject.expenses.map((expense: Expense) => {
          if (expense.id === expenseId) {
            return {
              ...expense,
              expensePortions: expense.expensePortions.filter(
                (portion: ExpensePortion) => portion.id !== portionId
              ),
            };
          }
          return expense;
        }),
      };
      saveUpdatedStatsForProject(updatedProject);
      writeFileSync(projectFilePath, JSON.stringify(updatedProject));
      return updatedProject;
    }
  );

  ipcMain.handle(
    "update-expense-portion",
    (event, projectId, expenseId, portionId, portion) => {
      const projectFilePath = path.join(
        DATA_DIR,
        `${PROJECT_FILE_PREFIX}${projectId}.json`
      );
      const projectContents = readFileSync(projectFilePath, "utf-8");
      const parsedProject = JSON.parse(projectContents);
      const updatedProject = {
        ...parsedProject,
        expenses: parsedProject.expenses.map((expense: Expense) => {
          if (expense.id === expenseId) {
            return {
              ...expense,
              expensePortions: expense.expensePortions.map(
                (existingPortion: ExpensePortion) => {
                  if (existingPortion.id === portionId) {
                    return {
                      ...existingPortion,
                      amount: portion.amount,
                      description: portion.description,
                    };
                  }
                  return existingPortion;
                }
              ),
            };
          }
          return expense;
        }),
      };
      saveUpdatedStatsForProject(updatedProject);
      writeFileSync(projectFilePath, JSON.stringify(updatedProject));
      return updatedProject;
    }
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function saveUpdatedStatsForProject(updatedProject: Project) {
  const stats = readFileSync(PROJECTS_STATS_FILE_PATH, "utf-8");
  const parsedStats = JSON.parse(stats);
  const updatedStatsForProject = buildStatsForProject(updatedProject);
  const updatedStats = parsedStats.map((project: ProjectStats) => {
    if (project.id === updatedProject.id) {
      return updatedStatsForProject;
    }
    return project;
  });

  writeFileSync(PROJECTS_STATS_FILE_PATH, JSON.stringify(updatedStats));
  return updatedStats;
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
