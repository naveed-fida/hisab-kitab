import { app } from "electron";
import path from "path";

export const CURRENCY = "USD";
export const OS_HOME = app.getPath("home");
export const DATA_DIR_NAME = "HisabKitab";
export const DATA_DIR = path.join(OS_HOME, "Dropbox", DATA_DIR_NAME);
export const PROJECTS_STATS_FILE_PATH = path.join(DATA_DIR, "stats.json");
export const PROJECT_FILE_PREFIX = "project-";
export const PDF_HTML_PATH = path.join(DATA_DIR, "pdf.html");
