import { useState } from "react";

import { LayoutApp } from "./components/LayoutApp/LayoutApp";
import { LayoutPanels } from "./components/LayoutPanels/LayoutPanels";
import { Map } from "./components/Map/Map";
import { useInitializeMap } from "./components/Map/useInitializeMap";

function App() {
  const [isLeftPanelOpenOverride, setIsLeftPanelOpenOverride] = useState(true);
  const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);

  const customHandleLeftPanelToggle = () => {
    setIsLeftPanelOpenOverride((previous) => !previous);
  };

  const { mapContainer } = useInitializeMap({
    center: [-122.4194, 37.7749],

    zoom: 10,
  });

  return (
    <LayoutApp
      headerContent={<>header (out of scope )</>}
      footerContent={<>footer (out of scope)</>}
    >
      <LayoutPanels
        leftPanelContent={
          <>
            Optional left Panel
            <br />
            <button onClick={() => setIsSubpanelOpen(!isSubpanelOpen)}>
              toggle subpanel
            </button>
            <br />
            <br />
            <br />
            <br />
            <br />
            <button onClick={customHandleLeftPanelToggle}>
              toggle left panel with custom function from parent component
            </button>
            <br />
            <br />
            (Map-related components are out of scope for this demo)
          </>
        }
        subpanelContent={<>optional subpanel contents</>}
        rightPanelContent={<>Optional right panel</>}
        bottomPanel={<>{<>Optional bottom panel</>}</>}
        setIsLeftPanelOpen={customHandleLeftPanelToggle}
        isLeftPanelOpen={isLeftPanelOpenOverride}
        isLeftPanelResizable={true}
        isRightPanelResizable={true}
        isBottomPanelResizable={true}
        isBottomPanelOpen={isBottomPanelOpen}
        setIsBottomPanelOpen={setIsBottomPanelOpen}
        isSubpanelOpen={isSubpanelOpen}
        setIsSubpanelOpen={setIsSubpanelOpen}
      >
        <Map mapContainer={mapContainer} />
      </LayoutPanels>
    </LayoutApp>
  );
}

export default App;
