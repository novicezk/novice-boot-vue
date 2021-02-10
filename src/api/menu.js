import rest from './rest'
import syncRequest from './sync-request'

export default {
    filterTree: (name) => {
        return rest.get('/tk.Menu/' + name + '/tree');
    },
    list: () => {
        return rest.get('/tk.Menu/list');
    },
    remove: (id) => {
        return rest.delete('/tk.Menu/' + id + '/delete-node');
    },
    create: (data, parentId) => {
        var url = '/tk.Menu/create-node';
        if (parentId) {
            url += '?parentId=' + parentId;
        }
        return rest.post(url, data);
    },
    update: (id, data) => {
        return rest.put('/tk.Menu/' + id + '/update-node', data);
    },
    view: (id) => {
        return syncRequest({ url: '/tk.Menu/' + id + '/view-node' });
    },
}