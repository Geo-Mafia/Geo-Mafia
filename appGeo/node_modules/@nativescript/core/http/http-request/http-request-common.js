export function getFilenameFromUrl(url) {
    const fs = require('../../file-system');
    const slashPos = url.lastIndexOf('/') + 1;
    const questionMarkPos = url.lastIndexOf('?');
    let actualFileName;
    if (questionMarkPos !== -1) {
        actualFileName = url.substring(slashPos, questionMarkPos);
    }
    else {
        actualFileName = url.substring(slashPos);
    }
    const result = fs.path.join(fs.knownFolders.documents().path, actualFileName);
    return result;
}
//# sourceMappingURL=http-request-common.js.map