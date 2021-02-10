import rest from './rest'
import syncRequest from './sync-request'

export default {
    list: () => {
        return rest.get('/tk.Category/list');
    },
    select: () => {
        return rest.get('/tk.Category/select');
    },
    remove: (id) => {
        return rest.delete('/tk.Category/' + id + '/delete-node');
    },
    create: (data, parentId) => {
        var url = '/tk.Category/create-node';
        if (parentId) {
            url += '?parentId=' + parentId;
        }
        return rest.post(url, data);
    },
    update: (id, data) => {
        return rest.put('/tk.Category/' + id + '/update-node', data);
    },
    view: (id) => {
        return syncRequest({ url: '/tk.Category/' + id + '/view-node' });
    },
    loadCategory: (setId) => {
        return syncRequest({ url: '/tk.Category/' + setId + '/values' });
    }
}