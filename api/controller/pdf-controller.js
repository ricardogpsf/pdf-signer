const fs = require('fs');
const { spawnSync} = require('child_process');
const service = require('../service/pdf-service');
const FileService = require('../service/file-service');

const PUBLIC_KEY_FILE_PATH = process.env.PUBLIC_KEY_FILE_PATH;

const sign = async (req, res, next) => {
    try {
        const filename = req.body.filename || 'signed_document';
        const pdf = fs.readFileSync(req.files.pdf.path);//req.body.pdf;
        const p12 = fs.readFileSync(req.files.p12.path);//req.body.p12;
        const password = req.body.password;
        const signedPDF = await service.sign(pdf, p12, password);
        res.setHeader('Content-Length', signedPDF.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename + '.pdf');
        res.status(200).send(signedPDF);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    } finally {
        spawnSync('rm', [ '-rf', req.files.pdf.path, req.files.p12.path ]);
    }
}

const verify = async (req, res, next) => {
    try {
        const pdf = fs.readFileSync(req.files.pdf.path);//req.body.pdf;
        const verifiedString = await service.verify(pdf);
        res.status(200).send(verifiedString);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    } finally {
        spawnSync('rm', [ '-rf', req.files.pdf.path ]);
    }
}

const getPublicKey = async (req, res, next) => {
    try {
        const publicKey = await FileService.readFile(PUBLIC_KEY_FILE_PATH);
        const result = publicKey.toString('utf8');
        res.setHeader('Content-Length', result.length);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    sign,
    verify,
    getPublicKey
}