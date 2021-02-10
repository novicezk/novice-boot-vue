import syncRequest from './sync-request'

export default {
    loadEnum: (className) => {
        return syncRequest({ url: '/core.System/' + className + '/enum-values' });
    }
}