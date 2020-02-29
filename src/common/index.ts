'use strict';
// export * from './logging';
import * as VSCode from 'vscode';
import * as SJCommon from '@space-janitor/common';
import * as OS from 'os';
import { Configuration } from './configuration';
import * as Commands from './commands';


const logger = SJCommon.getLog4JSLogger(module.filename);

export var configuration: Configuration;
export const FILE_URI_SCHEME = OS.platform() === 'win32' ? 'file:///' : 'file://';

export function activate(context: VSCode.ExtensionContext) {
    if (configuration && configuration.configured) {
        logger.info('Configuration already initialized.');
        return;
    }

    logger.info('== activate begins ==');
    configuration = new Configuration(context);
    configuration.initialize();
    context.subscriptions.push(VSCode.workspace.onDidChangeWorkspaceFolders(e => onDidChangeWorkspaceFolders(e)));
    context.subscriptions.push(VSCode.workspace.onDidChangeConfiguration(e => onDidChangeConfiguration(e)));
    Commands.activateCommands(context);

    logger.info('== activate ends ====');
}
export function deactivate() {
    logger.info('== deactivate begins ==');

    logger.info('== deactivate ends ====');
}


function onDidChangeWorkspaceFolders(e: VSCode.WorkspaceFoldersChangeEvent) {
    logger.info(`WorkspaceFolders changed. ${e.added.join(',')} added & ${e.removed.join(',')} removed."`);
}
function onDidChangeConfiguration(e: VSCode.ConfigurationChangeEvent) {
    if (e) {
        logger.warn('VSCode configuration changed.');
    }
}

export async function openTextEditor(filename: string, viewColumn = 1) {
    logger.info('== openTextEditor begins');
    VSCode.window.showTextDocument(VSCode.Uri.parse(`${FILE_URI_SCHEME}${filename}`), { preview: false, viewColumn: viewColumn }).then(textEditor => {
        logger.info(`'${textEditor.document.fileName}' loaded`);
        logger.info('== openTextEditor ends');
    });
}