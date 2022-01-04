// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthHandler, AuthKind, DefaultRunnerFactory, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    let pac;
    try {
        core.startGroup('reset-environment:');
        const envUrl = core.getInput('environment-url', { required: true });
        pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);

        const resetEnvArgs = ['admin', 'reset', '--url', envUrl];
        await pac.run(resetEnvArgs);
        core.info('environment reset');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error}`);
        throw error;
    } finally {
        await pac?.run(["auth", "clear"]);
    }
}
