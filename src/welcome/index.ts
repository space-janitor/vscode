'use strict';
// export * from './logging';
import * as VSCode from 'vscode';
import * as SJCommon from '@space-janitor/common';
import * as Commands from './commands';
const logger = SJCommon.getLog4JSLogger(module.filename);

export function activate(context: VSCode.ExtensionContext) {
    logger.info('== activate begins');
    Commands.activateCommands(context);
    logger.info('== activate ends ====');
}
export function deactivate() {
    logger.info('== deactivate begins ==');

    logger.info('== deactivate ends ====');
}