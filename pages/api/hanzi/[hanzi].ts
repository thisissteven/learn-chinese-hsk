import type { NextRequest } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const hanzi = url.searchParams.get("hanzi") as string;

  const response = await fetch(`https://www.chinesepod.com/api/v1/dictionary/get-details?word=${encodeURI(hanzi)}`);
  const data = await response.json();

  const details = {
    definition: data.definition,
    audioUrl: data.audioUrl,
    related: data.related,
    idioms: data.idioms,
    lessons: data.lessons,
  };

  return Response.json(details, {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=31536000",
    },
  });
}
