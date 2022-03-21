import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import PasswordField from "@scratch-tutoring-web/app/shared/components/password-field/index";
import { useLoginMutation, UserType } from "admin/generated/api/react-query";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const Login = () => {
  const { register, handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: {
      username: localStorage.getItem("admin-login-id") ?? "",
      password: "",
      rememberMe: false,
    },
  });

  const login = useLoginMutation(client);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = ({
    username,
    password,
    rememberMe,
  }) => {
    if (rememberMe) {
      localStorage.setItem("admin-login-id", username);
    }
    login.mutate(
      {
        input: { loginId: username, password, userType: UserType.Admin },
      },
      {
        onSuccess: () => {
          navigate("/dashboard/lecture-management/contents");
        },
      },
    );
  };

  return (
    <Stack boxSize="full" bg="neutral.800">
      <Flex flex={1} justify="center" align="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            py={16}
            px={20}
            bg="white"
            borderRadius={16}
            boxShadow="xl"
            borderColor="neutral.100"
            borderWidth={1}
            w={{ base: "100vw", sm: "464px" }}
          >
            <Stack spacing={0}>
              <Stack align="center" spacing={-2}>
                <Img
                  w="200px"
                  mb="20px"
                  src="https://media-cdn.branch.so/01FYN0R6RRABD6GGQV26A7WYQ6/dongseo-logo.jpeg"
                />

                <Text fontWeight="bold" fontSize="40px" color="blue.500">
                  DASH-Scratch
                </Text>
                <Text variant="heading-3" color="neutral.800">
                  관리자 로그인
                </Text>
              </Stack>
              <Box h={10} />
              <FormControl id="email">
                <FormLabel fontWeight="bold" m={0}>
                  아이디
                </FormLabel>
                <Input
                  type="text"
                  required
                  isInvalid={!!formState.errors.username}
                  {...register("username")}
                />
              </FormControl>
              <Box h={2} />
              <PasswordField
                isInvalid={!!formState.errors.password}
                {...register("password")}
              />
              <Box h={6} />
              <Button
                bg="blue.500"
                type="submit"
                size="md"
                fontSize="md"
                color="white"
                _hover={{ bg: "blue.600" }}
                isLoading={login.isLoading}
              >
                로그인
              </Button>
              <Box h={2} />
              <Controller
                control={control}
                name="rememberMe"
                defaultValue
                render={({ field: { onChange, value, ref } }) => (
                  <Checkbox onChange={onChange} ref={ref} isChecked={value}>
                    <Text variant="body-4">아이디 저장</Text>
                  </Checkbox>
                )}
              />
            </Stack>
          </Stack>
        </form>
      </Flex>
    </Stack>
  );
};
