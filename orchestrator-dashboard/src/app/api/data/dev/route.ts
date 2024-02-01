import { promises as fs } from "fs";
import { parse, stringify } from "yaml";
import { given } from "flooent";
import { NextResponse } from "next/server";

interface RawCompose {
  label: string;
  container_name: string;
  build: string;
  image?: string;
  depends_on?: string[];
  ports?: string[];
}

export interface ComposeService {
  label: string;
  id: string;
  build: string;
  depends_on?: string[];
  ports?: string[];
}

const getData = async (): Promise<NextResponse<DevResponse>> => {
  const file = await fs.readFile(process.cwd() + "/../dev/docker-compose.yml");
  const yml = parse(file.toString());

  const services: ComposeService[] = given
    .map<string, RawCompose>(yml.services)
    .entries()
    .map(([key, entry]) => {
      return {
        label: key,
        id: entry.container_name,
        build: entry.build,
        depends_on: entry.depends_on || [],
        ports: entry.ports || [],
      };
    });

  return NextResponse.json({ services: services });
};

export const GET = getData;
export type DevResponse = { services: ComposeService[] };
