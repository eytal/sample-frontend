var events_log = {};

$(document).ready(function() {
    populateAPI();
    //$("#nonce").val(makeid(12));
    //Generate a nonce string to validate returned http response
    $("#js_generate_nonce").on("click", (event) => {
        event.preventDefault();
        $("#nonce").val(makeid(12));
    });

    $("#js_post").on("click", (event) => {
        event.preventDefault();
        var targetURL = $("#urlInput").val();
        updatePostEvent(targetURL);
    });
    setInterval(checkReceivedMessages, 500);
});


// Update page for event
function updatePostEvent(targetURL) {

    $("#js_post").html('<div class="spinner-border text-light"></div>');
    var post_data = {
        "origin": window.location.protocol + "//" + window.location.host,
        "destination": targetURL,
        "nonce": "" + $("#nonce").val()
    };

    $.ajax({
        url: targetURL + "/api/post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(post_data),
        success: function(result) {
            console.log(result);
            updateHttpEvent("success", targetURL, result);
        },
        error: function(error) {
            console.log(error);
            updateHttpEvent("failure", targetURL, error);
        }
    })
}

function updateHttpEvent(action, targetURL, data) {
    var today = new Date();
    var time = pad(today.getHours()) + ":" + pad(today.getMinutes()) + ":" + pad(today.getSeconds());
    $("#js_post").html('Send');
    var message;
    var statusClass;
    if (action == "success") {
        message = `<div class="card bg-success text-white mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Message Success</h5>
                            <p class="card-text">` + data + `</p>
                            <p class="card-text">
                                <span><b>Receiver:</b> ` + targetURL + `</span>
                                <span class="float-right"><b>` + time + `</b></span>
                            </p>
                        </div>
                    </div>`;

    } else if (action == "received") {
        message = `<div class="card event-received text-white mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Message Received</h5>
                            <p class="card-text">` + data + `</p>
                            <p class="card-text">
                                <span><b>Sender:</b> ` + targetURL + `</span>
                                <span class="float-right"><b>` + time + `</b></span>
                            </p>
                        </div>
                    </div>`;

    } else {
        message = `<div class="card bg-danger text-white mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Message Failure</h5>
                            <p class="card-text">Unable to deliver message, destination host is unreachable.</p>
                            <p class="card-text">
                                <span><b>Receiver:</b> ` + targetURL + `</span>
                                <span class="float-right"><b>` + time + `</b></span>
                            </p>
                        </div>
                    </div>`;
    }
    $("#js_events_parent").prepend(message);
}

function checkReceivedMessages() {
    $.ajax({
        url: "/api/retrieve",
        type: "GET",
        dataType: "json",
        async: true,
        success: function(result) {
            if (result["valid"]) {
                console.log(result);
                showNotification(result);
            }
        },
        error: function(error) {
            //console.log("no_messages", error);
        }
    })
}

function showNotification(data) {
    $("#js_post_origin").html(data["origin"]);
    $("#js_post_message").html(data["nonce"]);
    $('#js_post_toast').toast('show');
    updateHttpEvent("received", data["origin"], data["nonce"]);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function pad(n) { return n < 10 ? '0' + n : n }

function populateAPI() {
    var apiString = window.location.protocol + "//" + window.location.host;
    $("#apiURL").html(apiString);
    //$("#urlInput").val(apiString);
}