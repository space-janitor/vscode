'use strict';
import * as VSCode from 'vscode';
import * as FS from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Logging from './logging';

var logger= Logging.getLog4JSLogger(module.filename);
export class Configuration implements VSCode.Disposable {
    public workspaceConfiguration: VSCode.WorkspaceConfiguration;
    public configured: Boolean = false;
    constructor(public readonly extensionContext: VSCode.ExtensionContext) {
        this.workspaceConfiguration = VSCode.workspace.getConfiguration("hog-vscode-fhir");
    }
    async initialize() {
        if (this.configured) {
            logger.info('Is already initialized.');
            return;
        }
        logger.info('== Initialize begins ==');
        if ((!Util.isNull(this.workspaceConfiguration.get("DataFolder"))) && (this.workspaceConfiguration.get("DataFolder") !== "")) {
            let DataFolder = this.getDataFolder();
            logger.info(`DataFolder: '${DataFolder}'`);
            this.validateDataFolder(DataFolder);
            this.configured = true;
        }
        else {
            logger.warn('User setting "hog-vscode-fhir.DataFolder" is not set.');
        }
        logger.info('== Initialize ends ====');
    }
    validateDataFolder(DataFolder: string) {
        let subFolderNames = ['bootstrap', 'bundles', 'resources', 'versions', 'populations', 'members', 'validations'];
        subFolderNames.forEach((subFolderName) => {
            var subFolder = Path.join(DataFolder, subFolderName);
            if (!FS.existsSync(subFolder)) {
                FS.mkdirSync(subFolder);
                logger.info(`Home subfolder '${subFolder}' created.`);
            }
            else{
                logger.info(`Home subfolder '${subFolder}' exists.`);
            }
        });
    }
    setDataFolder(DataFolder: string) {
        FS.exists(DataFolder, (exists) => {
            if (exists) {
                this.workspaceConfiguration.update('DataFolder', DataFolder, VSCode.ConfigurationTarget.Workspace).then(
                    onfulfiled => {
                        this.validateDataFolder(DataFolder);
                        this.configured = true;
                        logger.info(`DataFolder set to "${DataFolder}".`, true);
                    },
                    onrejected => {
                        logger.warn(`Failed to set DataFolder to "${DataFolder}". This extension expects an open Workspace. Do you have a workspace open?`, true);
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
        return this.getConfiguration("DataFolder");
    }
    dispose() {
    }
}