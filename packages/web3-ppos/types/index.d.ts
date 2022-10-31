// Type definitions for .\src\index.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

import { BigInteger } from "big-integer";

export const paramsOrder: {
    '1000': string[];
    '1001': string[];
    '1002': string[];
    '1003': string[];
    '1004': string[];
    '1005': string[];
    '1006': any[];
    '1100': any[];
    '1101': any[];
    '1102': any[];
    '1103': string[];
    '1104': string[];
    '1105': string[];
    '1106': string[];
    '1200': any[];
    '1201': any[];
    '1202': any[];
    '5100': string[];
}

export const responseOrder: {
    '1005': string[];
    '1006': string[];
    '5000': string[];
}

export const _bufferToString: (buffer: any) => string

export const _bufferToBigInt: (buffer: any) => BigInteger

export function decodeBlockLogs(block: any, type?: string): void

export function sleep(time: any): Promise<any>

export function paramsToData(params: any): string

export function funcTypeToAddress(funcType: any): "0x1000000000000000000000000000000000000002" | "0x1000000000000000000000000000000000000005" | "0x1000000000000000000000000000000000000004" | "0x1000000000000000000000000000000000000001" | "0x1000000000000000000000000000000000000006"

export function funcTypeToBech32(hrp: any, funcType: any): string

export function signTx(privateKey: any, chainId: any, rawTx: any): string

export function pposHexToObj(hexStr: any): string

export function PPOS(setting: any): void