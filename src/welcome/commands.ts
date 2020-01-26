'use strict';
import * as VSCode from 'vscode';
import * as SJCommon from '@space-janitor/common';

const logger = SJCommon.getLog4JSLogger(module.filename);

export function activateCommands(context: VSCode.ExtensionContext){
    logger.info('== activateCommands begins ==');
    let disposable = VSCode.commands.registerCommand('welcome.show', show);
    context.subscriptions.push(disposable);
    logger.info('== activateCommands ends ==');
}

function show(){
    logger.info('== activate show ==');

    logger.info('== activate ends ==');
}