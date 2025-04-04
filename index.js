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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPlugin = void 0;
const ServerPluginBase_1 = require("savatora-core/bin/ServerPluginBase");
const Web_1 = require("./bin/Web");
class ServerPlugin extends ServerPluginBase_1.ServerPluginBase {
    constructor() {
        super(...arguments);
        this.webs = [];
    }
    onBegin(sector) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sector.web)
                sector.web = [];
            for (let n = 0; n < sector.web.length; n++) {
                const web = sector.web[n];
                if (!web.scope)
                    web.scope = "";
                if (!web.dir)
                    web.dir = "webs";
                if (!web.buffering)
                    web.buffering = {};
                if (!web.headers)
                    web.headers = {};
                if (!web.directory)
                    web.directory = {};
                if (!web.noAccessMimeType)
                    web.noAccessMimeType = [];
                const Web_ = new Web_1.Web();
                Web_.option = web;
                Web_.rootDir = sector.rootDir;
                Web_.setBuffer();
                this.webs.push(Web_);
            }
        });
    }
    onListen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = req.url;
            let decitionWeb;
            for (let n = 0; n < this.webs.length; n++) {
                const web = this.webs[n];
                if (url.indexOf(("/" + web.option.scope).split("//").join("/")) === 0)
                    decitionWeb = web;
            }
            if (decitionWeb)
                decitionWeb.onListen(req, res);
        });
    }
}
exports.ServerPlugin = ServerPlugin;
