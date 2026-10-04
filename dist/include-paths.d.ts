export declare class IncludePathError extends Error {
}
/**
 * The path as written, without quotes and with `\` read as `/`. Throws for anything that is not a
 * plain relative path: absolute paths, home directories, drive letters, URLs, control characters.
 */
export declare function normaliseIncludePath(raw: string): string;
/** The key of a file named `raw` from within the file keyed `from` (`''` for the fence). */
export declare function resolveInclude(from: string, raw: string): string;
