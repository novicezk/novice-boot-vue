import rest from './rest'

export default {
    maxsize: () => {
        return rest.get('/tk.File/maxsize');
    },
    generateViewUrl: (id, scale) => {
        let url = "/backend/tk.File/" + id + "/view";
        if (scale) {
            return url + "?scale=" + scale;
        }
        return url;
    },
    generateDownloadUrl: (id) => {
        return "/backend/tk.File/" + id + "/download";
    },
    uploadUrl: () => {
        return "/backend/tk.File/upload";
    },
}