import rest from './rest'

export default {
    list: () => {
        return rest.get('/dm.Listener/list');
    },
    remove: (id) => {
        return rest.delete('/dm.Listener/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/dm.Listener/create', data);
    },
    update: (id, data) => {
        return rest.put('/dm.Listener/' + id + '/update', data);
    },
}