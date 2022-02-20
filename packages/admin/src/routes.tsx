import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

import { DashboardLayout } from "./dashboard/layout";
import { DashboardLecture } from "./dashboard/lecture/[id]/index";
import { DashboardLectureManagementContents } from "./dashboard/lecture-management/contents/index";
import { DashboardLectureManagementCuratedPlaylist } from "./dashboard/lecture-management/curated-playlist/index";
import { DashboardLectureManagementRegularPlaylistDetail } from "./dashboard/lecture-management/regular-playlist/[playlistId]";
import { DashboardLectureManagementRegularPlaylistAdd } from "./dashboard/lecture-management/regular-playlist/add";
import { DashboardLectureManagementRegularPlaylist } from "./dashboard/lecture-management/regular-playlist/index";
import { DashboardStudentManagementAccountsAdd } from "./dashboard/student-management/accounts/add";
import { DashboardStudentManagementAccounts } from "./dashboard/student-management/accounts/index";
import { DashboardStudentManagementDeleteAccountRequests } from "./dashboard/student-management/delete-account-requests/index";
import { Login } from "./login";
import { NotFound } from "./not-found";

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "lecture/:id",
        element: <DashboardLecture />,
      },
      {
        path: "lecture-management/contents",
        element: <DashboardLectureManagementContents />,
      },
      {
        path: "lecture-management/regular-playlist",
        element: <DashboardLectureManagementRegularPlaylist />,
      },
      {
        path: "lecture-management/regular-playlist/add",
        element: <DashboardLectureManagementRegularPlaylistAdd />,
      },
      {
        path: "lecture-management/regular-playlist/:playlistId",
        element: <DashboardLectureManagementRegularPlaylistDetail />,
      },
      {
        path: "lecture-management/curated-playlist",
        element: <DashboardLectureManagementCuratedPlaylist />,
      },
      {
        path: "student-management/accounts",
        element: <DashboardStudentManagementAccounts />,
      },
      {
        path: "student-management/accounts/add",
        element: <DashboardStudentManagementAccountsAdd />,
      },
      {
        path: "student-management/delete-account-requests",
        element: <DashboardStudentManagementDeleteAccountRequests />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
