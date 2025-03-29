/**
* this env extends react-env version 1.0.129.
* to inspect its config @see https://bit.cloud/teambit/react/react-env?version=1.0.129
* */
import {ReactEnv} from '@teambit/react.react-env';
import {Compiler} from '@teambit/compiler';
import {ReactPreview} from '@teambit/preview.react-preview';
import {EnvHandler} from '@teambit/envs';
import {Pipeline} from '@teambit/builder';
import {
  TypescriptCompiler,
  resolveTypes,
  TypescriptTask,
  TypescriptConfigWriter
} from '@teambit/typescript.typescript-compiler';
import {ESLintLinter, EslintTask, EslintConfigWriter} from '@teambit/defender.eslint-linter';
import {JestTester, JestTask} from '@teambit/defender.jest-tester';
import {PrettierFormatter, PrettierConfigWriter} from '@teambit/defender.prettier-formatter';
import {Tester} from '@teambit/tester';
import {Preview} from '@teambit/preview';
import {ConfigWriterList} from '@teambit/workspace-config-files';
// import {UmdBuildTaskV2Task} from '@study-demo/test.build.umd-build-task-v2';
import { PackageGenerator } from '@teambit/pkg';
import typescript from 'typescript';
import { BabelCompiler, BabelTask } from '@teambit/compilation.babel-compiler';
import hostDependencies from './preview/host-dependencies';
// import { webpackTransformer } from './config/webpack.config';

export class WebpackReactEnv extends ReactEnv {

  /* a shorthand name for the env */
  name = 'webpack-react-env';

  protected tsconfigPath = require.resolve('./config/tsconfig.json');

  protected babelConfigPath = require.resolve('./config/babel.config.json');

  protected tsTypesPath = './types';

  // protected jestConfigPath = require.resolve('./config/jest.config');

  // protected eslintConfigPath = require.resolve('./config/eslintrc.js');

  protected eslintExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

  // protected prettierConfigPath = require.resolve('./config/prettier.config.js');

  protected prettierExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.mjs',
    '.cjs',
    '.json',
    '.css',
    '.scss',
    '.md',
    '.mdx',
    '.html',
    '.yml',
    '.yaml',
  ];

  // protected previewMounter = require.resolve('./preview/mounter');

  // packageJson = {
  //   main: 'dist/esm/{main}.js',
  //   exports: {
  //     require: './dist/cjs/index.js',
  //     import: './dist/esm/index.js',
  //   },
  //   types: '{main}.ts',
  //   type: 'module',
  // };

  /* the compiler to use during development */
  compiler (): EnvHandler<Compiler> {
    /**
     * @see https://bit.dev/reference/typescript/using-typescript
     * */
    // return TypescriptCompiler.from({
    //   tsconfig: this.tsconfigPath,
    //   types: resolveTypes(__dirname, [this.tsTypesPath]),
    // });
    return BabelCompiler.from({
      babelConfig: this.babelConfigPath,
    });
  }

  /* the test runner to use during development */
  // tester (): EnvHandler<Tester> {
  //   /**
  //    * @see https://bit.dev/reference/jest/using-jest
  //    * */
  //   return JestTester.from({
  //     config: this.jestConfigPath,
  //   });
  // }

  /* the linter to use during development */
  // linter () {
  //   /**
  //    * @see https://bit.dev/reference/eslint/using-eslint
  //    * */
  //   return ESLintLinter.from({
  //     tsconfig: this.tsconfigPath,
  //     configPath: this.eslintConfigPath,
  //     pluginsPath: __dirname,
  //     extensions: this.eslintExtensions,
  //   });
  // }

  /**
   * the formatter to use during development
   * (source files are not formatted as part of the components' build)
   * */
  // formatter () {
  //   /**
  //    * @see https://bit.dev/reference/prettier/using-prettier
  //    * */
  //   return PrettierFormatter.from({
  //     configPath: this.prettierConfigPath,
  //   });
  // }

  /**
   * generates the component previews during development and during build
   */
  // preview (): EnvHandler<Preview> {
  //   /**
  //    * @see https://bit.dev/docs/react-env/component-previews
  //    */
  //   return ReactPreview.from({
  //     mounter: this.previewMounter,
  //     hostDependencies,
  //     // transformers: [webpackTransformer],
  //   });
  // }

  /**
   * a set of processes to be performed before a component is snapped, during its build phase
   * @see https://bit.dev/docs/react-env/build-pipelines
   */
  build () {
    return Pipeline.from([
      BabelTask.from({
        babelConfig: this.babelConfigPath,
      }),
      // TypescriptTask.from({
      //   tsconfig: this.tsconfigPath,
      //   types: resolveTypes(__dirname, [this.tsTypesPath]),
      // }),
      // UmdBuildTaskV2Task.from({
      //   name: 'test-111',
      // }),
      // TypescriptTask.from({
      //   tsconfig: this.modernTsconfigPath,
      //   // types: resolveTypes(__dirname, [this.tsTypesPath]),
      //   typescript,
      //   name: 'modernTsconfigPath',
      // }),
      // TypescriptTask.from({
      //   tsconfig: this.legacyTsconfigPath,
      //   typescript,
      //   name: 'legacyTsconfigPath',
      // }),
      // EslintTask.from({
      //   tsconfig: this.tsconfigPath,
      //   configPath: this.eslintConfigPath,
      //   pluginsPath: __dirname,
      //   extensions: this.eslintExtensions,
      // }),
      // JestTask.from({
      //   config: this.jestConfigPath,
      // }),
    ]);
  }

  // package() {
  //   return PackageGenerator.from({
  //     packageJson: this.packageJson,
  //     // ...
  //   });
  // }

  workspaceConfig (): ConfigWriterList {
    return ConfigWriterList.from([
      TypescriptConfigWriter.from({
        tsconfig: this.tsconfigPath,
        types: resolveTypes(__dirname, [this.tsTypesPath]),
      }),
      // EslintConfigWriter.from({
      //   configPath: this.eslintConfigPath,
      //   tsconfig: this.tsconfigPath
      // }),
      // PrettierConfigWriter.from({
      //   configPath: this.prettierConfigPath
      // })
    ]);
  }
}

export default new WebpackReactEnv();
