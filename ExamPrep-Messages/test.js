$(()=>{
    //let source=`<h1>Hello {{name}}</h1>`;
    //let template=Handlebars.compile(source);
    let context={
        name:'Peter'
    };
    //prezapisva staroto
    //$('#main').html(template(context));
    //dobavia
    /*let el=document.getElementById('main');
    el.innerHTML+=template(context);
    el.innerHTML+=template({name:'Maria'});
    el.innerHTML+=template({name:'Eva'});
    el.innerHTML+=template({name:'Iva'});*/

    const app=Sammy('#main',function () {
        this.use('Handlebars','nbs');

        this.get('test.html',function () {
            this.name='Mira';
            this.partial('./templates/greeting.nbs');
        })
    });
    app.run();
});