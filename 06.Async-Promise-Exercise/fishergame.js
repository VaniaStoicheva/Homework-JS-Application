function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_SkDWeiKIW';
    const kinveyUser = 'vania';
    const kinveyPass = 'v';
    const base64auth = btoa(kinveyUser + ":" + kinveyPass);
    const base64auth1 = btoa('vania:v');
    const authHeader =
        {
            "Authorization": "Basic " + base64auth1,
            'Content-type': 'application/json'
        };

    $('.load').click(loadAllCatches);
    $('.add').click(createCatch);

    function createCatch() {
        let catchEl = $(this).parent();
        let dataObj = createDataJson(catchEl);
        request('POST', `/biggestCatches`, dataObj)
            .then(loadAllCatches)
            .catch(handleError);
    }

    function loadAllCatches() {
        request('GET', '/biggestCatches')
            .then(displayAllCatches)
            .catch(handleError)
    }

    function displayAllCatches(data) {
        let catchesEl = $('#catches');
        catchesEl.empty();
        for (let el of data) {
            catchesEl.append($(`<div class="catch" data-id="${el._id}">`)
                .append($('<label>').text('Angler'))
                .append($(`<input type="text" class="angler" value="${el["angler"]}"/>`))
                .append($('<label>').text('Weight'))
                .append($(`<input type="number" class="weight" value="${el["weight"]}"/>`))
                .append($('<label>').text('Species'))
                .append($(`<input type="text" class="species" value="${el["species"]}"/>`))
                .append($('<label>').text('Location'))
                .append($(`<input type="text" class="location" value="${el["location"]}"/>`))
                .append($('<label>').text('Bait'))
                .append($(`<input type="text" class="bait" value="${el["bait"]}"/>`))
                .append($('<label>').text('Capture Time'))
                .append($(`<input type="number" class="captureTime" value="${el["captureTime"]}"/>`))
                .append($('<button class="update">Update</button>').click(updateCatch))
                .append($('<button class="delete">Delete</button>').click(deleteCatch)))
        }
    }

    function updateCatch() {
    let catchEl=$(this).parent();
    let dataObj=createDataJson(catchEl);
    request('PUT',`/biggestCatches/${catchEl.attr('data-id')}`,dataObj)
        .then(loadAllCatches)
        .catch(handleError)
    }
    function createDataJson(catchEl) {
        return {
            angler:catchEl.find('.angler').val(),
            weight:+catchEl.find('.weight').val(),
            species:catchEl.find('.species').val(),
            location:catchEl.find('.location').val(),
            bait:catchEl.find('.bait').val(),
            captureTime:+catchEl.find('.captureTime').val()
        }
    }
    function deleteCatch() {
        let catchEl=$(this).parent();
        request('DELETE',`/biggestCatches/${catchEl.attr('data-id')}`)
            .then(loadAllCatches)
            .catch(handleError)

    }
    function handleError() {
        alert('ERROR');
    }
    function request(method,endpoint,data) {
        return $.ajax({
            method:method,
            url:baseUrl+endpoint,
            headers:authHeader,
            data:JSON.stringify(data)
        })
    }
}