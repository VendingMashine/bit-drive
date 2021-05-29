var fs = require('fs');
var termkit = require( 'terminal-kit' ) ;

class KitUtil {

    static ActionList(term, prompt, options = []) {

        var items = []



        if (prompt) {
            term.moveTo(1, 3, prompt)
        }

        for (var i = 0; i < options.length; i++) {
            items.push(options[i].text)
        }

        term.singleColumnMenu(items, { itemMaxWidth: 700, y: prompt == '' ? 3 : 5 }, function(error, response) {

            if (response.y == 1)
                return

            options[response.selectedIndex].exec(term)

        });


    }

    static ChooseFile(term, prompt) {

        return new Promise((resolve, reject) => {

            var autoCompleter = function autoCompleter(inputString, callback) {
                fs.readdir(__dirname, function(error, files) {
                    callback(undefined, termkit.autoComplete(files, inputString, true));
                });
            };

            term.moveTo(1, 3, prompt)

            term.fileInput({ autoComplete: autoCompleter, autoCompleteMenu: true, y : 4 },
                function(error, input) {
                    if (error) {
                       reject(error)
                    } else {
                       resolve(input)
                    }

                   
                }
            );
        })
    }
}

module.exports = KitUtil