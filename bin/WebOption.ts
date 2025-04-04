/**
 * MIT License
 * 
 * Copyright (c) 2025 Masato Nakatsuji
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { IncomingHttpHeaders } from "http";

export interface WebOption {

    /** Accessible Scoped Paths */
    scope?: string,

    /** Access target directory */
    dir? : string,

    /** Buffering Settings */
    buffering? : WebOptionBuffering,

    /** Response header information */
    headers?: IncomingHttpHeaders,

    /** Directory Settings */
    directory? : WebOptionDirectory,

    /** Setting to not allow access to files of specified MimeType */
    noAccessMimeType?: Array<string>,
}

export interface WebOptionBuffering {

    /** Enable/disable buffer function */
    enable?: boolean,

    /** Buffer Size Limit */
    maxSize?: number,

    /** Disallow file access when buffer is enabled */
    noIOFileAccess?: boolean,
}

export interface WebOptionDirectory {

    /** Directory Index */
    indexs? : Array<string>,

    /** Excluded Directories */
    ignores?: Array<string>,

    /** Setting to not allow access to the specified DirectoryIndex */
    noAccessIndexs?: boolean,
}