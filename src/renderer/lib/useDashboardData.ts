import { useEffect, useState } from "react";

interface DashboardData {
  allProjectStats: ProjectStats[];
  addProject: (title: string) => void;
  deleteProject: (id: string) => void;
}

export function useDashboardData(): DashboardData {
  const [allProjectStats, setAllProjectStats] = useState([]);

  useEffect(() => {
    window.api.getAllProjectStats().then((projectsStats) => {
      setAllProjectStats(projectsStats);
    });
  });

  const addProject = (title: string) => {
    window.api.createProject(title).then((projectsStats) => {
      setAllProjectStats(projectsStats);
    });
  };

  const deleteProject = (id: string) => {
    window.api.deleteProject(id);
  };

  return {
    allProjectStats,
    addProject,
    deleteProject,
  };
}
