var server = require('http').createServer(handler);
var port = process.env.PORT | 80;
var phantom = require('phantom');
var fs = require('fs');

function handler(req, res) {
    console.log(req.url);
    if(req.url == '/'){
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    }

    if (req.url.toLowerCase().indexOf("/parse") >= 0) {
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                var sURL = 'http://www.naver.com';
                page.viewportSize = { width: 1903, height: 995 };

                page.open(sURL, function (status) {

                    if (status !== 'success') {
                        console.log('Unable to load the address!');
                        phantom.exit();
                    } else {
                        setTimeout(page.render('beforeCSS.png', {format: 'png', quality: '10'}), 200);
                        page.evaluate(function () {
                            // do something for changing DOM or CSS
                            document.querySelector('.lnb').style.backgroundColor = "yellow";
                            // <link rel='stylesheet' type='text/css' href='http://localhost/css2.css'/>
//                            var NewStyles = document.createElement("link");
//                            NewStyles.rel = "stylesheet";
//                            NewStyles.type = "text/css";
//                            NewStyles.href = "http://localhost/css2.css";
//                            NewStyles.media = "screen";
//                            document.head.appendChild(NewStyles);
                        });

                        setTimeout(page.render('afterCSS.png', {format: 'png', quality: '10'}), 200);
                    }
                });
            });
        }, {
            dnodeOpts: {
                weak: false
            }
        });
        res.end();
    }

    if (req.url == '/css2.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        fs.readFile(__dirname + '/css2.css', function (err, data) {
            if (err) {
                console.log(err);
                res.end();
            }
            res.end(data);
        });
    }

    if (req.url == '/render.html') {
        fs.readFile(__dirname + '/render.html', function (err, html) {
            if (err) {
                console.log(err);
                res.end();
            }
            res.end(html);
        });
    }

    if (req.url == '/beforeCSS.png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        fs.readFile(__dirname + '/beforeCSS.png', function (err, data) {
            if (err) {
                console.log(err);
                res.end();
            }
            res.end(data);
        });
    }

    if (req.url == '/afterCSS.png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        fs.readFile(__dirname + '/afterCSS.png', function (err, data) {
            if (err) {
                console.log(err);
                res.end();
            }
            res.end(data);
        });
    }
}

server.listen(port);
