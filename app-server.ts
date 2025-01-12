import * as http from "http";
import * as Path from 'path';
import {Renderer} from 'ui-organizer-server';

var port: number = 80;

var args = process.argv.slice(2);
args.forEach((arg, index, arr) => {
    var tmp = arg.split('=');
    var param = tmp[0];
    var value = tmp[1];
    if (param == 'port') {
        port = parseInt(value);
    }
});

const host: string = `http://localhost:${port}`;
const distDir: string = Path.join(__dirname, `./dist`);

const renderer = new Renderer(distDir, host);

var httpserver: http.Server = http.createServer((req, res)=>{
    renderer.response(req, res);
});
httpserver.listen(port, () => console.log(`UI app listening on port ${port}!`));
