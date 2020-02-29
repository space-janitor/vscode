'use strict';
import * as VSCode from 'vscode';
import * as FS from 'fs';
import * as Path from 'path';
import * as SJCommon from '@space-janitor/common';
import * as OS from 'os';

var logger = SJCommon.getLog4JSLogger(module.filename);
export class Configuration implements VSCode.Disposable {
    public workspaceConfiguration: VSCode.WorkspaceConfiguration;
    public configured: Boolean = false;
    public configurationTarget:VSCode.ConfigurationTarget;
    constructor(public readonly extensionContext: VSCode.ExtensionContext) {
        logger.info('== constructor begins ==');

        this.workspaceConfiguration = VSCode.workspace.getConfiguration("hog-vscode-fhir");
        if(VSCode.workspace.workspaceFile){
            this.configurationTarget = VSCode.ConfigurationTarget.Workspace;
        }
        else if(VSCode.workspace.workspaceFolders){
            this.configurationTarget = VSCode.ConfigurationTarget.WorkspaceFolder;
        }
        else{
            this.configurationTarget = VSCode.ConfigurationTarget.Global;
        }
        logger.info('== constructor ends ==');
    }
    initialize() {
        if (this.configured) {
            logger.info('Is already initialized.');
            return;
        }
        logger.info('== initialize begins ==');
        logger.info(`configurationTarget: ${this.configurationTarget}`);
        let dataFolder = this.getDataFolder();
        logger.info(`DataFolder: '${dataFolder}'`);
        this.validateDataFolder(dataFolder);
        this.configured = true;
        logger.info('== initialize ends ==');
    }
    validateDataFolder(dataFolder: string) {
        logger.info('== validateDataFolder begins ==');

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
        logger.info('== validateDataFolder ends ==');
    }
    setDataFolder(dataFolder: string) {
        logger.info('== setDataFolder begins');
        FS.exists(dataFolder, (exists) => {
            if (exists) {
                this.workspaceConfiguration.update('DataFolder', dataFolder, VSCode.ConfigurationTarget.Workspace).then(
                    () => {
                        this.validateDataFolder(dataFolder);
                        this.configured = true;
                        logger.info(`DataFolder set to "${dataFolder}".`, true);
                    },
                    (reason) => {
                        logger.warn(reason);
                        logger.warn(`Failed to set DataFolder to "${dataFolder}". This extension expects an open Workspace. Do you have a workspace open?`, true);
                    });
            }
            logger.info('== setDataFolder ends');
        });
    }
    setConfiguration(key: string, value: any) {
        logger.info('== setConfiguration begins');
        this.workspaceConfiguration.update(key, value, VSCode.ConfigurationTarget.Workspace).then(
            ()  => {
                logger.debug(`Success setting key[${key}].value to ${value ? JSON.stringify(value) : '"' + value + '"'}.`);
            },
            (reason) => {
                logger.warn(reason);
                logger.warn(`Failed setting key[${key}].valuet to ${value ? JSON.stringify(value) : '"' + value + '"'}.`);
            });
        logger.info('== setConfiguration ends');
    }
    getConfiguration(key: string): any {
        return this.workspaceConfiguration.get(key);
    }
    getDataFolder() {
        return !this.getConfiguration("DataFolder") ? Path.join(OS.userInfo().homedir, '.space-janitor') : this.getConfiguration("DataFolder");
    }
    debug(){
        logger.debug(`DataFolder: ${this.getDataFolder()}`);
    }
    dispose() {
    }
}