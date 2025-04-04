"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web = void 0;
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
class Web {
    constructor() {
        this._buffer = {};
    }
    setBuffer() {
        if (!this.option.buffering)
            return;
        this._buffer = {};
        const targetDir = (this.rootDir + "/" + this.option.dir).split("\\").join("/").split("//").join("/");
        const fileList = this._search(targetDir);
        for (let n = 0; n < fileList.length; n++) {
            const filePath = fileList[n];
            if (this.option.buffering.maxSize) {
                if (fs.statSync(filePath).size > this.option.buffering.maxSize)
                    continue;
            }
            const mime = this.getMimeType(filePath);
            if (this.option.noAccessMimeType) {
                if (this.option.noAccessMimeType.indexOf(mime) > -1)
                    continue;
            }
            const content = fs.readFileSync(filePath);
            this._buffer[filePath.split("\\").join("/").split("//").join("/")] = { mime, content };
        }
    }
    _search(dirPath) {
        let res = [];
        const list = fs.readdirSync(dirPath);
        for (let n = 0; n < list.length; n++) {
            const targetDir = dirPath + "/" + list[n];
            if (fs.statSync(dirPath + "/" + list[n]).isDirectory()) {
                const buffer = this._search(targetDir);
                for (let n2 = 0; n2 < buffer.length; n2++) {
                    res.push(buffer[n2]);
                }
            }
            else {
                res.push(targetDir);
            }
        }
        return res;
    }
    onListen(req, res) {
        const url = req.url.substring(("/" + this.option.scope).split("//").join("/").length);
        if (this.option.directory.ignores) {
            for (let n = 0; n < this.option.directory.ignores.length; n++) {
                const ingoreDir = this.option.directory.ignores[n];
                if (("/" + url).indexOf(ingoreDir) === 0)
                    return;
            }
        }
        const accessFilePath = (this.rootDir + "/" + this.option.dir + "/" + url).split("\\").join("/").split("//").join("/");
        if (this.onListenerFromBuffer(accessFilePath, res))
            return;
        if (!this.option.buffering.noIOFileAccess)
            return this.onListnerFromFile(accessFilePath, res);
    }
    onListenerFromBuffer(filePath, res) {
        if (!this._buffer[filePath]) {
            filePath = this.onListenerBufferIndexsCheck(filePath);
            if (!filePath)
                return false;
        }
        else {
            const status = this.indexCheck(filePath);
            if (!status)
                return false;
        }
        const { mime, content } = this._buffer[filePath];
        this.setHeader(res, this.option.headers);
        res.setHeader("content-type", mime);
        // @ts-ignore
        res.write(content);
        res.end();
        return true;
    }
    indexCheck(filePath) {
        if (this.option.directory.noAccessIndexs) {
            const target = path.basename(filePath);
            for (let n = 0; n < this.option.directory.indexs.length; n++) {
                const index = this.option.directory.indexs[n];
                if (target == index)
                    return false;
            }
        }
        return true;
    }
    onListenerBufferIndexsCheck(filePath) {
        if (!this.option.directory.indexs)
            return;
        let exists = false;
        for (let n = 0; n < this.option.directory.indexs.length; n++) {
            const indexFileName = this.option.directory.indexs[n];
            filePath = (filePath + "/" + indexFileName).split("//").join("/");
            if (this._buffer[filePath]) {
                exists = true;
                break;
            }
        }
        if (!exists)
            return;
        return filePath;
    }
    onListnerFromFile(filePath, res) {
        if (!fs.existsSync(filePath))
            return;
        if (!fs.statSync(filePath).isFile()) {
            filePath = this.onListenerFileIndexsCheck(filePath);
            if (!filePath)
                return false;
        }
        else {
            const status = this.indexCheck(filePath);
            if (!status)
                return false;
        }
        const mime = this.getMimeType(filePath);
        if (this.option.noAccessMimeType) {
            if (this.option.noAccessMimeType.indexOf(mime) > -1)
                return false;
        }
        const content = fs.readFileSync(filePath);
        this.setHeader(res, this.option.headers);
        res.setHeader("content-type", mime);
        // @ts-ignore
        res.write(content);
        res.end();
        return true;
    }
    onListenerFileIndexsCheck(filePath) {
        if (!this.option.directory.indexs)
            return;
        let exists = false;
        for (let n = 0; n < this.option.directory.indexs.length; n++) {
            const indexFileName = this.option.directory.indexs[n];
            filePath = (filePath + "/" + indexFileName).split("//").join("/");
            if (fs.existsSync(filePath)) {
                if (fs.statSync(filePath).isFile()) {
                    exists = true;
                    break;
                }
            }
        }
        if (!exists)
            return;
        return filePath;
    }
    setHeader(res, headers) {
        const c = Object.keys(headers);
        for (let n = 0; n < c.length; n++) {
            const name = c[n];
            let value = headers[name];
            if (typeof value == "object")
                value = value.join(",");
            res.setHeader(name, value);
        }
    }
    getMimeType(filePath) {
        let mimeType = mime.lookup(filePath);
        if (!mimeType)
            mimeType = "text/plain";
        return mimeType;
    }
}
exports.Web = Web;
