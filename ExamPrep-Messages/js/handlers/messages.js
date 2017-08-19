handlers.messages=function (ctx) {
    util.getUser(ctx);
    let content=util.getPartials('myMessages');
    content.message='./templates/common/message.nbs';
    ctx.loadPartials(content).then(function () {
        ctx.partials=this.partials;
        ctx.partial('./templates/common/main.nbs').then(()=>{
            let url=`messages?query={"recipient_username":"${localStorage.getItem('username')}"}`;
            remote.get('appdata',url).then((messages)=>{
                ctx.messages=messages;
                ctx.render('./templates/common/messageList.nbs').then(function () {
                    this.replace('#myMessages');
                })
            }).catch(notifications.handleError);
        })
    })
};
handlers.send=function (ctx) {
    util.getUser(ctx);
    //get user from database and push to select
    remote.get('user','').then(userList=>{
        ctx.userList=userList;
        ctx.loadPartials(util.getPartials('sendMessage')).then(function () {
            ctx.partials=this.partials;
            ctx.partial('./templates/common/main.nbs')
        });
    }).catch(notifications.handleError);

};
//archive messages
handlers.archive=function () {
    util.getUser(this);
    let url=`messages?query={"sender_username":"${localStorage.getItem('username')}"}`;
    remote.get(
        'appdata', url).then((messages)=>{
        //console.log(messages);
        this.messages=messages;
            this.loadPartials(util.getPartials('archiveSend')).then(function () {
                this.partial('./templates/common/main.nbs').then(()=>{
                    $('button').click((e)=>{
                        let id=$(e.target).attr('data-id');
                        //console.log(id);
                        remote.del('appdata','messages/'+id).then(()=>{
                            notifications.showInfo("Message deleted");
                            //parent-coll,parent-row
                            $(e.target).parent().parent().remove();
                        }).catch(notifications.handleError);
                    })
                })
            })
        }).catch(notifications.handleError);

};
//send message
handlers.sendAction=function (ctx) {
//console.log(this.params);
    let message={
        sender_username:localStorage.getItem('username'),
        sender_name:localStorage.getItem('name'),
    recipient_username:this.params.recipient,
        text:this.params.text,
    };
    remote.post('appdata','messages',message).then((resp)=>{
        notifications.showInfo('Message send');
        ctx.redirect('#/archive');
    }).catch(notifications.handleError);
};