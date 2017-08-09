let result=(function solve() {
    let currentId='depot';
    let oldName='';
    function depart() {
        let req={
            url:`https://judgetests.firebaseio.com/schedule/${currentId}.json`,
            method:"GET",
            success: departBus,
            error:displayErrors,
        }
        $.ajax(req);
    }
    function departBus(data) {
        let name=data.name;
        $('#info').find('span').text(`Next stop ${name}`);
        currentId=data.next;
       $('#depart').prop("disabled",true);
       $('#arrive').prop("disabled",false);
       oldName=name;
    }
    function arrive() {
        $('#info').find('span').text(`Arriving at ${oldName}`);
        $('#depart').prop("disabled",false);
        $('#arrive').prop("disabled",true);
    }
    function displayErrors() {
        $('#info').find('span').text("Error");
        $('#depart').prop("disabled",true);
        $('#arrive').prop("disabled",true);
    }
    return {
        depart,
        arrive
    };
})();