import rest from './rest'

export default {
    loadModules: () => {
        return rest.get('/dm.Meta/modules/load');
    },
    loadDataTypes: () => {
        return rest.get('/dm.Meta/data-types/load');
    },
    executeAction: (typeId, actionName, data = {}) => {
        return rest.post(`/dm.Action/${typeId}/${actionName}/execute`, data);
    },
}