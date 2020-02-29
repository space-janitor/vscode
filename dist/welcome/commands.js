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
const SJCommon = __importStar(require("@space-janitor/common"));
const logger = SJCommon.getLog4JSLogger(module.filename);
function activateCommands(context) {
    logger.info('== activateCommands begins ==');
    let disposable = VSCode.commands.registerCommand('welcome.show', show);
    context.subscriptions.push(disposable);
    logger.info('== activateCommands ends ==');
}
exports.activateCommands = activateCommands;
function show() {
    logger.info('== activate show ==');
    logger.info('== activate ends ==');
}
//# sourceMappingURL=commands.js.map