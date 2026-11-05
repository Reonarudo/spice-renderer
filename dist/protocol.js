/** Int32 slots at the head of the shared buffer. */
export const READY = 0;
export const LENGTH = 1;
export const ENGINE = 2;
/** Byte length of the parsed stage written at the tail of the data region, 0 when none. */
export const PARSED = 3;
/** Values of the ENGINE slot. */
export const STARTING = 0;
export const STARTED = 1;
export const FAILED = 2;
export const HEADER = 16;
