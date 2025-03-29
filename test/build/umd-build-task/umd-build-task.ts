import type {AppBuildContext, AppBuildResult} from '@teambit/application';
import {build as esBuild} from 'esbuild';
import {join} from 'path';

export async function build (context: AppBuildContext): Promise<AppBuildResult> {
  const rootPath = context.capsule.path;
  const outputDir = join(rootPath, 'build');

  const result = await esBuild({
    entryPoints: [rootPath],
    bundle: true,
    platform: 'node',
    outfile: outputDir,
  });

  return {
    errors: result.errors.map((error) => {
      return new Error(error.detail);
    }),
    artifacts: [
      {
        name: this.artifactName,
        globPatterns: [outputDir],
      },
    ],
  };
}

export function runUmdBuildTask () {
  console.log('Hello Bit app!');
}
