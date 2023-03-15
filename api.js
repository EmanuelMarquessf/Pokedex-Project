const request = require("request");
const http = require("http");

const hostname = 'https://pokeapi.co/api/v2';
const path = '/pokemon?limit=150&offset=0';

request(`${hostname}${path}`, (err, res, body) => {
    console.log(body);    
});