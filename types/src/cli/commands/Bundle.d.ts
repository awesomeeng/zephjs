declare const Path: any;
declare const FS: any;
declare const Acorn: any;
declare const Rollup: any;
declare const AwesomeCLI: any;
declare const AwesomeUtils: any;
declare const BANNER = "/*\n\nThe following is a ZephJS Component Bundle and includes the ZephJS Library.\nZephJS is copyright 2018-PRESENT, by The Awesome Engineering Company, inc.\nand is released publically under the MIT License. Any usage of the ZephJS\nlibrary must included this license heading, the copyright notice, and\na reference to the Zephjs website.\n\nFor more details about ZephJS, please visit https://zephjs.com\n\n*/\n";
declare const extensions: any[];
declare class Bundle extends AwesomeCLI.AbstractCommand {
    constructor();
    get title(): string;
    get description(): string;
    get usage(): string;
    execute(args: any, options: any): void | Promise<unknown>;
    rollup(source: any, target: any, quiet: any, full: any): Promise<unknown>;
}
declare const loader: (url: any, rootDir: any, encoding?: string) => Promise<unknown>;
declare const inlineReferences: (code: any, origin: any, quiet: any) => Promise<any>;
declare const inlineHTML: (root: any, code: any, offset: any, node: any, quiet: any) => Promise<unknown>;
declare const inlineCSS: (root: any, code: any, offset: any, node: any, quiet: any) => Promise<unknown>;
declare const inlineAsset: (root: any, code: any, offset: any, node: any, quiet: any) => Promise<unknown>;
declare const resolveFilename: (root: any, filename: any, extensions: any) => any;
