'use strict';
export * from './logging';

import * as VSCode from 'vscode';
import { Configuration } from './configuration';
import { isUndefined } from 'util';
import * as Logging from './logging';
import * as Util from 'util';

var logger = Logging.getLog4JSLogger(module.filename);

export var configuration: Configuration;
export function activate(extensionContext: VSCode.ExtensionContext) {
    Logging.intializeLogging({
        appenders: { 'outputAppender': { type: require.resolve('./outputAppender'), layout: { type: 'basic' } } },
        categories: { default: { appenders: ["outputAppender"], 'level': 'debug' } }
    });
    if (!isUndefined(configuration) && (configuration.configured)) {
        logger.info('Configuration already initialized.');
    }
    let disposable = VSCode.commands.registerCommand('configurations.configure', configure);
    extensionContext.subscriptions.push(disposable);

    if (Util.isNullOrUndefined(VSCode.workspace.workspaceFile)) {
        logger.warn("There is no active workspace. The hog-vscode-fhir extension requires an active workspace.");
        return;
    }
    logger.info('== activate begins ==');
    configuration = new Configuration(extensionContext);
    configuration.initialize();
    extensionContext.subscriptions.push(VSCode.workspace.onDidChangeWorkspaceFolders(e => onDidChangeWorkspaceFolders(e)));
    extensionContext.subscriptions.push(VSCode.workspace.onDidChangeConfiguration(e => onDidChangeConfiguration(e)));
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
    logger.info('VSCode configuration changed.');
    if (e.affectsConfiguration('hog-vscode-fhir').valueOf()) {
        VSCode.window.showInputBox({ prompt: "Workspace configuration has changed. Do you want to restart VSCode?", ignoreFocusOut: true, placeHolder: "Enter 'yes' to reload" }).then((value) => {
            if (Util.isNullOrUndefined(value)) {
                VSCode.window.showWarningMessage('You have choosen not to restart VSCode.');
            } else {
                VSCode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
    }
}
export async function configure() {
    await VSCode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select DataFolder' }).then((path => {
        if ((path)) {
            configuration.setDataFolder(decodeURI(path[0].fsPath));
        }
        else {
            logger.warn('User setting hog-vscode-fhir.HomeWorkspaceFolder was not set.');
            configuration.configured = false;
        }
    }));
}