import rest from './rest'

export default {
    list: (typeId) => {
        return rest.get('/dm.View/' + typeId + '/list');
    },
    remove: (id) => {
        return rest.delete('/dm.View/' + id + '/delete');
    },
    createDetailView: (data) => {
        return rest.post('/dm.View/create-detail-view', data);
    },
    createListView: (data) => {
        return rest.post('/dm.View/create-list-view', data);
    },
    update: (id, data) => {
        return rest.put('/dm.View/' + id + '/update', data);
    },
}