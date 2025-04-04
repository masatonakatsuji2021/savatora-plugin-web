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

import { ServerPluginBase } from "savatora-core/bin/ServerPluginBase";
import { ThreadServerRequest } from "savatora-core/bin/ThreadServerRequest";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { ServerSectorWeb } from "./bin/ServerSectorWeb";
import { Web } from "./bin/Web";

export class ServerPlugin extends ServerPluginBase {

    private webs : Array<Web> = [];

    public async onBegin(sector: ServerSectorWeb) {
        if (!sector.web) sector.web = [];
        for(let n = 0 ; n < sector.web.length ; n++) {
            const web = sector.web[n];
            if (!web.scope) web.scope = "";
            if (!web.dir) web.dir = "webs";
            if (!web.buffering) web.buffering = {};
            if (!web.headers) web.headers = {};
            if (!web.directory) web.directory = {};
            if (!web.noAccessMimeType) web.noAccessMimeType = [];
            const Web_ = new Web();
            Web_.option = web;
            Web_.rootDir = sector.rootDir;
            Web_.setBuffer();
            this.webs.push(Web_);
        }
    }

    public async onListen(req: ThreadServerRequest, res: ThreadServerResponse) {
        const url = req.url;
        let decitionWeb : Web;
        for(let n = 0 ; n < this.webs.length ; n++) {
            const web = this.webs[n];
            if (url.indexOf(("/" + web.option.scope).split("//").join("/")) === 0) decitionWeb = web;
        }
        if(decitionWeb) decitionWeb.onListen(req, res);
    }
}