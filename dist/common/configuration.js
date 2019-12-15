'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const Util = __importStar(require("util"));
const Logging = __importStar(require("./logging"));
var logger = Logging.getLog4JSLogger(module.filename);
class Configuration {
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
        this.configured = false;
        this.workspaceConfiguration = VSCode.workspace.getConfiguration("hog-vscode-fhir");
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    validateDataFolder(DataFolder) {
        let subFolderNames = ['bootstrap', 'bundles', 'resources', 'versions', 'populations', 'members', 'validations'];
        subFolderNames.forEach((subFolderName) => {
            var subFolder = Path.join(DataFolder, subFolderName);
            if (!FS.existsSync(subFolder)) {
                FS.mkdirSync(subFolder);
                logger.info(`Home subfolder '${subFolder}' created.`);
            }
            else {
                logger.info(`Home subfolder '${subFolder}' exists.`);
            }
        });
    }
    setDataFolder(DataFolder) {
        FS.exists(DataFolder, (exists) => {
            if (exists) {
                this.workspaceConfiguration.update('DataFolder', DataFolder, VSCode.ConfigurationTarget.Workspace).then(onfulfiled => {
                    this.validateDataFolder(DataFolder);
                    this.configured = true;
                    logger.info(`DataFolder set to "${DataFolder}".`, true);
                }, onrejected => {
                    logger.warn(`Failed to set DataFolder to "${DataFolder}". This extension expects an open Workspace. Do you have a workspace open?`, true);
                });
            }
        });
    }
    setConfiguration(key, value) {
        this.workspaceConfiguration.update(key, value, VSCode.ConfigurationTarget.Workspace).then(onfulfiled => {
            logger.debug(`Success setting key[${key}].value to ${Util.isObject(value) ? JSON.stringify(value) : '"' + value + '"'}.`);
        }, onrejected => {
            logger.warn(`Failed setting key[${key}].valuet to ${Util.isObject(value) ? JSON.stringify(value) : '"' + value + '"'}.`);
        });
    }
    getConfiguration(key) {
        return this.workspaceConfiguration.get(key);
    }
    getDataFolder() {
        return this.getConfiguration("DataFolder");
    }
    dispose() {
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map