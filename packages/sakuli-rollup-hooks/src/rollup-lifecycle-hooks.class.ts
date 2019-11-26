import {Project, TestExecutionContext, TestExecutionLifecycleHooks, TestFile} from "@sakuli/core";
import {Plugin, rollup} from "rollup";
import rollupTsPlugin from 'rollup-plugin-typescript2';
import {extname, isAbsolute, join} from "path";
import { Maybe, SimpleLogger, ifPresent } from "@sakuli/commons";
import { defaultTsConfig } from "./ts-support/default-ts-config.const";

export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

    logger: Maybe<SimpleLogger>;

    debug(msg: string, data?: any) {
        ifPresent(this.logger, logger => logger.debug(msg, data))
    }

    async onProject?(project: Project, testExecutionContext: TestExecutionContext): Promise<void> {
        this.logger = testExecutionContext.logger;
    }

    async readFileContent(file: TestFile, project: Project): Promise<string> {
        const filePath = isAbsolute(project.rootDir)
            ? join(project.rootDir, file.path)
            : join(process.cwd(), project.rootDir, file.path);

        const plugins: Plugin[] = [];
        const extName = extname(filePath);
        if(extName === '.ts' || extName === '.tsx') {
            // THe provided files to TS-Config if not provided the plugin will look for tsconfig.json
            const tsconfig: Maybe<string> = project.get('tsconfig');

            plugins.push(rollupTsPlugin(<any>{
                defaultTsConfig,
                ...(tsconfig ? {tsconfig} : {}),
                tsconfigOverride: {
                    compilerOptions: {
                        module: 'ESNext',
                        target: 'ES2017'
                    },
                },
                clean: true,
            }));
        }

        const bundle = await rollup({
            input: filePath,
            onwarn:  message => {
                this.debug(`[BUNDLER WARNING] ${message}`)
            },
            plugins
        });

        const {output} = await bundle.generate({
            format: 'commonjs',
            sourcemap: true,
            file: 'bundle-rollup.js',
        });
        const [rollupOutput] = output;
        //this.debug(`Bundled testcase file ${filePath} to: `, rollupOutput.code);
        return Promise.resolve(rollupOutput.code);
    }

    async requestContext(testExecutionContext: TestExecutionContext, project: Project): Promise<Record<string, any>> {
       return ({require});
    }

}
