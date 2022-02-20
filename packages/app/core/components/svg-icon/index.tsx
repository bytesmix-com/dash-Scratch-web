import {
  SvgIcon as BitSvgIcon,
  SvgIconProps,
} from "@dicolabs-kr/web.ui.base.svg-icon";
import _ from "lodash";
import React from "react";

const MediaURLMap = {
  icon: "01FTAMFWTZVBEHY3XT64YNNFNS",
};

const SvgIcon = ({ name, ...rest }: Partial<SvgIconProps>) => {
  const splittedName = name?.split("/");
  const folder = _.dropRight(splittedName);
  const fileName = _.last(splittedName);

  const folderHash = _.get(MediaURLMap, folder.join("."));
  const address = "https://media-cdn.branch.so";

  return (
    <BitSvgIcon
      path={`${address}/${folderHash}`}
      name={fileName ?? ""}
      {...rest}
    />
  );
};

export default SvgIcon;
