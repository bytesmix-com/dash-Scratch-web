import { Badge, Text } from "@chakra-ui/react";
import React from "react";

interface PcBadgeProps {
  color: string;
  bg: string;
  text: string;
}
export const PcBadge = ({ color, bg, text }: PcBadgeProps) => (
  <Badge
    borderRadius={20}
    h="21px"
    py="3px"
    px="7px"
    bg={bg}
    color={color}
    border={`1px solid ${color}`}
  >
    <Text variant="body-4">{text}</Text>
  </Badge>
);

interface ProcessBadgeProps {
  process: number;
}

export const ProcessBadge = ({ process }: ProcessBadgeProps) => {
  if (process === undefined) {
    return <PcBadge color="#6E778C" bg="#F4F6FA" text="학습 예정" />;
  }
  if (process === 0) {
    return <PcBadge color="#6E778C" bg="#F4F6FA" text="학습 전" />;
  }
  if (process >= 90) {
    return <PcBadge color="#00D193" bg="#E2FFF6" text="학습 완료" />;
  }
  return <PcBadge color="#FFC700" bg="#FFF7DD" text="학습 중" />;
};
