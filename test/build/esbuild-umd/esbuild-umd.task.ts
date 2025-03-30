import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
  TaskHandler,
} from '@teambit/builder';
import {join} from 'path';
import type { Logger } from '@teambit/logger';
import {BuildOptions, build as esBuild} from 'esbuild';
import {umdWrapper} from 'esbuild-plugin-umd-wrapper';
import {EnvContext} from '@teambit/envs';

export interface EsbuildUmdOptions extends BuildOptions {
  globals?: Exclude<Parameters<typeof umdWrapper>[0], undefined>['globals'];
  libraryName: Exclude<Parameters<typeof umdWrapper>[0], undefined>['libraryName'];
};


export class EsbuildUmd implements BuildTask {
  constructor(readonly aspectId: string, readonly logger: Logger, readonly options: EsbuildUmdOptions) {}

  readonly name = 'EsbuildUmd';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    // 准备组件结果数组，该数组将用于报告已处理的组件以及有关此构建任务执行的任何其他数据
    const componentsResults: ComponentResult[] = [];
    // “种子胶囊” 是为自己而构建的组件的胶囊-而不是为了将它们作为其依赖项的其他组件
    const capsules = context.capsuleNetwork.seedersCapsules;
    const {globals, external, libraryName, ...esbuildConfig} = this.options;

    // demo
    // eslint-disable-next-line no-lone-blocks
    {
      // capsules.forEach((capsule) => {
      //   // 准备一个 “错误” 数组，以在执行过程中报告任何错误 (这将是 “组件结果” 数据的一部分)
      //   const errors: Error[] = [];
      //   // 每个 “胶囊” 提供有关组件以及胶囊本身的数据
      //   const componentName = capsule.component.id.name;
      //   const capsuleDir = capsule.path;

      //   const artifactContent = `The component name is ${componentName}`

      //   try {
      //     // Generate the artifact inside the capsule's directory
      //     fs.writeFileSync(
      //       path.join(capsuleDir, 'output.my-artifact.txt'),
      //       artifactContent
      //     );
      //   } catch (err: any) {
      //     errors.push(err);
      //   }
      //   componentsResults.push({ component: capsule.component, errors });
      // });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const capsule of capsules) {
      const entryPath = capsule.path;
      const outputPath = join(capsule.path, 'dist', 'index.umd.js');

      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await esBuild({
          bundle: true,
          minify: true,
          platform: 'browser',
          format: 'umd' as 'iife',
          plugins: [umdWrapper({
            libraryName,
            external,
            globals,
          })],
          ...esbuildConfig,
          external,
          entryPoints: [entryPath],
          outfile: outputPath,
          // outfile: 'index.umd.js',
          // outdir: 'dist',
          // globalName: 'lib',
          // target: ['es2015'],
          // footer: {
          //   js: '})(window.React, window.ReactDOM, window.antd);' // 手动传递依赖
          // },
        });

        componentsResults.push({
          component: capsule.component,
          errors: result.errors.map((error) => {
            return new Error(error.detail);
          }),
        })
      }
      catch (error: any) {
        componentsResults.push({
          component: capsule.component,
          errors: [error],
        })
      }
    }

    return {
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          // 要包含在组件版本中的工件的glob模式
          globPatterns: ['**/*.umd.js'],
        },
      ],
      componentsResults,
    };
  }

  static from(options: EsbuildUmdOptions): TaskHandler {
    return {
      name: 'UmdBuildTaskV2',
      handler: (context: EnvContext) => {
        const logger = context.createLogger(`UmdBuildTaskV2`);
        return new EsbuildUmd(context.envId.toString(), logger, options);
      },
    };
  }
}