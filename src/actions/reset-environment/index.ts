// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { resetEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main(): Promise<void> {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "reset-environment");

    core.startGroup('reset-environment:');
    const envUrl = core.getInput('environment-url', { required: true });
    await resetEnvironment({
        credentials: getCredentials(),
        environmentUrl: envUrl,
        language: parameterMap['language'],
        overrideDomainName: parameterMap['override-domain-name'],
        domainName: parameterMap['domain-name'],
        overrideFriendlyName: parameterMap['override-friendly-name'],
        friendlyEnvironmentName: parameterMap['friendly-name'],
    }, runnerParameters, new ActionsHost());
    core.endGroup();
}
