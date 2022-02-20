import { Box, Button, Divider, Stack, Text } from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import { useLogoutMutation } from "admin/generated/api/react-query";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DashboardLayoutSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useLogoutMutation(client);
  const menus = [
    {
      name: "강의 관리",
      path: "lecture-management",
      children: [
        { name: "콘텐츠", path: "contents" },
        { name: "정규 강의 재생목록", path: "regular-playlist" },
        { name: "추천 강의 재생목록", path: "curated-playlist" },
      ],
    },
    {
      name: "학생 관리",
      path: "student-management",
      children: [
        { name: "전체 학생 조회", path: "accounts" },
        { name: "계정 삭제 요청", path: "delete-account-requests" },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout.mutateAsync({});
    window.location.href = "/";
  };

  return (
    <Stack spacing={0} boxShadow="lg" mt={4} pt={7} px={2} rounded="md">
      <Text
        fontWeight="bold"
        fontSize="32px"
        lineHeight="30px"
        textAlign="center"
        color="blue.500"
      >
        DASH-Scratch
      </Text>
      <Box h={6} />
      <Button
        minW="208px"
        colorScheme="blue"
        onClick={() => navigate("/dashboard/lecture/new")}
      >
        강의 업로드
      </Button>
      <Box h={10} />
      <Stack spacing={8}>
        {menus.map((menu) => (
          <Box key={menu.path}>
            <Text variant="body-4" color="neutral.800" px={3} pb={2}>
              {menu.name}
            </Text>
            <Divider />
            <Stack pt={1} spacing={1}>
              {menu.children.map((subMenu) => (
                <Box
                  rounded="md"
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "blue.50", color: "blue.500" }}
                  key={subMenu.path}
                  color={
                    pathname === `/dashboard/${menu.path}/${subMenu.path}`
                      ? "blue.500"
                      : undefined
                  }
                  bg={
                    pathname === `/dashboard/${menu.path}/${subMenu.path}`
                      ? "blue.50"
                      : "transparent"
                  }
                  onClick={() =>
                    navigate(`/dashboard/${menu.path}/${subMenu.path}`)
                  }
                >
                  {subMenu.name}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
      <Box h={16} />
      <Button
        rounded="md"
        px={3}
        py={2}
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        onClick={handleLogout}
        isLoading={logout.isLoading}
        bg="transparent"
        fontWeight="400"
      >
        로그아웃
      </Button>
      <Box h={3} />
    </Stack>
  );
};
