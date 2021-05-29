var fs = require("fs")
var path = require("path")
const settingPath = "./settings.json"
const fetch = require('node-fetch');



class Storage {

    constructor() {
        this.torrents = []

        try {
            this.loadPrefs()

        } catch (e) {
            this.torrent_repos = []

            this.auto_seed = true
            this.auto_dl = true
            this.default_dl = require("os").homedir()
        }
    }

    saveToDisk(json, fileName) {
        let data = JSON.stringify(json);
        var filePath = path.resolve(fileName)
        fs.writeFileSync(filePath, data);
    }

    hasTorrent(uri) {
        var result = false
        for (var i = this.torrents.length - 1; i >= 0; i--) {
            var torr = this.torrents[i]

            if (torr.uri == uri) {
                result = true
                break
            }
        }

        return result
    }

    loadPrefs() {
        var data = this.openJSON(settingPath)
        this.torrent_repos = data.torrent_repos
        this.torrents = data.torrents
        this.auto_seed = data.auto_seed
        this.auto_dl = data.auto_dl
        this.default_dl = data.default_dl
    }

    savePrefs() {
        var settings = {
            torrent_repos: this.torrent_repos,
            auto_seed: this.auto_seed,
            auto_dl: this.auto_dl,
            default_dl: this.default_dl,
            torrents: this.torrents
        }

        this.saveToDisk(settings, settingPath)
    }


    openJSON(path) {
        let rawdata = fs.readFileSync(path);
        let data = JSON.parse(rawdata);
        return data
    }

    async getFromWeb(repo_name) {


        let url = repo_name;

        let settings = { method: "Get" };

        var res = await fetch(url, settings)
        var json = await res.json()
        return json

    }

    async getTorrents() {
        var result = []

        for (var i = this.torrent_repos.length - 1; i >= 0; i--) {
            var repo_name = this.torrent_repos[i]

            if (repo_name.includes("://")) {
                var trWeb = await this.getFromWeb(repo_name)
                result = result.concat(trWeb)
                continue
            }
            var tr = this.openJSON(repo_name)
            result = result.concat(tr)
        }

        return result
    }
}

module.exports = Storage