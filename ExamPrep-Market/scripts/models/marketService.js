let marketService=(()=>{
    
    function getProducts() {
        return remote.get('appdata','products','kinvey');
    }
    function getUser() {
        let endPoint=localStorage.getItem('id');
        return remote.get('user',endPoint,'kinvey');
    }
    function updateUser(userInfo) {
        let endPoint=localStorage.getItem('id');
        return remote.update('user',endPoint,userInfo,'kinvey')
    }
    function getProduct(productId) {
        return remote.get('appdata','products/'+productId,'kinvey');
    }
    return {
        getProducts,
        getUser,
        getProduct,
        updateUser,
    }
})();