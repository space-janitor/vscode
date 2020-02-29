'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const VSCode = __importStar(require("vscode"));
const FS = __importStar(require("fs"));
const Path = __importStar(require("path"));
const SJCommon = __importStar(require("@space-janitor/common"));
const OS = __importStar(require("os"));
var logger = SJCommon.getLog4JSLogger(module.filename);
class Configuration {
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
        this.configured = false;
        logger.info('== constructor begins ==');
        this.workspaceConfiguration = VSCode.workspace.getConfiguration("hog-vscode-fhir");
        if (VSCode.workspace.workspaceFile) {
            this.configurationTarget = VSCode.ConfigurationTarget.Workspace;
        }
        else if (VSCode.workspace.workspaceFolders) {
            this.configurationTarget = VSCode.ConfigurationTarget.WorkspaceFolder;
        }
        else {
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
    validateDataFolder(dataFolder) {
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
    setDataFolder(dataFolder) {
        logger.info('== setDataFolder begins');
        FS.exists(dataFolder, (exists) => {
            if (exists) {
                this.workspaceConfiguration.update('DataFolder', dataFolder, VSCode.ConfigurationTarget.Workspace).then(() => {
                    this.validateDataFolder(dataFolder);
                    this.configured = true;
                    logger.info(`DataFolder set to "${dataFolder}".`, true);
                }, (reason) => {
                    logger.warn(reason);
                    logger.warn(`Failed to set DataFolder to "${dataFolder}". This extension expects an open Workspace. Do you have a workspace open?`, true);
                });
            }
            logger.info('== setDataFolder ends');
        });
    }
    setConfiguration(key, value) {
        logger.info('== setConfiguration begins');
        this.workspaceConfiguration.update(key, value, VSCode.ConfigurationTarget.Workspace).then(() => {
            logger.debug(`Success setting key[${key}].value to ${value ? JSON.stringify(value) : '"' + value + '"'}.`);
        }, (reason) => {
            logger.warn(reason);
            logger.warn(`Failed setting key[${key}].valuet to ${value ? JSON.stringify(value) : '"' + value + '"'}.`);
        });
        logger.info('== setConfiguration ends');
    }
    getConfiguration(key) {
        return this.workspaceConfiguration.get(key);
    }
    getDataFolder() {
        return !this.getConfiguration("DataFolder") ? Path.join(OS.userInfo().homedir, '.space-janitor') : this.getConfiguration("DataFolder");
    }
    debug() {
        logger.debug(`DataFolder: ${this.getDataFolder()}`);
    }
    dispose() {
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map