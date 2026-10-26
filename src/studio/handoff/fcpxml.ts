import type { SceneIR } from "../ir.js";

const time = (seconds: number, fps: number): string =>
  `${Math.max(0, Math.round(seconds * fps))}/${fps}s`;

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export type FcpxmlInput = {
  title: string;
  duration: number;
  fps: number;
  formatWidth: number;
  formatHeight: number;
  assetPath: string;
  scenes: SceneIR[];
};

/** A small FCPXML 1.9 interchange with one master clip and scene markers. */
export const buildFcpxml = (input: FcpxmlInput): string => {
  const markers = input.scenes
    .map(
      (scene) =>
        `            <marker start="${time(scene.start, input.fps)}" duration="${time(scene.duration, input.fps)}" value="${escapeXml(scene.headline)}"/>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormat1080p30" frameDuration="1/${input.fps}s" width="${input.formatWidth}" height="${input.formatHeight}"/>
    <asset id="r2" name="${escapeXml(input.title)}" start="0s" duration="${time(input.duration, input.fps)}" hasVideo="1" hasAudio="1" format="r1" src="${escapeXml(input.assetPath)}"/>
  </resources>
  <library>
    <event name="Stagecraft Studio">
      <project name="${escapeXml(input.title)}">
        <sequence format="r1" duration="${time(input.duration, input.fps)}" tcStart="0s" tcFormat="NDF" audioLayout="stereo" audioRate="48k">
          <spine>
            <asset-clip ref="r2" name="${escapeXml(input.title)}" offset="0s" duration="${time(input.duration, input.fps)}" start="0s" audioRole="dialogue">
${markers}
            </asset-clip>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;
};
