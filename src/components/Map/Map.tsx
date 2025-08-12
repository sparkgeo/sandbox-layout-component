import mapStyles from "./Map.module.css";

export const Map = ({
  mapContainer,
}: {
  mapContainer: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className={mapStyles.mapWrapper}>
      <div ref={mapContainer} className={mapStyles.map} />
    </div>
  );
};
