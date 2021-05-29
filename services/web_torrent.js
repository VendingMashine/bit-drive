var WebTorrent = require('webtorrent')
var term = require('terminal-kit').terminal;
var client = new WebTorrent({
    utp: true
})

class TorrentClient {

    constructor() {

    }

    errorHandler(err) {
        term.red(err)
    }

    getClient(){
    	return client
    }

    add(files) {

        term.clear()
        return new Promise((resolve, reject) => {
            term.cyan("Seeding torrent... " + files)
           
            client.seed([files], function(torrent) {

                torrent.on('error', function(err) {
                    term.red(err)
                })


                resolve(torrent)

            })


        })
    }

    download(uri, filePath = __dirname + "web") {
        setTimeout((() => {
            try {
                client.add(uri.trim(), { path: filePath }, function(torrent) {

                    term.moveTo(1, 4, "Download complete, now seeding")
                });
            } catch (e) {
                console.log(e)
            }
        }).bind(this), 300)

    }
}

module.exports = TorrentClient