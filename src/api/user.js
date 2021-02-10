import rest from './rest'
import syncRequest from './sync-request'

export default {
    search: (params) => {
        return rest.get('/us.User/search', { params: params });
    },
    remove: (id) => {
        return rest.delete('/us.User/' + id + '/delete');
    },
    create: (data) => {
        return rest.post('/us.User/create-user', data);
    },
    update: (id, data) => {
        return rest.put('/us.User/' + id + '/update', data);
    },
    view: (id) => {
        return rest.get('/us.User/' + id + '/view');
    },
    resetPassword: (id) => {
        return rest.post('/us.User/' + id + '/reset-password');
    },
    shouldShowCaptcha: (username) => {
        return rest.get('/us.User/should-show-captcha?username=' + username);
    },
    login: (params) => {
        return rest.request({
            method: 'post', url: '/login', params: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    },
    getCurrentUser: () => {
        return syncRequest({ url: '/us.User/current' });
    },
    updateCurrent: (data) => {
        return rest.put('/us.User/update-current', data);
    },
    logout: () => {
        return rest.get('/logout');
    }
}