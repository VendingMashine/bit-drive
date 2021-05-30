
#  bit-drive

A file sharing alternative, built with web-torrent for small teams.

## Why a P2P drive?

`bit-drive` can be a good alternative to cloud file hosting. Your files are saved on the computers of you and your peers. Given the greater number of people with your file, the faster it will be to download. 
	Recently, I wanted to download an older version of `xcode`. This task took 18 hours to complete. After some thought, there is a bit of impracticality trying to ping a server 2000 miles away. 
	What if there were multiple servers, in different regions, all sharing a piece of the big file you're trying to download?  The download would be faster. An 18 hour download also increases the possibility of a download failing. Torrents can be resumed/pause as they do not work like traditional downloads.

### What about current torrent clients?
`bit-drive`'s code is less than 20 kb. The only function is to download files and list available torrents. There are no ads, it doesn't track your history and is simple to customize.

### What about public torrent websites?
Yes, but public websites are filled with other torrents, that can be perceived as informal content. There are also barrages of ads. 

### Most recommended use?
`bit-drive` would be ideal to share applications you already own, such as xcode, photoshop, AutoCad. To generalize, big application installer files. Do not share private documents or source code, as the security limits of this program are currently unknown.

## Requirements

- Node >= 10
- NPM

## Install

Run the following command to install bit-drive

	npm i -g @thestrukture/bit-drive

Launch the terminal interface with 

	bit-drive

## Contribution
See something sus, let me know on the issues tab

If you enjoy this piece of software, leave a star.