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

    function EmptyList() {
        $('ul#filemanager').children().each((i, c) => {
            $(c).empty();
            $(c).remove();
        });
    }

    let LastUP;

    function RenderList(records) {
        // if (records[0].IsDirectory) {
        //     LastUP = records[0].Up;
        //     let dom = `<li class="bi bi-folder" style="list-style: none;" data-type="d" data-up=".." data-path="${records[0].Up}/..">..</li>`;
        //     $('ul#filemanager').append(dom);
        // } else {
        //     let dom = `<li class="bi bi-folder" style="list-style: none;" data-type="d" data-up=".." data-path="${LastUP}/..">..</li>`;
        //     $('ul#filemanager').append(dom);
        // }
        let dom = `<li class="bi bi-folder" style="list-style: none;" data-type="d" data-up=".." data-path="${records[0].Up}">..</li>`;
        $('ul#filemanager').append(dom);
        for (let r in records) {
            let entry = records[r];
            // console.log({ r, entry }, entry.name, entry.type);
            if (entry.IsDirectory) {
                dom = `<li class="bi bi-folder" style="list-style: none;" data-path="${entry.Path}" data-type="d">${entry.Name}</li>`;
            } else {
                dom = `<li class="bi bi-file" style="list-style: none;"  data-path="${entry.Path}" data-type="f">${entry.Name}</li>`;
            }
            $('ul#filemanager').append(dom);
        }
    }

    $(document).on('click', function (ev) {
        ev.preventDefault();
        let elem = ev.target;
        let data = $(elem).data();
        if (data.type === 'd') {
            $.get('/files', { path: data.path }, function (s, g) {
                EmptyList();
            }).done(d => {
                if (d?.records) {
                    let records = d.records;
                    RenderList(records);
                }
            }).fail(f => {
                console.log({ f });
            });
        }
    });

    
    $('button#home').on('click', function () {
        // SEE/EXPECT QUERY CONTENT
        $.get('/files', {id: 1, action: 'list'}, function (data) {
            console.log({ data });
            // clear all children from ul#filemanager
            $('ul#filemanager').children().each((i, c) => {
                $(c).empty();
                $(c).remove();
            });
        }).done(data => {
            console.log({ data });
            // let up = data?.up;
            let records = data?.records;
            // // then 
            RenderList(records);
        }).fail(f => { console.log({ f }) });
    });
    // list item clicks
});
