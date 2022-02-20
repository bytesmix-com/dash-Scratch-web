import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  UseDisclosureReturn,
  useToast,
} from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import { useDeleteRegularPlaylistMutation } from "admin/generated/api/react-query";
import { ModalLayout } from "admin/shared/components";
import { queryClient } from "admin/src/App";
import React from "react";

interface Props {
  id?: number;
  useDisclosureReturn: UseDisclosureReturn;
  onClickBack?: () => void;
}

interface DeleteProps {
  buttonLoading: boolean;
  onAgreeButtonClick: () => void;
  onDisAgreeButtonClick: () => void;
}

export const OnDelete = ({
  buttonLoading,
  onAgreeButtonClick,
  onDisAgreeButtonClick,
}: DeleteProps) => (
  <Stack spacing={0} py={6} justify="center" align="center">
    <Text variant="heading-3">선택한 재생목록 삭제</Text>

    <Box boxSize={1} />

    <Text variant="body-1" textAlign="center" color="neutral.300">
      이 작업은 되돌릴 수 없습니다.
      <br />
      삭제하시겠습니까?
    </Text>

    <Box boxSize={6} />

    <HStack>
      <Button
        variant="primary-line"
        w="92px"
        onClick={onAgreeButtonClick}
        isLoading={buttonLoading}
      >
        네
      </Button>
      <Button variant="primary" w="92px" onClick={onDisAgreeButtonClick}>
        아니오
      </Button>
    </HStack>
  </Stack>
);

interface SuccessProps {
  onButtonClick: () => void;
}

export const OnSuccess = ({ onButtonClick }: SuccessProps) => (
  <Stack spacing={6} py={6} justify="center" align="center">
    <Text variant="heading-3" textAlign="center">
      선택한 재생목록이
      <br />
      삭제되었습니다
    </Text>
    <Button variant="primary" onClick={onButtonClick}>
      돌아가기
    </Button>
  </Stack>
);

export const DeletePlaylistModal = ({
  id,
  useDisclosureReturn,
  onClickBack,
}: Props) => {
  const { mutate, isLoading } = useDeleteRegularPlaylistMutation(client);
  const toast = useToast();

  const [bodyComponent, setBodyComponent] = React.useState("delete");

  const renderBody = () => {
    if (bodyComponent === "delete")
      return (
        <OnDelete
          buttonLoading={isLoading}
          onAgreeButtonClick={() => {
            if (!id) {
              toast({
                title: "id를 찾을 수 없습니다.",
                status: "error",
                position: "top",
              });
              return;
            }
            mutate(
              { ids: [id] },
              {
                onSuccess: () => {
                  toast({
                    title: "정상적으로 삭제되었습니다",
                    status: "success",
                    position: "top",
                  });
                  setBodyComponent("success");
                },
              },
            );
          }}
          onDisAgreeButtonClick={useDisclosureReturn.onClose}
        />
      );
    if (bodyComponent === "success")
      return (
        <OnSuccess
          onButtonClick={() => {
            queryClient.refetchQueries(["PaginatedRegularPlaylist"]);
            useDisclosureReturn.onClose();
            if (onClickBack) {
              onClickBack();
            }
          }}
        />
      );
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  };

  return (
    <ModalLayout title="재생목록" useDisclosureReturn={useDisclosureReturn}>
      {renderBody()}
    </ModalLayout>
  );
};
