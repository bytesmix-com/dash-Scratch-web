import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import {
  useGetStudentNumberQuery,
  useLogoutMutation,
} from "app/generated/api/react-query";
import { SpacerV } from "app/shared/components";
import React from "react";
import { useNavigate } from "react-router-dom";

import { ChangePasswordModal } from "./change-password-modal";
import { DeleteAccountRequestModal } from "./delete-account-request-modal";

export const MainHeader = () => {
  const { data: GetStudentNumber } = useGetStudentNumberQuery(client);
  const logout = useLogoutMutation(client);
  const navigate = useNavigate();
  const onLogout = () => {
    logout.mutate(
      {},
      {
        onSuccess: () => {
          navigate("/login");
        },
      },
    );
  };
  const ChangePasswordReturn = useDisclosure();

  const DeleteAccountRequestReturn = useDisclosure();

  return (
    <Stack spacing={0} w="full" align="center">
      <Stack px={10} pt={4} pb={6} spacing={0} w="full" maxW="1440px">
        <Text fontWeight="bold" fontSize="40px" color="white">
          DASH-Scratch
        </Text>
        <HStack justify="space-between">
          <Text variant="heading-0" color="neutral.50" isTruncated>
            {`안녕하세요!  ${
              GetStudentNumber?.studentMe.studentNumber ?? ""
            }님!`}
          </Text>

          <HStack>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={
                      // eslint-disable-next-line react/jsx-wrap-multilines
                      <SvgIcon
                        name="icon/chevron_up"
                        boxSize="22px"
                        transform={`rotate(${isOpen ? "0" : "180"}deg)`}
                      />
                    }
                    variant="primary-line"
                  >
                    계정설정
                  </MenuButton>
                  <MenuList p={1} border="none" shadow="2xl">
                    <MenuItem
                      borderRadius={6}
                      onClick={ChangePasswordReturn.onOpen}
                    >
                      <Text variant="body-1">비밀번호 변경</Text>
                    </MenuItem>
                    <SpacerV h={1} />
                    <MenuItem
                      borderRadius={6}
                      onClick={DeleteAccountRequestReturn.onOpen}
                    >
                      <Text variant="body-1">계정 삭제 요청</Text>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
            <Button variant="primary-line" onClick={onLogout}>
              로그아웃
            </Button>
          </HStack>
        </HStack>
      </Stack>
      <ChangePasswordModal useDisclosureReturn={ChangePasswordReturn} />
      <DeleteAccountRequestModal
        useDisclosureReturn={DeleteAccountRequestReturn}
      />
    </Stack>
  );
};
