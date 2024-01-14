var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var fs = require('fs');
var fsp = require('fs/promises');
var path = require('path');
const _ = require('lodash');
const mime = require('mime-types');

const ROOT = path.dirname(__dirname);

console.log({ ROOT });


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

// with JSON
router.get('/api1', jsonParser, urlencodedParser, function (req, res, next) {
    console.log(`API1 GET query`, req.query);
    res.status(200).send('ok');
});

// list DIRECTORY contents route: QUERY shall contain path to display
router.get('/files', jsonParser, urlencodedParser, async function (req, res, next) {
    var currentDir = ROOT;
    var query = req.query.path || '';
    if (query) currentDir = path.join(ROOT, query);
    let upDir;
    if (currentDir !== ROOT) {
        upDir = path.dirname(currentDir).replace(ROOT, '');
    } else {
        upDir = "";
    }
    console.log("browsing ", currentDir, upDir);
    try {
        let records = [];
        let files = await fsp.readdir(currentDir);
        for (let idx in files) {
            let f = files[idx];
            let fpath = path.join(currentDir, f);
            let st = await fsp.stat(fpath);
            // console.log({ f, currentDir, fpath, isDirectory: st.isDirectory() });
            if (st.isDirectory()) {
                if (!f.match(/^\./)) {
                    records.push({ Name: f, IsDirectory: true, Up: upDir, Path: path.join(query, f), Mtime: st.mtime, Size: st.size });
                }
            } else {
                if (!f.match(/^\./)) {
                    let ext = path.extname(f);
                    records.push({ Name: f, Ext: ext, IsDirectory: false, Up: upDir, Path: path.join(query, f), Mtime: st.mtime, Size: st.size });
                }
            }
        }
        // console.log({ files, records });
        records = records.sort((a, b) => {
            // Dir vs Dir
            if (a.isDirectory === true && b.IsDirectory === true) {
                // compare their names
                if (a.Name < b.Name) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (a.IsDirectory === true && b.IsDirectory === false) {
                return -1;
            } else if (a.IsDirectory === false && b.IsDirectory === true) {
                return 1;
            } else if (a.IsDirectory === false && b.IsDirectory === false) {
                if (a.Name < b.Name) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
        res.status(202).send({msg: 'ok', code: 0, records, updir: upDir})
    } catch (error) {
        res.status(400).send({msg: error.message, code: error.code, records: []});
    }
    return;
});

// WITHOUT RANGE
router.get('/download', async (req, res) => {
    var currentDir = ROOT;
    var query = req.query.path || '';
    var filename = path.basename(query);
    if (query) currentDir = path.join(ROOT, query);
    // res.status(200).send({currentDir, query, filename, ROOT});
    res.download(currentDir, filename, {
        maxAge: 0,
    }, function (err) {
        if (err) {
            console.log({ err });
        }
    });
});
// WITH RANGE
router.get('/api/download', async (req, res) => {
    // const root_path = path.join(__dirname, '../', 'download')
    //
    var root_path = ROOT;
    let fullPath;
    const filePath = req.query.path || '';
    if (filePath) {
        fullPath = path.resolve(path.join(root_path, filePath));
    }
    let st = await fsp.stat(fullPath);
    console.log({ fullPath });
    const fileSize = st.size;
    var filename = path.basename(filePath);
    console.log(`File size: of ${filename}  ${fileSize}`);

    let start = 0;
    let end = fileSize - 1;

    const range = req.headers.range;
    console.log({ range });
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    } else {
        start = 0;
        end = fileSize - 1;
    }

    const chunkSize = (end - start + 1) >= 65535 ? 65535 :  fileSize;
    let downloadedBytes = 0;

    const fileStream = fs.createReadStream(filePath, { start, end });
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'application/octetstream'
    };

    res.writeHead(206, headers);

    fileStream.on('data', chunk => {
        console.log({ chunk, size: chunk.length, of: chunkSize, downloadedBytes});
        downloadedBytes += chunk.length;
        const progress = (downloadedBytes / fileSize) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
        res.write(chunk);
    });

    fileStream.on('end', () => {
        console.log('Finished...');
        res.end();
    });

    req.on('close', () => {
        console.log('Pausing...');
        fileStream.destroy();
    });
});



module.exports = router;
