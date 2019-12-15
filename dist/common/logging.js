'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log4JS = __importStar(require("log4js"));
const util_1 = require("util");
const assert_1 = require("assert");
const Path = __importStar(require("path"));
const PkgDir = __importStar(require("pkg-dir"));
const logger = getLog4JSLogger(module.filename);
const defaultLg4JSConfiguration = {
    appenders: { mainConsole: { type: "console" } },
    categories: { default: { appenders: ["mainConsole"], level: "debug" } }
};
function getLog4JSLogger(moduleFilename) {
    let packageRoot = PkgDir.sync(Path.dirname(moduleFilename));
    if (util_1.isNullOrUndefined(packageRoot)) {
        return Log4JS.getLogger(moduleFilename);
    }
    else {
        let packageFilename = Path.join(packageRoot, "package.json");
        let packageInfo = require(packageFilename);
        return Log4JS.getLogger(`${packageInfo.name}/${Path.relative(packageRoot, moduleFilename)}`);
    }
}
exports.getLog4JSLogger = getLog4JSLogger;
function intializeLogging(configuration = defaultLg4JSConfiguration) {
    try {
        Log4JS.configure(configuration);
        logger.info("Logging initialized.");
        return Promise.resolve();
    }
    catch (err) {
        return assert_1.rejects(err);
    }
}
exports.intializeLogging = intializeLogging;
//# sourceMappingURL=logging.js.map