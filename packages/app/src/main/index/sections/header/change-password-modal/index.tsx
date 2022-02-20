import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  UseDisclosureReturn,
  useToast,
} from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import {
  useChangeStudentPasswordMutation,
  useLogoutMutation,
} from "app/generated/api/react-query";
import { ModalLayout, SpacerV } from "app/shared/components";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder: string;
  type: boolean;
  useFormReturn: UseFormReturn;
  onClick: () => void;
}
export const PasswordInput = ({
  name,
  label,
  placeholder,
  type,
  useFormReturn,
  onClick,
}: PasswordInputProps) => {
  const { register } = useFormReturn;
  return (
    <FormControl>
      {!!label && (
        <>
          <FormLabel m={0}>
            <Text variant="body-4">{label}</Text>
          </FormLabel>
          <SpacerV h={1} />
        </>
      )}
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            color="neutral.300"
            aria-label={type ? "Mask password" : "Reveal password"}
            icon={type ? <HiEyeOff /> : <HiEye />}
            onClick={onClick}
            tabIndex={-1}
          />
        </InputRightElement>
        <Input
          placeholder={placeholder}
          borderWidth="1.5px"
          focusBorderColor="blue.500"
          type={type ? "text" : "password"}
          {...register(name)}
        />
      </InputGroup>
    </FormControl>
  );
};

interface Props {
  useDisclosureReturn: UseDisclosureReturn;
}

interface BodyProps {
  onButtonClick: () => void;
}
export const ChangePassword = ({ onButtonClick }: BodyProps) => {
  const changeStudentPassword = useChangeStudentPasswordMutation(client);

  const [prevPasswordShow, setPrevPasswordShow] = React.useState(false);
  const [newPasswordShow, setNewPasswordShow] = React.useState(false);
  const [newPasswordConfirmShow, setNewPasswordConfirmShow] =
    React.useState(false);

  const useFormReturn = useForm();

  const { getValues } = useFormReturn;

  const toast = useToast();

  const onSubmit = () => {
    if (getValues("new-password") !== getValues("new-password-confirm")) {
      toast({
        title: "새 비밀번호와 확인이 일치하지 않습니다!",
        status: "error",
        position: "top",
      });
      return;
    }
    changeStudentPassword.mutate(
      {
        input: {
          newPassword: getValues("new-password"),
          previousPassword: getValues("prev-password"),
        },
      },
      {
        onSuccess: () => {
          onButtonClick();
        },
      },
    );
  };
  return (
    <Stack spacing={0} w="full">
      <Stack w="full" spacing={0} px={4} py={6} align="center">
        <Text variant="heading-3">비밀번호 변경</Text>

        <SpacerV h={6} />

        <PasswordInput
          name="prev-password"
          label="기존 비밀번호"
          placeholder="기존 비밀번호를 입력하세요"
          type={prevPasswordShow}
          onClick={() => setPrevPasswordShow(!prevPasswordShow)}
          useFormReturn={useFormReturn}
        />

        <SpacerV h={6} />

        <PasswordInput
          name="new-password"
          label="새로운 비밀번호"
          placeholder="새로운 비밀번호를 입력하세요"
          type={newPasswordShow}
          onClick={() => setNewPasswordShow(!newPasswordShow)}
          useFormReturn={useFormReturn}
        />
        <SpacerV h={2} />
        <PasswordInput
          name="new-password-confirm"
          placeholder="새로운 비밀번호를 한 번 더입력하세요"
          type={newPasswordConfirmShow}
          onClick={() => setNewPasswordConfirmShow(!newPasswordConfirmShow)}
          useFormReturn={useFormReturn}
        />
      </Stack>
      <HStack w="full" h="72px" bg="neutral.50" justify="flex-end" px={4}>
        <Button
          variant="primary"
          onClick={onSubmit}
          isLoading={changeStudentPassword.isLoading}
        >
          저장하기
        </Button>
      </HStack>
    </Stack>
  );
};

export const OnSuccess = ({ onButtonClick }: BodyProps) => (
  <Stack spacing={6} py={6} justify="center" align="center">
    <Text variant="heading-3">비밀번호 변경이 완료되었습니다.</Text>
    <Button variant="primary" onClick={onButtonClick}>
      다시 로그인하기
    </Button>
  </Stack>
);

export const ChangePasswordModal = ({ useDisclosureReturn }: Props) => {
  const navigate = useNavigate();

  const [bodyComponent, setBodyComponent] = React.useState("password");
  const logout = useLogoutMutation(client);
  const renderBody = () => {
    if (bodyComponent === "password")
      return (
        <ChangePassword onButtonClick={() => setBodyComponent("success")} />
      );
    if (bodyComponent === "success")
      return (
        <OnSuccess
          onButtonClick={() => {
            logout.mutate(
              {},
              {
                onSuccess: () => {
                  navigate("/login");
                },
              },
            );
          }}
        />
      );
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  };

  return (
    <ModalLayout title="계정 설정" useDisclosureReturn={useDisclosureReturn}>
      {renderBody()}
    </ModalLayout>
  );
};
