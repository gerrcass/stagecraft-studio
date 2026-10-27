import type { SceneIR } from "../ir.js";

export const buildMarkersCsv = (scenes: SceneIR[]): string => {
  const rows = scenes.map((scene) => {
    const label = scene.headline.replaceAll('"', '""');
    return `${scene.id},"${label}",${scene.start.toFixed(3)},${(scene.start + scene.duration).toFixed(3)},${scene.duration.toFixed(3)},${scene.archetype}`;
  });
  return ["id,label,start,end,duration,archetype", ...rows].join("\n") + "\n";
};
