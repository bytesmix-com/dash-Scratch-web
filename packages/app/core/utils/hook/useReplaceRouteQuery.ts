import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export const useReplaceRouteQuery = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const { pathname } = useLocation();

  return (queryParam: Record<string, unknown>) => {
    const param = { ...query, ...queryParam };
    Object.keys(queryParam)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .filter((key) => param[key] === null)
      .forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete param[key];
      });
    navigate(
      {
        pathname,
        search: `?${new URLSearchParams(param).toString()}`,
      },
      { replace: true },
    );
  };
};
