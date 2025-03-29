import type {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
  TaskHandler,
} from '@teambit/builder';
import type { EnvContext } from '@teambit/envs';
import type { Logger } from '@teambit/logger';
import path from 'path';
import fs from 'fs';

export type UmdBuildTaskV2TaskOptions = {
  name?: string;
};

export class UmdBuildTaskV2Task implements BuildTask {
  constructor(readonly aspectId: string, readonly logger: Logger) {}

  readonly name = 'UmdBuildTaskV2';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const componentsResults: ComponentResult[] = [];

    /**
     * the 'seeder capsules' are capsules for components that are built for their own sake -
     * they are not only dependencies, built for the sake of other components
     */
    const capsules = context.capsuleNetwork.seedersCapsules;

    capsules.forEach((capsule) => {
      /** each 'capsule' contains information about the component and its capsule */
      const umdBuildTaskV2 = capsule.component.id.name;
      const capsuleDir = capsule.path;

      const errors: Error[] = [];

      try {
        /* generate an artifact inside the capsule's directory */
        fs.writeFileSync(
          path.join(capsuleDir, 'output.my-artifact.txt'),
          `The component name is ${umdBuildTaskV2}`
        );
      } catch (err: any) {
        errors.push(err);
      }
      componentsResults.push({ component: capsule.component, errors });
    });

    return {
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          /* the glob pattern for artifacts to include in the component snap */
          globPatterns: ['**/*.my-artifact.txt'],
        },
      ],
      /**
       * report back which components were processed,
       * as well as any additional data regarding the execution of this build task
       */
      componentsResults,
    };
  }

  static from(options: UmdBuildTaskV2TaskOptions): TaskHandler {
    /**
     * the task name is used to identify the task in the pipeline
     * it can also be used to replace the task or remove it from the pipeline
     *
     */
    const name = options.name || this.name;
    const handler = (context: EnvContext) => {
      /* the env that registered this task */
      const envId = context.envId.toString();
      /* use the logger aspect */
      const logger = context.createLogger(`${envId}:${this.name}`);
      return new UmdBuildTaskV2Task(envId, logger);
    };
    return { name, handler };
  }
}
