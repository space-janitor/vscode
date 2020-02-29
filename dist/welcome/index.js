'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SJCommon = __importStar(require("@space-janitor/common"));
const Commands = __importStar(require("./commands"));
const logger = SJCommon.getLog4JSLogger(module.filename);
function activate(context) {
    logger.info('== activate begins');
    Commands.activateCommands(context);
    logger.info('== activate ends ====');
}
exports.activate = activate;
function deactivate() {
    logger.info('== deactivate begins ==');
    logger.info('== deactivate ends ====');
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map