import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Img,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import {
  useIsLoginedQuery,
  useLoginMutation,
  UserType,
} from "app/generated/api/react-query";
import { PasswordField, SpacerV } from "app/shared/components/index";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const login = useLoginMutation(client);
  const { register, getValues, watch } = useForm({
    defaultValues: {
      loginId: localStorage.getItem("scratch-login-id"),
      password: "",
      "save-loginId": false,
    },
  });
  const navigate = useNavigate();
  const isLogined = useIsLoginedQuery(client, {}, { onError: () => null });

  useEffect(() => {
    if (!isLogined.isLoading) {
      if (isLogined.data?.studentMe.id) {
        navigate("/main");
      }
    }
  }, [isLogined.isLoading]);

  const onSubmit = () => {
    const loginId = getValues("loginId");
    const password = getValues("password");
    const saveLoginId = getValues("save-loginId");

    if (saveLoginId) {
      localStorage.setItem("scratch-login-id", loginId as string);
    }

    login.mutate(
      {
        input: {
          loginId: loginId as string,
          password,
          userType: UserType.Student,
        },
      },
      {
        onSuccess: () => {
          navigate("/main");
        },
      },
    );
  };
  return (
    <Stack boxSize="full" bg="neutral.100">
      <Flex flex={1} justify="center" align="center">
        <Stack
          py={16}
          px={20}
          bg="white"
          borderRadius={16}
          boxShadow="xl"
          borderColor="neutral.100"
          borderWidth={1}
        >
          <Stack spacing={0}>
            <Stack w="312px" align="center" spacing={-2}>
              <Img w="200px" mb="20px" src="https://media-cdn.branch.so/01FYN0R6RRABD6GGQV26A7WYQ6/dongseo-logo.jpeg" />
              <Text fontWeight="bold" fontSize="40px" color="blue.500">
                DASH-Scratch
              </Text>
              <Text variant="heading-3" color="neutral.300">
                ????????????!
              </Text>
            </Stack>

            <SpacerV h={10} />

            <FormControl id="email">
              <FormLabel fontWeight="bold" m={0}>
                ?????????
              </FormLabel>
              <SpacerV h={1} />
              <Input
                {...register("loginId")}
                type="email"
                autoComplete="email"
                required
              />
            </FormControl>

            <SpacerV h={2} />

            <PasswordField {...register("password")} />

            <SpacerV h={6} />

            <Button
              bg="blue.500"
              type="submit"
              size="lg"
              fontSize="md"
              color="white"
              _hover={{ bg: "blue.600" }}
              onClick={onSubmit}
              isLoading={login.isLoading}
              disabled={!(watch("loginId") && watch("password"))}
            >
              ?????????
            </Button>

            <SpacerV h={2} />
            <HStack justify="space-between">
              <Checkbox {...register("save-loginId")}>
                <Text variant="body-4">????????? ??????</Text>
              </Checkbox>
              <Text
                mt={3}
                variant="body-4"
                color="blue.500"
                cursor="pointer"
                onClick={() => window.open("/privacy.html", "_blank")}
              >
                ???????????? ????????????
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
};
