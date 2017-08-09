function attachEvents() {
    $('#refresh').click(attachRefresh);
    $('#submit').click(attachSend);
    function attachSend() {
        let messageJason={
            "author":$('#author').val(),
            "content":$('#content').val(),
            "timestamp":Date.now()
        };
        let sendMessageReq={
            url:"https://messenger-2bdaf.firebaseio.com/messenger/.json",
            method:"POST",
            data:JSON.stringify(messageJason),
            success:attachRefresh
        }
        $.ajax(sendMessageReq);
    }
    function attachRefresh() {
        let req={
            url:"https://messenger-2bdaf.firebaseio.com/messenger/.json",
            method:"GET",
            success:displayMessages
        }
        $.ajax(req);
    }

    function displayMessages(messages) {
       let output= $('#messages');
       let message='';
       for(let key in messages){
           message+=`${messages[key]["author"]}: ${messages[key]["content"]}\n`;
       }
       output.text(message);

    }
}