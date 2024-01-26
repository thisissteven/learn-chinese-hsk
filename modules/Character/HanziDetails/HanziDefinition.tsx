import { HanziApiResponse } from "../types";

export function HanziDefinition({ entry }: { entry: HanziApiResponse["definition"]["entries"][number] }) {
  return (
    <ul className="relative ml-8">
      {entry.definitions.map((definition, index) => {
        return (
          <li key={index} className="list-disc">
            {definition}
          </li>
        );
      })}
    </ul>
  );
}
