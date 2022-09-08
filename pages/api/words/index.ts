// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fsPromises from "fs/promises";
import path from "path";
import getWords from "../../../util/static/getWords";

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | Error>
) {
  try {
    console.log("making sentence");
    const filePath = path.join(process.cwd(), "/util/static/words.json");
    const wordsArray = await fsPromises.readFile(filePath, "utf-8");

    const amount = parseInt(req.query.amount as string);
    const sentence = getWords(JSON.parse(wordsArray).words, amount);

    res.status(200).json(sentence);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error: " + err });
  }
}
