#!/usr/bin/env node
'use strict'

var term = require('terminal-kit').terminal;

let Home = require("./terminal/home")

async function run() {
    Home.HomeController.ClientList = []
    Home.HomeView.buildMenu(term)
    Home.HomeController.Germinate()
}

run()
    .then(() => {})
