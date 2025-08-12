import { type ReactNode, useEffect } from "react";

import { ButtonXTopRight } from "../defaultPanelToggleButtons/ButtonXTopRight";

import panelContentsWrapperStyles from "./PanelContentsWrapperWithOptionalSubpanel.module.scss";

export const PanelContentsWrapperWithOptionalSubpanel = ({
  isLeftPanelOpen,
  isSubpanelOpen = false,
  mainPanelContent,
  setIsSubpanelOpen = () => {},
  subpanelClassName = undefined,
  subpanelContent,
}: {
  isLeftPanelOpen: boolean;
  isSubpanelOpen?: boolean;
  mainPanelContent: ReactNode;
  setIsSubpanelOpen?: (arg: boolean) => unknown;
  subpanelClassName?: string;
  subpanelContent: ReactNode;
}) => {
  const closeSubpanel = () => {
    setIsSubpanelOpen(false);
  };

  useEffect(
    function closeSubpanelWhenParentPanelCloses() {
      if (!isLeftPanelOpen) {
        setIsSubpanelOpen(false);
      }
    },
    [isLeftPanelOpen, setIsSubpanelOpen]
  );

  const widthStylesOverride = !isSubpanelOpen
    ? { transform: "none" }
    : undefined;

  return (
    <div className={panelContentsWrapperStyles.subpanelPositionedParent}>
      {isSubpanelOpen ? (
        <div
          className={`${panelContentsWrapperStyles.subpanelWrapper} ${subpanelClassName ?? ""}`}
          style={widthStylesOverride}
        >
          <ButtonXTopRight
            onClick={closeSubpanel}
            aria-label="Close sub panel"
          />
          {subpanelContent}
        </div>
      ) : null}

      {mainPanelContent}
    </div>
  );
};
