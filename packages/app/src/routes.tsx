import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

import { Auth } from "./auth";
import { Lesson } from "./lesson/[lessonId]/index";
import { Main } from "./main/index";

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/login" />,
  },
  {
    path: "login",
    element: <Auth />,
  },
  {
    path: "main",
    element: <Main />,
  },
  {
    path: "lesson/:lessonId",
    element: <Lesson />,
  },
  {
    path: "*",
    element: <>not found</>, // TODO,
  },
];
