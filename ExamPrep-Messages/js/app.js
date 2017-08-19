const handlers={};
const util={};
$(()=>{
    util.getPartials=function (page) {
        return {
            header: './templates/common/header.nbs',
            footer: './templates/common/footer.nbs',
            page: `templates/${page}.nbs`
        }
    };
    util.getUser=function (ctx) {
        ctx.username=localStorage.getItem('username');
    };

    const app=Sammy('#app',function () {
        this.use('Handlebars','nbs');

        this.get('index.html',handlers.home);

        this.get('#/login',handlers.login);
        this.post('#/login',handlers.loginAction);

        this.get('#/register',handlers.register);
        this.post('#/register',handlers.registerAction);

        this.get('#/messages',handlers.messages);

        this.get('#/archive',handlers.archive);

        this.get('#/send',handlers.send);
        this.post('#/send',handlers.sendAction);

        this.get('#/logout',function (ctx) {
            auth.logout().then(()=>{
                localStorage.clear();
                notifications.showInfo('Logout successful!');
                ctx.redirect('#');
            })
        });
    }).run();

});