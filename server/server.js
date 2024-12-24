import http from "node:http" ;
import {readFileSync} from "fs" ;
import fetch from "node-fetch" ;
import path from "path" ;

const PORT = process.argv.PORT || 7007;

const cars = readFileSync(path.resolve("database", "cars.json")) ? JSON.parse(readFileSync(path.resolve("database", "cars.json"))) : [] ;

const generateQuery = (path, req) => {
    let query = new URL(path, `http://${req.headers.host}`) ;
    req.query = Object.fromEntries(query.searchParams) ; 
    return true ;
} ;

const server = http.createServer((req, res) => {
    let method = req.method.toUpperCase().trim() ;
    let path = req.url.toLowerCase().trim() ;
    if(path.startsWith('/cars') && method == "GET"){
        generateQuery(path, req ) ;
        let query = req.query ;
        let result = [] ;
        for(let car of cars){
            let count = 0 ;
            for(let search in query){
                if(car[search] == query[search]) count++;
            } ;
            if(Object.keys(query).length == count) result.push(car) ; 
        } ;
        return res.end(JSON.stringify(result)) ;
    } ; 
}) ;

fetch('http://localhost:7007/cars?year=2023').then((res) => res.json()).then((data) => console.log(data)) ;

server.listen(PORT, () => {
    console.log(`Server is running on port = ${PORT}`);
}) ;