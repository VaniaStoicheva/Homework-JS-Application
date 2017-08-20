function startApp() {

    const app=Sammy('#app',function () {
        this.use('Handlebars','hbs');

        $(document).on({
            ajaxStart: function () {
                $("#loadingBox").show();
            },
            ajaxStop: function () {
                $("#loadingBox").hide();
            }
        });

        this.get('market.html',displayHome);
        this.get('#/home',displayHome);

        function displayHome(ctx) {
            ctx.isAnonymous=localStorage.getItem('username')===null;
            ctx.username=localStorage.getItem('username');
            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs',
                home:'./templates/home/home.hbs'
            }).then(function () {
                this.partial('./templates/home/homePage.hbs')
            })
        }

        this.get('#/login',function (ctx) {
            ctx.isAnonymous=localStorage.getItem('username')===null;
            ctx.username=localStorage.getItem('username');
            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs',
                loginForm:'./templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs')
            })
        });
        this.post('#/login',function (ctx) {
            //console.log(ctx.params);
            let username=ctx.params.username;
            let password=ctx.params.password;
            auth.login(username,password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Login successful!')
                    displayHome(ctx);
                }).catch(auth.handleError);
        });

        this.get('#/register',function (ctx) {
            ctx.isAnonymous=localStorage.getItem('username')===null;
            ctx.username=localStorage.getItem('username')
            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs',
                registerForm:'./templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs')
            }).catch(auth.handleError);
        });
        this.post('#/register',function (ctx) {
            let username=ctx.params.username;
            let password=ctx.params.password;
            let name=ctx.params.name;
            
            auth.register(username,password,name)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('User register successful!');
                    displayHome(ctx);
                }).catch(auth.handleError);
        });

        this.get('#/logout',function (ctx) {
            auth.logout()
                .then(function () {
                    localStorage.clear();
                    auth.showInfo('Logout successful!')
                    displayHome(ctx);
                }).catch(auth.handleError)
        });

        this.get('#/shop',function (ctx) {
            ctx.isAnonymous=localStorage.getItem('username')===null;
            ctx.username=localStorage.getItem('username');

            marketService.getProducts()
                //render all products
                .then(function (products) {
                    for(let pr of products){
                        pr['price']=Number(pr['price']).toFixed(2);
                    }

                    ctx.products=products;

                    ctx.loadPartials({
                        header:'./templates/common/header.hbs',
                        footer:'./templates/common/footer.hbs',
                        product:'./templates/shop/product.hbs'
                    }).then(function () {
                        this.partial('./templates/shop/shopTable.hbs')
                        //purchase product
                            .then(function () {
                                let btn=$('button');
                                btn.click(function () {
                                    let productId=$(this).attr('data-id')
                                    purchaseProduct(productId)
                                })
                            })
                    })
                }).catch(auth.handleError);

            function purchaseProduct(productId) {
                //console.log(productId);
                marketService.getProduct(productId)
                    .then(function (product){

                        marketService.getUser()
                            .then(function (userInfo) {
                                //console.log(userInfo);
                                let cart;
                                if(userInfo['cart']===undefined){
                                    cart={};
                                }else {
                                    cart=userInfo['cart'];
                                }
                                //has already purchase that product->+1
                                if(cart.hasOwnProperty(productId)){
                                    cart[productId]={
                                        quantity:Number(cart[productId]['quantity'])+1,
                                        product:{
                                            name:product['name'],
                                            description:product['description'],
                                            price:product['price'],
                                        }
                                    }
                                }else{
                                    cart[productId]={
                                        quantity: 1,
                                        product:{
                                            name:product['name'],
                                            description:product['description'],
                                            price:product['price'],
                                        }
                                    }
                                }

                                userInfo.cart=cart;
                                marketService.updateUser(userInfo)
                                    .then(function (userInfo) {
                                        auth.showInfo("Product has been purchased")
                                    })
                            })

                    }).catch(auth.handleError);

            }
        });

        this.get('#/cart',displayCart);

            function displayCart(ctx) {
            ctx.isAnonymous=localStorage.getItem('username')===null;
            ctx.username=localStorage.getItem('username');

            marketService.getUser()
                .then(function (userInfo) {
                    let cart=userInfo.cart;

                    let products=[];
                    let keys=Object.keys(cart);
                    for(let id of keys){
                        let product={
                            _id:id,
                            name:cart[id]['product']['name'],
                            description:cart[id]['product']['description'],
                            quantity:cart[id]['quantity'],
                            totalPrice:Number(cart[id]['quantity'])*Number(cart[id]['product']['price'])
                        }
                        products.push(product);
                    }
                    ctx.products=products;

                    ctx.loadPartials({
                        header:'./templates/common/header.hbs',
                        footer:'./templates/common/footer.hbs',
                        product:'./templates/cart/cartProduct.hbs'
                    }).then(function () {
                        this.partial('./templates/cart/cartTable.hbs')
                            .then(function () {

                                $('button').click(function () {
                                    let productId=$(this).attr('data-id');
                                    discardProduct(productId);
                                })

                            })
                    }).catch(auth.handleError);

                    function discardProduct(productId) {
                        //console.log(productId);
                        //get cart
                        marketService.getUser()
                            .then(function (userData) {
                                let cart=userData.cart;

                                let quantity=Number(cart[productId]['quantity'])-1;
                                if(quantity===0){
                                    delete cart[productId];
                                }else{
                                    cart[productId]['quantity']=quantity;
                                }
                                userData[cart]=cart;

                                marketService.updateUser(userData)
                                    .then(function () {
                                        auth.showInfo('Product discard');
                                        displayCart(ctx);
                                    })
                            })
                    }

                });


        }


    }).run();
};