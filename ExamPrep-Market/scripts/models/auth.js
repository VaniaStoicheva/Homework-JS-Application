let auth = (() => {
    function isAuthed() {
        return localStorage.getItem('authtoken') !== null;
    }

    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.name);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
    }
    /*function saveSession(userInfo) {
        let id = userInfo['_id'];
        let username = userInfo['username'];
        let name = userInfo['name'];
        let authtoken = userInfo['_kmd']['authtoken'];

        sessionStorage.setItem('id', id);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('authtoken', authtoken);
    }*/

    function login(username, password) {
        return remote.post('user', 'login', {username, password}, 'basic');
    }

    async function register(username, password, name) {
        return remote.post('user', '', {username, password, name}, 'basic');
    }

    async function logout() {
        return remote.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')});
    }
    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    return {
        saveSession, login, register, logout, isAuthed, showInfo, handleError
    }
})();