import { Outlet } from "react-router-dom";

export function App() {
  return (
    <div>
      <div className="top-bar flex gap-4 h-12 bg-violet-700 items-center p-4 text-emerald-50">
        <div className="log">
          <h1 className="text-xl font-semibold">HisabKitab</h1>
        </div>
      </div>
      <div className="app-views h-[calc(100vh-3rem)] overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}
