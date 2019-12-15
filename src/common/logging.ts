'use strict';

import * as Log4JS from 'log4js';
import { isNullOrUndefined } from 'util';
import { rejects } from 'assert';
import * as Path from 'path';
import * as PkgDir from 'pkg-dir';

const logger = getLog4JSLogger(module.filename);
const defaultLg4JSConfiguration = {
    appenders: { mainConsole: { type: "console" } },
    categories: { default: { appenders: ["mainConsole"], level: "debug"} }
};
export function getLog4JSLogger(moduleFilename:string):Log4JS.Logger{
    let packageRoot = PkgDir.sync(Path.dirname(moduleFilename));
    if(isNullOrUndefined(packageRoot)){
        return Log4JS.getLogger(moduleFilename);
    }
    else{
        let packageFilename = Path.join(packageRoot,"package.json");
        let packageInfo = require(packageFilename);
        return Log4JS.getLogger(`${packageInfo.name}/${Path.relative(packageRoot, moduleFilename)}`);
    }
}
export function intializeLogging(configuration: Log4JS.Configuration = defaultLg4JSConfiguration): Promise<any> {
    try {
        Log4JS.configure(configuration);
        logger.info("Logging initialized.");
        return Promise.resolve();
    }
    catch (err) {
        return rejects(err);
    }
}
export function testLogger() {
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
}