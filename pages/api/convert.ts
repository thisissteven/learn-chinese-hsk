import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { ChineseCharacter, Level } from "@/data";

const getFilePath = (level: Level) => `/data/hsk-level-${level}.json`;

export const runtime = "edge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const map: Record<string, string> = {};

  const promises = Array(6)
    .fill(null)
    .map(async (_, i) => {
      const level = (i + 1) as Level;
      const file = await fs.readFile(process.cwd() + getFilePath(level), "utf8");
      const characters = JSON.parse(file);
      characters.forEach((character: ChineseCharacter) => {
        map[character.id] = character.hanzi;
        map[character.hanzi] = character.id.toString();
      });
    });

  await Promise.all(promises);

  await fs.writeFile(process.cwd() + "/data/id-hanzi-map.json", JSON.stringify(map));

  res.status(200).json(map);
}
