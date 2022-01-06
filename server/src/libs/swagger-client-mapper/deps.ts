import SwaggerClient from 'swagger-client';
export { SwaggerClient };

import { readFile as fsReadFile, readdir as fsReaddir } from 'fs';
import { promisify } from 'util';

export const readFile = promisify(fsReadFile);
export const readdir = promisify(fsReaddir);
