import rest from './rest'

export default {
    list: () => {
        return rest.get('/us.Role/list');
    },
    remove: (id) => {
        return rest.delete('/us.Role/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/us.Role/create', data);
    },
    update: (id, data) => {
        return rest.put('/us.Role/' + id + '/update', data);
    },
}