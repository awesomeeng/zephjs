export = Create;
declare class Create {
    get title(): string;
    get description(): string;
    get usage(): string;
    execute(args: any, options: any): void;
}
