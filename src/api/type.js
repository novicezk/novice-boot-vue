import rest from './rest'

export default {
    list: (moduleId) => {
        return rest.get('/dm.Type/' + moduleId + '/list');
    },
    superTree: (moduleId) => {
        return rest.get('/dm.Type/' + moduleId + '/super-tree');
    },
    remove: (id) => {
        return rest.delete('/dm.Type/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/dm.Type/create', data);
    },
    update: (id, data) => {
        return rest.put('/dm.Type/' + id + '/update', data);
    },
}