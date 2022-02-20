import {
  Button,
  Divider,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import { useAddStudentIdsMutation } from "admin/generated/api/react-query";
import _ from "lodash";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { ConfirmModal } from "./components/confirm-modal";

interface Student {
  studentNumber: string;
}

interface FormValues {
  student: Student[];
}

export const DashboardStudentManagementAccountsAdd = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const useDisclosureReturn = useDisclosure();

  const { mutate, isLoading } = useAddStudentIdsMutation(client);

  const { register, control, handleSubmit, setError, formState } =
    useForm<FormValues>({
      defaultValues: {
        student: [{ studentNumber: "" }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "student",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const studentNumbers = data.student.map((item) => item.studentNumber);

    // 중복
    const duplicated = _.omitBy(
      _.reduce(
        studentNumbers,
        (a: Record<string, number[]>, v, i) =>
          _.set(a, v, (a[v] || []).concat([i])),
        {},
      ),
      (v) => v.length <= 1,
    );

    if (!_.isEmpty(duplicated)) {
      _.flatten(Object.values(duplicated)).forEach((index) =>
        setError(`student.${index}.studentNumber`, { message: "foo" }),
      );
      toast({
        title: "중복 입력된 값이 있습니다",
        status: "error",
        position: "top",
      });
      return;
    }

    mutate(
      { studentNumbers },
      {
        onSuccess: () => useDisclosureReturn.onOpen(),
        onError: () => {
          // TODO: 유효하지 않은 학번
          // TODO: 이미 가입된 학번
        },
      },
    );
  };

  return (
    <>
      <HStack py={6} align="flex-end" spacing={3}>
        <IconButton
          variant="ghost"
          rounded="full"
          aria-label="back"
          fontSize="xl"
          icon={<RiArrowLeftLine />}
          onClick={() => navigate(-1)}
        />
        <Text variant="heading-0">학생 추가</Text>
      </HStack>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack my={8}>
          {fields.map((item, index) => (
            <HStack shouldWrapChildren key={item.id}>
              <Input
                placeholder="학번을 입력하세요"
                {...register(`student.${index}.studentNumber`)}
                isRequired
                isInvalid={
                  !!(formState.errors.student ?? [])[index]?.studentNumber
                }
              />
              {index === fields.length - 1 ? (
                <Button
                  colorScheme="blue"
                  onClick={() => append({ studentNumber: "" })}
                >
                  추가
                </Button>
              ) : (
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => remove(index)}
                >
                  삭제
                </Button>
              )}
            </HStack>
          ))}
        </Stack>
        <HStack justify="flex-end">
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            저장하기
          </Button>
        </HStack>
      </form>
      <ConfirmModal
        {...useDisclosureReturn}
        studentCount={fields.length}
        onClose={() => {
          useDisclosureReturn.onClose();
          navigate(-1);
        }}
      />
    </>
  );
};
