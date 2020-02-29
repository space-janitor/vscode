'use strict';
import * as VSCode from 'vscode';
import * as SJCommon from '@space-janitor/common';
import * as Path from 'path';
import * as Common from './index';
import * as OS from 'os';

const logger = SJCommon.getLog4JSLogger(module.filename);


export function activateCommands(context: VSCode.ExtensionContext){
    logger.info('== activateCommands begins ==');
    let disposable = VSCode.commands.registerCommand('common.setDataFolder', setDataFolder);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.addDataFolderToWorkspace', addPersonalDataFolderToWorkspace);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.testLogger', testLogger);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.debug', debug);
    context.subscriptions.push(disposable);
    logger.info('== activateCommands ends ==');
}

export async function setDataFolder() {
    logger.info('== setDataFolder begins');
    await VSCode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select DataFolder' }).then((path => {
        if ((path)) {
            Common.configuration.setDataFolder(decodeURI(path[0].fsPath));
        }
        else {
            logger.warn('User setting hog-vscode-fhir.HomeWorkspaceFolder was not set.');
        }
        logger.info('== setDataFolder ends');
    }));
}

function addPersonalDataFolderToWorkspace(){
    logger.info('== addPersonalDataFolderToWorkspace begins');
    let dataFolder = Path.join(OS.userInfo().homedir,'.space-janitor');
    if(!VSCode.workspace.getWorkspaceFolder(VSCode.Uri.parse(`${Common.FILE_URI_SCHEME}${dataFolder}`))){
        VSCode.workspace.updateWorkspaceFolders(0, null, {uri:VSCode.Uri.parse(`${Common.FILE_URI_SCHEME}${dataFolder}`), name:'Personal' });
    }
    else{
        logger.warn(`Folder ${dataFolder} already exist your workspace.`);
    }
    logger.info('== addPersonalDataFolderToWorkspace ends');
}

function testLogger() {
    logger.info('== testLogger begins');
    try {
        // AWS.initialize();
        logger.trace('Entering cheese testing');
        logger.debug('Got cheese.');
        logger.info('Cheese is Comté.');
        logger.warn('Cheese is quite smelly.');
        logger.error('Cheese is too ripe!');
        logger.fatal('Cheese was breeding ground for listeria.');
    }
    catch (ex) {
        console.error(ex);
    }
    logger.info('== testLogger ends');
}
function debug(){
    logger.info('== testLogger begins');
    logger.debug(`OS.platform: ${OS.platform()}`);
    logger.debug(`OS.arch: ${OS.arch()}`);
    logger.debug(`OS.userInfo: ${JSON.stringify(OS.userInfo(), null, 2)}`);
    Common.configuration.debug();
    logger.debug(`VSCode.workspace.name: ${VSCode.workspace.name}`);
    logger.debug(`VSCode.workspace.workspaceFile: ${VSCode.workspace.workspaceFile}`);
    logger.debug(`VSCode.workspace.workspaceFolders: ${JSON.stringify(VSCode.workspace.workspaceFolders,null, 2)}`);
    logger.info('== testLogger ends');
}