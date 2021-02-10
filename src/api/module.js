import rest from './rest'

export default {
    list: () => {
        return rest.get('/dm.Module/list');
    },
    remove: (id) => {
        return rest.delete('/dm.Module/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/dm.Module/create', data);
    },
    update: (id, data) => {
        return rest.put('/dm.Module/' + id + '/update', data);
    },
}