UTest({
    $config: {
        'http.process': {
            command: 'atma custom examples/index',
            matchReady: '/Listen /'
        }
    },

    $before: function(next){
        UTest
            .server
            .request('http://localhost:5771/define')
            .done(next);
    },

    'counter: click to increment model and update the ui' (done, doc, win) {
        UTest
            .domtest(doc.body, `
                find('li[name=counter]') {
                    find ('i') > text 0;
                    find ('button') > do click;
                    find ('i') > text 1;
                }
            `)
            .always(() => done(doc, win));
    },
    'fooos: clickable' (done, doc, win) {
        UTest
            .domtest(doc.body, `
                find('li[name=foos] > section[name=clickable] > .container') {

                    text ('');
                    do click;
                    text ('foo');
                }
            `)
            .always(() => done(doc, win));
    },
    'fooos: pressable' (done, doc, win) {
        UTest
            .domtest(doc.body, `
                find('li[name=foos] > section[name=pressable] > input') {

                    val ('');

                    do keydown a;
                    val ('foo');

                    do keydown b;
                    do keydown c;
                    val ('foofoofoo');
                }
            `)
            .always(() => done(doc, win));
    }
})
