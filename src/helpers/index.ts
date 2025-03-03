import { PathMethods } from "@/types/apiDefinition";

export interface PathEntry {
    path: string;
    method: string
  }
  
export const transformPaths = (paths: Record<string, Record<string, unknown>>): PathEntry[] => {
    return Object.entries(paths).flatMap(([path, methodsObj]) =>
      Object.keys(methodsObj).map((method) => ({
        method: method.toUpperCase(),
        path
      }))
    );
  };
  

