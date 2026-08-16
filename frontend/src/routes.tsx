import type { ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import { AdminEditorCreateRoutePage, AdminEditorModifyRoutePage } from "./components/admin/AdminEditor";
import AdminList from "./components/admin/AdminList";
import HomePage from "./components/pages/HomePage";
import NotFoundPage from "./components/pages/NotFoundPage";

const buildDefaultRoutes = (app: string, resource: string) => ({
  [`/${app}/${resource}`]: <AdminList app={app} resource={resource} title="발표 제안 관리" />,
  [`/${app}/${resource}/create`]: <AdminEditorCreateRoutePage app={app} resource={resource} />,
  [`/${app}/${resource}/:id`]: <AdminEditorModifyRoutePage app={app} resource={resource} />,
});

const adminRoutes = {
  ...buildDefaultRoutes("proposals", "proposal"),
};

const homeRoutes = Object.keys(adminRoutes).filter((path) => !path.endsWith("/create") && !path.includes(":"));

export const RegisteredRoutes: Record<string, ReactElement> = {
  "/": <HomePage routes={homeRoutes} />,
  ...adminRoutes,
  "*": <NotFoundPage />,
};

export const router = createBrowserRouter([
  {
    element: <App />,
    children: Object.entries(RegisteredRoutes).map(([path, element]) => ({ path, element })),
  },
]);
