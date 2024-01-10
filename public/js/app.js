$(function () {
    console.log(`READY`);
    // OK: req.query contains params in JSON format
    $('#getlink1').on('click', function (ev) {
        $.get('/api1', {id: 1, name: "titi"}, function (data) {
            console.log({ data });
        }).done((d) => {
            console.log({ d });
        }).fail((f) => {
            console.log({ f });
        });
    });
    //
    $('#getlink2').on('click', function (ev) {
        $.get('/api2/1/titi', function (data) {
            console.log({ data });
        }).done((d) => {
            console.log({ d });
        }).fail((f) => {
            console.log({ f });
        });
    });
    // OK: req.body contains params
    $('#postlink1').on('click', function (ev) {
        $.post('/api1', { id: 1, name: "titi" }, function (data) {
            console.log({ data });
        }).done((d) => {
            console.log({ d });
        }).fail((f) => {
            console.log({ f });
        });
    });
    // wrong
    // $('#postlink2').on('click', function (ev) {
    //     $.post('/api2/:id?/:name?', function (data) {
    //         console.log({ data });
    //     }, 'json').done((d) => {
    //         console.log({ d });
    //     }).fail((f) => {
    //         console.log({ f });
    //     });
    // });
});
