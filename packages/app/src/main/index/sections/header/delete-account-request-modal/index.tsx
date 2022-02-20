import {
  Button,
  HStack,
  Stack,
  Text,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import { useAddDeleteStudentRequestMutation } from "app/generated/api/react-query";
import { ModalLayout, SpacerV } from "app/shared/components";
import React from "react";

interface Props {
  useDisclosureReturn: UseDisclosureReturn;
}

interface RequestProps {
  buttonLoading: boolean;
  onAgreeButtonClick: () => void;
  onDisAgreeButtonClick: () => void;
}

export const Request = ({
  buttonLoading,
  onAgreeButtonClick,
  onDisAgreeButtonClick,
}: RequestProps) => (
  <Stack spacing={0} py={6} justify="center" align="center">
    <Text variant="heading-3">계정 삭제 요청</Text>
    <SpacerV h={1} />

    <Text variant="body-1" textAlign="center">
      관리자에게 계정 삭제를
      <br />
      요청하시겠습니까?
    </Text>

    <SpacerV h={6} />

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

export const Success = ({ onButtonClick }: SuccessProps) => (
  <Stack spacing={6} py={6} justify="center" align="center">
    <Text variant="heading-3">계정 삭제 요청이 전달되었습니다</Text>
    <Button variant="primary" onClick={onButtonClick}>
      돌아가기
    </Button>
  </Stack>
);

export const DeleteAccountRequestModal = ({ useDisclosureReturn }: Props) => {
  const [status, setStatus] = React.useState("request");
  const addDeleteStudentRequest = useAddDeleteStudentRequestMutation(client);
  const renderBody = () => {
    if (status === "request")
      return (
        <Request
          buttonLoading={addDeleteStudentRequest.isLoading}
          onAgreeButtonClick={() => {
            addDeleteStudentRequest.mutate(
              {},
              {
                onSuccess: () => {
                  setStatus("success");
                },
              },
            );
          }}
          onDisAgreeButtonClick={useDisclosureReturn.onClose}
        />
      );
    if (status === "success")
      return <Success onButtonClick={useDisclosureReturn.onClose} />;
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  };
  return (
    <ModalLayout title="계정 설정" useDisclosureReturn={useDisclosureReturn}>
      {renderBody()}
    </ModalLayout>
  );
};
