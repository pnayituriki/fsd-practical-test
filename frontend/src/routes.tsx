import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <UsersPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
