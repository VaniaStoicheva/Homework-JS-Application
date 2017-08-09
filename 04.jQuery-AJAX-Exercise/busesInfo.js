function getInfo() {
    let list=$('#buses');
    list.empty();
    let stopId=$('#stopId').val();
    let req={
        url:`https://judgetests.firebaseio.com/businfo/${stopId}.json`,
        method:"GET",
        success:printInfo,
        error:printError

    }
    $.ajax(req);
    function printInfo(data) {
            let stopName=$('#stopName');
            stopName.text(data.name);
            let busesInfo=data.buses;
            for(let buseNumber in busesInfo){
                let liItem=$('<li>');
                liItem.text(`Bus ${buseNumber} arrives in ${busesInfo[buseNumber]} minutes`);
                list.append(liItem);
            }
    }
    function printError(err){
        $('#stopName').text("Error");
    }
}