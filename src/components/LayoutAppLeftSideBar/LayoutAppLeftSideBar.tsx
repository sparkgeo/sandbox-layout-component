import { type ReactNode } from "react";

import layoutStyles from "./LayoutAppLeftSideBar.module.scss";

export const LayoutAppLeftSideBar = ({
  children,
  leftBarBottomItems = [],
  leftBarTopItems = [],
}: {
  children: ReactNode;
  leftBarBottomItems: ReactNode;
  leftBarTopItems: ReactNode;
}) => {
  return (
    <div className={layoutStyles.layoutWrapper}>
      <div className={layoutStyles.leftBar}>
        <div className={layoutStyles.leftBarSection}>{leftBarTopItems}</div>
        <div className={layoutStyles.leftBarSection}>{leftBarBottomItems}</div>
      </div>
      <main className={layoutStyles.mainContent}>{children}</main>
    </div>
  );
};
