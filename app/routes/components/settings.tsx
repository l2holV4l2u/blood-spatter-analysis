import { useContext, useEffect, useState } from "react";
import { AppContext } from "../functions/context";
import Selector from "./selector";
import Tickbox from "./tickbox";

export default function Settings() {
  const { settings, setSettings, bloodProperties } = useContext(AppContext);
  const [showTrajectory, setShowTrajectory] = useState(settings.showTrajectory);
  const [showSP, setShowSP] = useState(settings.showSP);
  const [showAOC, setShowAOC] = useState(settings.showAOC);
  const [motion, setMotion] = useState(settings.motion);
  const [material, setMaterial] = useState(settings.material);
  const [planeSize, setPlaneSize] = useState("20");

  useEffect(() => {
    setSettings({
      showTrajectory,
      showSP,
      showAOC,
      motion,
      material,
      planeSize: Number(planeSize),
    });
  }, [showTrajectory, showSP, showAOC, motion, material, planeSize]);

  useEffect(() => {
    let maxSize = 20;
    bloodProperties.forEach((prop) => {
      maxSize = Math.max(maxSize, prop.x, -prop.y);
    });
    setPlaneSize(String(Math.ceil(maxSize / 10) * 10));
  }, [bloodProperties]);

  return (
    <div className="w-full flex rounded-lg justify-between items-center border-2 border-border p-4">
      <Tickbox
        title="Show Blood Motion"
        data={showTrajectory}
        setData={setShowTrajectory}
      />
      <Tickbox title="Show Blood Path" data={showSP} setData={setShowSP} />
      <Tickbox title="Show AOC" data={showAOC} setData={setShowAOC} />
      <Selector
        title="AOI Material"
        choices={["Paper", "Glass", "Wood", "Smooth Tile", "Rough Tile"]}
        selectedChoice={material}
        setSelectedChoice={setMaterial}
      />
    </div>
  );
}
