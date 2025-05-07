import {
  cloneElement,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import layoutPanelStyles from "./LayoutPanels.module.scss";
import { dragToResizePanelWidth } from "../../library/dom/dragToResizePanelWidth";
import { PanelContentsWithSubpanel } from "../../PanelContentsWithSubpanel/PanelContentsWithSubpanel";

export interface LayoutPanelsProps {
  subpanelClassName?: string;
  subpanelContent?: ReactNode;
  children: ReactNode;
  isLeftPanelOpen?: boolean;
  isLeftPanelResizable?: boolean;
  isLeftPanelToggleable?: boolean;
  isSubpanelOpen?: boolean;
  isRightPanelOpen?: boolean;
  isRightPanelResizable?: boolean;
  isRightPanelToggleable?: boolean;
  leftPanelClassName?: string;
  leftPanelContent?: ReactNode;
  leftPanelToggleButton?: ReactElement;
  rightPanelClassName?: string;
  rightPanelContent?: ReactNode;
  rightPanelToggleButton?: ReactElement;
  setIsLeftPanelOpen?: Dispatch<SetStateAction<boolean>>;
  setIsSubpanelOpen?: Dispatch<SetStateAction<boolean>>;
  setIsRightPanelOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPanels = ({
  rightPanelClassName = undefined,
  subpanelClassName = undefined,
  children,
  isLeftPanelOpen = undefined,
  isLeftPanelResizable = false,
  isLeftPanelToggleable = true,
  isSubpanelOpen = undefined,
  isRightPanelOpen = undefined,
  isRightPanelResizable = false,
  isRightPanelToggleable = true,
  leftPanelClassName = undefined,
  leftPanelContent = undefined,
  leftPanelToggleButton = undefined,
  rightPanelContent = undefined,
  rightPanelToggleButton = undefined,
  setIsLeftPanelOpen = undefined,
  setIsSubpanelOpen = undefined,
  setIsRightPanelOpen = undefined,
  subpanelContent = undefined,
}: LayoutPanelsProps) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  if (subpanelContent && (!setIsSubpanelOpen || isSubpanelOpen === undefined)) {
    throw new Error(
      "subpanelContent prop was provided, but setIsSubpanelOpen and isSubpanelOpen were not provided. This is required to control the subpanel's open state. isSubpanelOpen must be initialized to a boolean value",
    );
  }
  const [isLeftPanelOpenInternal, setIsLeftPanelOpenInternal] = useState(true);

  const [isRightPanelOpenInternal, setIsRightPanelOpenInternal] =
    useState(true);
  const [leftPanelResizableWidth, setLeftPanelResizableWidth] =
    useState<string>();
  const [rightPanelResizableWidth, setRightPanelResizableWidth] =
    useState<string>();

  const isLeftPanelOpenToUse = isLeftPanelOpen ?? isLeftPanelOpenInternal;
  const isRightPanelOpenToUse = isRightPanelOpen ?? isRightPanelOpenInternal;
  const [isLeftPanelContentShowing, setIsLeftPanelContentShowing] =
    useState(isLeftPanelOpenToUse);
  const [isRightPanelContentShowing, setIsRightPanelContentShowing] = useState(
    isRightPanelOpenToUse,
  );
  const setIsLeftPanelOpenToUse =
    setIsLeftPanelOpen ?? setIsLeftPanelOpenInternal;
  const setIsRightPanelOpenToUse =
    setIsRightPanelOpen ?? setIsRightPanelOpenInternal;
  const leftPanelDynamicStyles = useMemo(() => {
    return leftPanelResizableWidth
      ? {
          width: leftPanelResizableWidth,
          marginLeft: isLeftPanelOpenToUse
            ? "0px"
            : `-${leftPanelResizableWidth}`,
        }
      : undefined;
  }, [isLeftPanelOpenToUse, leftPanelResizableWidth]);
  const rightPanelDynamicStyles = {
    width: rightPanelResizableWidth,
    marginRight: isRightPanelOpenToUse ? "0px" : `-${rightPanelResizableWidth}`,
  };

  useEffect(function initializeResizableWidths() {
    setLeftPanelResizableWidth(`${leftPanelRef.current?.offsetWidth}px`);
    setRightPanelResizableWidth(`${rightPanelRef.current?.offsetWidth}px`);
  }, []);

  const dragToResizeLeftPanel = (
    event: React.MouseEvent | React.TouchEvent,
  ) => {
    dragToResizePanelWidth({
      event,
      divRef: leftPanelRef,
      onMoveEnd: setLeftPanelResizableWidth,
      closePanel: () => {
        setIsLeftPanelOpenToUse(false);
      },
    });
  };

  const dragToResizeRightPanel = (
    event: React.MouseEvent | React.TouchEvent,
  ) => {
    dragToResizePanelWidth({
      event,
      divRef: rightPanelRef,
      onMoveEnd: setRightPanelResizableWidth,
      isLeftEdgeResizeTarget: true,
      closePanel: () => {
        setIsRightPanelOpenToUse(false);
      },
    });
  };
  const handleLeftPanelTransitionEnd = () => {
    if (!isLeftPanelOpenToUse) {
      setIsLeftPanelContentShowing(false); // in addition to moving panels over, we hide content to assistive technology, tabbing
    }
  };
  const handleRightPanelTransitionEnd = () => {
    if (!isRightPanelOpenToUse) {
      setIsRightPanelContentShowing(false); // in addition to moving panels over, we hide content to assistive technology, tabbing
    }
  };

  useEffect(
    function syncContentVisibilityToPanelVisibility() {
      // Ensure panel content is visible to assistive technology and tabbing before the panels are shown
      // We only sync when panels are showing. The transition end handler functions are responsible
      // for hiding content when panels are closed (we don't hide content before the transition ends as that would be jarring).
      if (isLeftPanelOpenToUse) {
        setIsLeftPanelContentShowing(true);
      }
      if (isRightPanelOpenToUse) {
        setIsRightPanelContentShowing(true);
      }
    },
    [isLeftPanelOpenToUse, isRightPanelOpenToUse],
  );
  const handleRightToggleButtonClick = () => {
    setIsRightPanelOpenToUse((previous) => !previous);
  };
  const handleLeftToggleButtonClick = () => {
    setIsLeftPanelOpenToUse((previous) => !previous);
  };
  const internalRightPanelCloseButton = (
    <button
      className={layoutPanelStyles.panelCloseButton}
      onClick={handleRightToggleButtonClick}
      aria-label="Toggle right panel"
    >
      {isRightPanelOpenToUse ? ">" : "<"}
    </button>
  );
  const internalLeftPanelCloseButton = (
    <button
      className={layoutPanelStyles.panelCloseButton}
      onClick={handleLeftToggleButtonClick}
      aria-label="Toggle left panel"
    >
      {isLeftPanelOpenToUse ? "<" : ">"}
    </button>
  );
  const rightPanelButtonToUse = rightPanelToggleButton
    ? cloneElement(rightPanelToggleButton, {
        onClick: handleRightToggleButtonClick,
        "aria-label": "Toggle right panel",
      })
    : internalRightPanelCloseButton;

  const leftPanelButtonToUse = leftPanelToggleButton
    ? cloneElement(leftPanelToggleButton, {
        onClick: handleLeftToggleButtonClick,
        "aria-label": "Toggle left panel",
      })
    : internalLeftPanelCloseButton;

  const configuredLeftPanel = (
    <div
      className={`${layoutPanelStyles.panel} ${leftPanelClassName ?? ""}`}
      style={leftPanelDynamicStyles}
      ref={leftPanelRef}
      onTransitionEnd={handleLeftPanelTransitionEnd}
      data-testid="leftPanel"
    >
      {isLeftPanelToggleable ? (
        <div className={layoutPanelStyles.leftPanelCloseTab}>
          {leftPanelButtonToUse}
        </div>
      ) : null}
      {
        // we hide panel contents in addition animating margins explicitly to ensure they arent visible to
        // assistive technology, or tabbing. This also makes hiding and showing panels testable.
        isLeftPanelContentShowing ? (
          <PanelContentsWithSubpanel
            isSubpanelOpen={isSubpanelOpen}
            setIsSubpanelOpen={setIsSubpanelOpen}
            subpanelContent={subpanelContent}
            mainPanelContent={leftPanelContent}
            isLeftPanelOpen={isLeftPanelOpenToUse}
            subpanelClassName={subpanelClassName}
          />
        ) : null
      }
      {isLeftPanelResizable ? (
        <button
          className={layoutPanelStyles.leftPanelResizerTarget}
          onMouseDown={dragToResizeLeftPanel}
          onTouchStart={dragToResizeLeftPanel}
        />
      ) : null}
    </div>
  );

  return (
    <div className={layoutPanelStyles.layoutPanelsWrapper}>
      {leftPanelContent ? configuredLeftPanel : null}
      <div className={layoutPanelStyles.centerSection}>{children}</div>

      {rightPanelContent ? (
        <div
          className={`${layoutPanelStyles.panel} ${rightPanelClassName ?? ""}`}
          style={rightPanelDynamicStyles}
          ref={rightPanelRef}
          onTransitionEnd={handleRightPanelTransitionEnd}
          data-testid="rightPanel"
        >
          {isRightPanelToggleable ? (
            <div className={layoutPanelStyles.rightPanelCloseTab}>
              {rightPanelButtonToUse}
            </div>
          ) : null}
          {isRightPanelContentShowing ? rightPanelContent : null}
          {isRightPanelResizable ? (
            <button
              className={layoutPanelStyles.rightPanelResizerTarget}
              onMouseDown={dragToResizeRightPanel}
              onTouchStart={dragToResizeRightPanel}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
