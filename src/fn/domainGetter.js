
function domainGetter(path) {
    if (window.location !== undefined) {
        let lpath = '';
        if (path !== undefined) {
            lpath = path;
        }
        if (window.location.host.split(':')[0] == 'localhost') {
            return 'http://localhost:3000/api' + lpath;
        } else {
            return 'https://gallek-api.vercel.app//api' + lpath;
        }
    } else {
        return '';
    }
}
export default domainGetter;