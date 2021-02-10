import rest from './rest'

export default {
    list: (typeId) => {
        return rest.get('/dm.Business/' + typeId + '/list');
    },
    remove: (id) => {
        return rest.delete('/dm.Business/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/dm.Business/create', data);
    },
    update: (id, data) => {
        return rest.put('/dm.Business/' + id + '/update', data);
    },
}