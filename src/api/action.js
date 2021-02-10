import rest from './rest'

export default {
    list: (typeId) => {
        return rest.get('/dm.Action/' + typeId + '/list');
    }
}