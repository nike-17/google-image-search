#!/usr/bin/env node

var googleImegaeSearch = require('../lib/search');

var query = process.argv.slice(2, process.argv.length).join(' ');
if(!query) handleError('Usage: google-image-search your query here > image.jpg');

googleImegaeSearch(query).pipe(process.stdout);

function handleError(err){
    if (err){
        console.error(err.message || err);
        process.exit(-1);
    }
}