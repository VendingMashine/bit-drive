var kutil = require("./util")
var torrent = require("../services/web_torrent")
var storageClass = require("../services/storage")
var storage = new storageClass()
var path = require("path")

class HomeView {

    static buildMenu(term) {
        var items = ['Downloads', 'Progress', 'Add', 'Settings', 'Exit'];

        var options = {
            y: 1, // the menu will be on the top of the terminal
            style: term.inverse,
            selectedStyle: term.dim.blue.bgGreen
        };

        term.clear();

        term.singleLineMenu(items, options, function(error, response) {

            HomeController[response.selectedText](term)

        });
    }
}

class HomeController {

    static Germinate() {

        setTimeout(() => {

            var client = new torrent()

            for (var i = storage.torrents.length - 1; i >= 0; i--) {
                var torr = storage.torrents[i]
                client.download(torr.uri, torr.filepath)
            }


        }, 300)
    }
    static Exit(term) {

        term.clear()
        process.exit()
    }

    static ResetFunc(term) {
        return {
            text: "Go to menu",
            exec: () => {
                HomeView.buildMenu(term)
            }
        }
    }

    static SearchView(term) {
        term.clear()
        term('Search > ');

        term.inputField({},
            function(error, input) {


                HomeController.Downloads(term, input)

            })
    }

    static Add(term) {

        kutil.ChooseFile(term, 'Choose a file/directory >')
            .then(filePath => {


                // infoHash
                //magnetURI
                try {
                    var client = new torrent()
                    client.add(filePath)
                        .then(torrent => {

                            //console.log(torrent)
                            term.clear()
                            term.moveTo(1, 6, `Torrent saved. Magnet URI : ${torrent.magnetURI}`)
                            kutil.ActionList(
                                term,
                                null,
                                [
                                    this.ResetFunc(term)
                                ]
                            )

                        })

                } catch (e) {
                    console.log(e)
                }

            })
    }

    static Settings(term) {

        settings.ShowSettings(term)
    }

    static Progress(term) {

        var dlPrompt = "No Downloads running!"
        var client = new torrent().getClient()
        var logArr = []

        if (client.torrents) {
            dlPrompt = `${client.torrents.length} Download(s)`
            for (var i = client.torrents.length - 1; i >= 0; i--) {
                var torr = client.torrents[i]
                var entry = `${torr.name} - [${torr.done ? 'DONE' : (torr.progress * 100).toFixed(2) + '%'}] - Peers : ${torr.numPeers} - Location : ${torr.path} - Time rem. : ${(torr.timeRemaining / 1000) / 60} minutes`
                logArr.push(entry)
            }
        }

        term.moveTo(1, 7, logArr.join("\n"))

        kutil.ActionList(
            term,
            dlPrompt,
            [
                this.ResetFunc(term)
            ]
        )


    }

    static launchDownload(term, input, filepath) {
        var client = new torrent()
        client.download(input, filepath)

        HomeView.buildMenu(term)
        storage.torrents.push({
            filepath,
            uri: input
        })
        storage.savePrefs()
        term.cyan(`\n\nSaving torrent to ${filepath}`)
        term.cyan("\nDownload has started...")
    }

    static Downloads(term, filter = "") {

        var search = {
                text: "Search...",
                exec: (term) => {
                    HomeController.SearchView(term)
                }
            },
            manual = {
                text: "Add manually, by entering infoHash or magnet URI",
                exec: (term) => {

                    term.clear()
                    term('Enter InfoHash or Magnet URI > ');
                    term.inputField({},
                        function(error, input) {

                            term.clear()
                            kutil.ChooseFile(term, 'Choose saved data destination >')
                                .then(filePath => {

                                    HomeController.launchDownload(term, input, filePath)

                                })
                        })
                }
            }

        var btns = []

        storage.getTorrents()
            .then(torrents => {

                for (var i = 0; i < torrents.length; i++) {
                    let torr = torrents[i]

                    if (storage.hasTorrent(torr.uri))
                        continue;

                    btns.push({
                        text: torr.name,
                        exec: () => {
                            HomeController.launchDownload(term, torr.uri, `${path.resolve(storage.default_dl, torr.name)}`)
                        }
                    })
                }

                btns = btns.filter(el => {
                	if(!el.text)
                		return false

                    return el.text.includes(filter)
                })

                kutil.ActionList(
                    term,
                    "Download list",
                    [
                        this.ResetFunc(term),
                        manual,
                        search
                    ].concat(btns)
                )

            })


    }
}

class settings {

    static ShowSettings(term) {

        var btns = [HomeController.ResetFunc(term)]

        var settings_list = [{
                text: "Add torrent list",
                exec: () => {
                    settings.AddRepo(term)
                }
            }, {
                text: "Manage torrent lists",
                exec: () => {
                    settings.ManageList(term)
                }
            },
            {
                text: "Default download directory",
                exec: () => {
                    settings.defaultDL(term)
                }
            }
        ]

        kutil.ActionList(
            term,
            "Restart bit-drive to apply settings",
            btns.concat(settings_list))

    }



    static defaultDL(term) {
        term.clear()
        term(`New download folder path (${storage.default_dl}) :`);

        term.inputField({},
            function(error, input) {
                term.clear()

                if (!input || input.trim() == "") {
                    settings.ShowSettings(term)
                    return
                }
                term("Path saved!")
                var filePath = path.resolve(input)
                storage.default_dl = filePath
                storage.savePrefs()
                settings.ShowSettings(term)
            })
    }

    static ManageList(term) {

        var btns = [HomeController.ResetFunc(term)]

        term.clear()

        for (var i = storage.torrent_repos.length - 1; i >= 0; i--) {
            let ent = storage.torrent_repos[i].substr(0, 100)
            let iX = i + 0
            btns.push({
                text: ent,
                exec: () => {

                    term.clear()
                    storage.torrent_repos.splice(iX, 1)
                    storage.savePrefs()
                    term.cyan(`${ent} removed!`)
                    settings.ShowSettings(term)

                }
            })
        }

        kutil.ActionList(
            term,
            "Select the list you wish to remove?",
            btns)
    }

    static AddRepo(term) {
        term.clear()
        term('Enter path to torrent list > ');

        term.inputField({},
            function(error, input) {
                term.clear()
                if (!input || input.trim() == "") {
                    settings.ShowSettings(term)
                    return
                }
                term("Path saved!" + input)
                
                
                if (!input.includes("://")){
                	var filePath = path.resolve(input)
                    storage.torrent_repos.push(filePath)
                }
                else {
                	storage.torrent_repos.push(input)
                }

                storage.savePrefs()
                settings.ShowSettings(term)
            })
    }
}

module.exports = {
    HomeView,
    HomeController,
    settings,
    storage
}