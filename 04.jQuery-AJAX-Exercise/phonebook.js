$(function attachEvents() {
    const baseUrl="https://phonebook-bd0e8.firebaseio.com/phonebook";
    const output=$('#phonebook');
    output.empty();
    $('#btnCreate').on('click',createContact);
    loadContacts();

    function loadContacts() {
        output.empty();
        let req={
            url:baseUrl+".json",
            success:displayContacts
        };
        $.ajax(req);
    }
    function createContact() {
        let person=$('#person').val();
        let phone=$('#phone').val();
        if(person.length===0){
            notify("The name can not be empty");
            return;
        }
        if(phone.length===0){
            notify("The phone can not be empty");
            return;
        }
        $('#btnCreate').prop('disabled',true);
        let contact={
            person: $('#person').val(),
            phone: $('#phone').val(),
        };

        let req={
            url:baseUrl+".json",
            method:"POST",
            data:JSON.stringify(contact),
            success : ()=> {
                $('#person').val('');
                $('#phone').val('');
                loadContacts
            },
            error:displayError,
            complete:()=> $('#btnCreate').prop('disabled',false)
        };
        $.ajax(req);

    }
    function displayError(err) {
        notify('Error: '+err.status);
    }
    function notify(message) {
        let toast=document.getElementById("notification");
        toast.textContent=message;
        toast.style.display="block";
        setTimeout(()=>toast.style.display="none",2000)

    }
    function displayContacts(data) {
        $('#btnLoad').on('click',function () {
            output.empty();
            for(let contacts in data){
                let html=$(`<li><span>${data[contacts].person} : ${data[contacts].phone}</span></li>`);
                html.append($(`<button>Delete</button>`).click(()=>deleteContact(contacts)));
                output.append(html);
            }

        })
    }
    function deleteContact(contact) {
        let req={
            url:`${baseUrl}/${contact}.json`,
            method:"DELETE",
            success:loadContacts,
            error:displayError
        }
        $.ajax(req);
    }
});