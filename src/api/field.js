import rest from './rest'

export default {
    list: (typeId) => {
        return rest.get('/dm.Field/' + typeId + '/list');
    },
    remove: (id) => {
        return rest.delete('/dm.Field/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/dm.Field/create', data);
    },
    update: (id, data) => {
        return rest.put('/dm.Field/' + id + '/update', data);
    },
}