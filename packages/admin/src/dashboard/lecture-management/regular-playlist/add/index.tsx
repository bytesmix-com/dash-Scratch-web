/* eslint-disable react/jsx-one-expression-per-line */
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  AddOrModifyRegularPlaylistInput,
  useAddOrModifyRegularPlaylistMutation,
  useRegularPlaylistWeeksQuery,
} from "admin/generated/api/react-query";
import { format } from "date-fns";
import _ from "lodash";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const DashboardLectureManagementRegularPlaylistAdd = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { register, handleSubmit, watch, setValue, getValues } = useForm();

  const { data, isLoading: isDataLoading } = useRegularPlaylistWeeksQuery(
    client,
    {},
    {
      onSuccess: (res) => {
        const occupied = res.regularPlaylists.map((item) => item.week);
        const weeks = _.range(1, 21).filter(
          (weekNum) => !occupied.includes(weekNum),
        );
        setValue("week", weeks[0]);
      },
    },
  );
  const { mutate, isLoading } = useAddOrModifyRegularPlaylistMutation(client);

  const onSubmit: SubmitHandler<AddOrModifyRegularPlaylistInput> = (values) => {
    if (watch("week") === undefined) {
      setValue("week", 1);
    }
    mutate(
      {
        input: {
          ...values,
          id: null,
          week: getValues("week") as number,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "재생 목록이 추가되었습니다",
            status: "success",
            position: "top",
          });
          navigate("/dashboard/lecture-management/regular-playlist");
        },
      },
    );
  };

  const occupiedWeeks = data?.regularPlaylists.map((item) => item.week);

  return (
    <>
      <HStack py={6} pt={7} spacing={4}>
        <SvgIcon
          name="icon/arrow_left"
          boxSize={6}
          _hover={{ color: "blue.500", cursor: "pointer" }}
          onClick={() =>
            navigate("/dashboard/lecture-management/regular-playlist")
          }
        />
        <Text variant="heading-0">정규 강의 재생목록 추가</Text>
      </HStack>

      <Divider />

      <Box boxSize={8} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <Input
            maxW="568px"
            placeholder="재생목록의 이름을 입력하세요"
            {...register("name")}
          />
        </FormControl>

        <Box boxSize={4} />

        <Stack
          w="full"
          p={4}
          spacing={1}
          bg="neutral.50"
          border="1px solid #ECEEF3"
        >
          <Text variant="body-4">최초 작성일</Text>
          <Text variant="body-3">{format(new Date(), "yy.MM.dd")}</Text>

          <Box boxSize={4} />
          <Text variant="body-4">
            스크래치 공유 주차 설정 (설정한 주차에 사용하던 스크래치를 계속
            사용합니다)
          </Text>
          <FormControl isRequired>
            <Skeleton isLoaded={!isDataLoading}>
              <Menu isLazy {...register("shareScratchWithRegularPlaylistId")}>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      size="md"
                      maxW="88px"
                      p={2}
                      rightIcon={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <SvgIcon
                          name={`icon/unfold_${isOpen ? "less" : "more"}`}
                          boxSize={6}
                          color="neutral.200"
                        />
                      }
                      variant="outline"
                      bg="white"
                      _active={{ bg: "white", border: "1px solid #1060FC" }}
                      border="1px solid #DBDEE7"
                    >
                      <Text variant="body-1">
                        {!watch("shareScratchWithRegularPlaylistId")
                          ? "공유안함"
                          : data?.regularPlaylists.find(
                              (item) =>
                                item.id ===
                                watch("shareScratchWithRegularPlaylistId"),
                            )?.name}
                      </Text>
                    </MenuButton>
                    <MenuList
                      p={1}
                      border="none"
                      shadow="2xl"
                      minW={0}
                      maxH={44}
                      overflow="scroll"
                      sx={{
                        "&::-webkit-scrollbar-track": {
                          bg: "transparent",
                        },
                        "&::-webkit-scrollbar": {
                          height: "8px",
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bg: "blackAlpha.200",
                          borderRadius: "20px",
                        },
                      }}
                    >
                      <MenuItem
                        borderRadius={6}
                        onClick={() =>
                          setValue("shareScratchWithRegularPlaylistId", null)
                        }
                      >
                        <Text variant="body-1">공유안함</Text>
                      </MenuItem>
                      {data?.regularPlaylists.map((playlist) => (
                        <MenuItem
                          borderRadius={6}
                          key={playlist.id}
                          onClick={() =>
                            setValue(
                              "shareScratchWithRegularPlaylistId",
                              playlist.id,
                            )
                          }
                        >
                          <Text variant="body-1">{playlist.name}</Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </Skeleton>
          </FormControl>
          <Box boxSize={4} />
          <Text variant="body-4">공개 여부</Text>
          <FormControl>
            <Switch {...register("isPublic")} />
          </FormControl>

          <Box boxSize={4} />

          <HStack spacing={1}>
            <Box boxSize="6px" borderRadius={100} bg="blue.500" />
            <Text variant="body-4">주차</Text>
          </HStack>
          <FormControl isRequired>
            <Skeleton isLoaded={!isDataLoading}>
              <Menu isLazy {...register("week")}>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      size="md"
                      maxW="88px"
                      p={2}
                      rightIcon={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <SvgIcon
                          name={`icon/unfold_${isOpen ? "less" : "more"}`}
                          boxSize={6}
                          color="neutral.200"
                        />
                      }
                      variant="outline"
                      bg="white"
                      _active={{ bg: "white", border: "1px solid #1060FC" }}
                      border="1px solid #DBDEE7"
                    >
                      <Text variant="body-1">
                        {!watch("week") ? "1" : watch("week")}주차
                      </Text>
                    </MenuButton>
                    <MenuList
                      p={1}
                      border="none"
                      shadow="2xl"
                      minW={0}
                      maxH={44}
                      overflow="scroll"
                      sx={{
                        "&::-webkit-scrollbar-track": {
                          bg: "transparent",
                        },
                        "&::-webkit-scrollbar": {
                          height: "8px",
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bg: "blackAlpha.200",
                          borderRadius: "20px",
                        },
                      }}
                    >
                      {_.range(1, 21).map((weekNum) => (
                        <MenuItem
                          borderRadius={6}
                          key={weekNum}
                          onClick={() => setValue("week", weekNum)}
                          isDisabled={occupiedWeeks?.includes(weekNum)}
                        >
                          <Text variant="body-1">
                            {weekNum}
                            주차
                          </Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </Skeleton>
          </FormControl>

          <Box boxSize={4} />

          <Text variant="body-4">세부 설명</Text>
          <FormControl isRequired>
            <Textarea
              bg="white"
              maxW="772px"
              border="1px solid #DBDEE7"
              {...register("description")}
            />
          </FormControl>
        </Stack>

        <Box boxSize={8} />

        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          재생목록 추가
        </Button>
      </form>
    </>
  );
};
