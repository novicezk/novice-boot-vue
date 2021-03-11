import rest from './rest'

export default {
    maxsize: () => {
        return rest.get('/tk.File/maxsize');
    },
    generateViewUrl: (id, scale) => {
        let url = process.env.BACKEND_URL + "/tk.File/" + id + "/view";
        if (scale) {
            return url + "?scale=" + scale;
        }
        return url;
    },
    generateDownloadUrl: (id) => {
        return process.env.BACKEND_URL + "/tk.File/" + id + "/download";
    },
    uploadUrl: () => {
        return process.env.BACKEND_URL + "/tk.File/upload";
    },
}