/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import _ from "lodash";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface UseCheckAllProps<T> {
  formMethods: UseFormReturn<T>;
  checkAllName?: string;
  currentPageName?: string;
  sizeName?: string;
  checkNamePrefix?: string;
}

export function useCheckAll<T>({
  formMethods,
  checkAllName = "checkAll",
  currentPageName = "currentPage",
  checkNamePrefix = "check",
  sizeName = "size",
}: UseCheckAllProps<T>) {
  const { watch, setValue } = formMethods;

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // 전체 선택
      if (name === checkAllName && type === "change") {
        _.range(Number(value[sizeName])).forEach((num) =>
          setValue(`${checkNamePrefix}-${num}`, value[checkAllName]),
        );
      }

      // 페이지 변경 시 전체선택 해제
      if (name === currentPageName) {
        _.range(Number(value[sizeName])).forEach((num) => {
          // @ts-ignore
          setValue(`${checkNamePrefix}-${num}`, false);
          setValue(checkAllName, false);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
}
