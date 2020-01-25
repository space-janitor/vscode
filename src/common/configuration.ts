'use strict';
import * as VSCode from 'vscode';
import * as FS from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as SJCommon from '@space-janitor/common';
import * as OS from 'os';

var logger = SJCommon.getLog4JSLogger(module.filename);
export class Configuration implements VSCode.Disposable {
    public workspaceConfiguration: VSCode.WorkspaceConfiguration;
    public configured: Boolean = false;
    public configurationTarget:VSCode.ConfigurationTarget;
    constructor(public readonly extensionContext: VSCode.ExtensionContext) {
        this.workspaceConfiguration = VSCode.workspace.getConfiguration("hog-vscode-fhir");
        if(Util.isObject(VSCode.workspace.workspaceFile)){
            this.configurationTarget = VSCode.ConfigurationTarget.Workspace;
        }
        else if(Util.isNullOrUndefined(VSCode.workspace.workspaceFolders)){
            this.configurationTarget = VSCode.ConfigurationTarget.Global;
        }
        else{
            this.configurationTarget = VSCode.ConfigurationTarget.WorkspaceFolder;
        }
    }
    initialize() {
        if (this.configured) {
            logger.info('Is already initialized.');
            return;
        }
        logger.info('== Initialize begins ==');
        logger.info(`configurationTarget: ${this.configurationTarget}`);
        let dataFolder = this.getDataFolder();
        logger.info(`DataFolder: '${dataFolder}'`);
        this.validateDataFolder(dataFolder);
        this.configured = true;
        logger.info('== Initialize ends ====');
    }
    validateDataFolder(dataFolder: string) {
        if (!FS.existsSync(dataFolder)) {
            FS.mkdirSync(dataFolder);
        }
        let subFolderNames = ['configurations', 'temp', 'data'];
        subFolderNames.forEach((subFolderName) => {
            var subFolder = Path.join(dataFolder, subFolderName);
            if (!FS.existsSync(subFolder)) {
                FS.mkdirSync(subFolder);
                logger.info(`Home subfolder '${subFolder}' created.`);
            }
            else {
                logger.info(`Home subfolder '${subFolder}' exists.`);
            }
        });
    }
    setDataFolder(dataFolder: string) {
        FS.exists(dataFolder, (exists) => {
            if (exists) {
                this.workspaceConfiguration.update('DataFolder', dataFolder, VSCode.ConfigurationTarget.Workspace).then(
                    onfulfiled => {
                        this.validateDataFolder(dataFolder);
                        this.configured = true;
                        logger.info(`DataFolder set to "${dataFolder}".`, true);
                    },
                    onrejected => {
                        logger.warn(`Failed to set DataFolder to "${dataFolder}". This extension expects an open Workspace. Do you have a workspace open?`, true);
                    });
            }
        });
    }
    setConfiguration(key: string, value: any) {
        this.workspaceConfiguration.update(key, value, VSCode.ConfigurationTarget.Workspace).then(
            onfulfiled => {
                logger.debug(`Success setting key[${key}].value to ${Util.isObject(value) ? JSON.stringify(value) : '"' + value + '"'}.`);
            },
            onrejected => {
                logger.warn(`Failed setting key[${key}].valuet to ${Util.isObject(value) ? JSON.stringify(value) : '"' + value + '"'}.`);
            });
    }
    getConfiguration(key: string): any {
        return this.workspaceConfiguration.get(key);
    }
    getDataFolder() {
        return Util.isNullOrUndefined(this.getConfiguration("DataFolder")) ? Path.join(OS.userInfo().homedir, '.space-janitor') : this.getConfiguration("DataFolder");
    }
    debug(){
        logger.debug(`DataFolder: ${this.getDataFolder()}`);
    }
    dispose() {
    }
}