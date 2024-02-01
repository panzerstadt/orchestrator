import { promises as fs } from "fs";
import { parse, stringify } from "yaml";
import { given } from "flooent";
import { NextResponse } from "next/server";

export interface ComposeService {
  label: string;
  build: string;
  depends_on?: string[];
  ports?: string[];
}

const getData = async (): Promise<NextResponse<DevResponse>> => {
  const file = await fs.readFile(process.cwd() + "/../dev/docker-compose.yml");
  const yml = parse(file.toString());

  const services: ComposeService[] = given
    .map<string, ComposeService>(yml.services)
    .entries()
    .map(([key, entry]) => {
      return {
        label: key,
        build: entry.build,
        depends_on: entry.depends_on || [],
        ports: entry.ports || [],
      };
    });

  return NextResponse.json({ services: services });
};

export const GET = getData;
export type DevResponse = { services: ComposeService[] };
