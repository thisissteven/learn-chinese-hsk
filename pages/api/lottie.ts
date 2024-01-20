import type { NextApiRequest, NextApiResponse } from "next";

export const runtime = "edge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  const response = await fetch(`https://d35aaqx5ub95lt.cloudfront.net/${id}.json`);
  const data = await response.json();

  res.status(200).json(data);
}
