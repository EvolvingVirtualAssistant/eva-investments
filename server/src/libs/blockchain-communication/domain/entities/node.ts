// URL | API_KEY | DATE | ACCESSES (Number of writes, reads, ...) | SPEED (overall time, time per specific call)

import { NodeOptions } from './nodeOptions';

export interface Node {
  id: number;
  url: string;
  apiKey?: string;

  options: NodeOptions[];
}
