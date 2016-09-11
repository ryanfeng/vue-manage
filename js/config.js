require.config({
    paths: {
        //插件
        dateTimePicker: '/js/plugIn/jquery.datetimepicker.full.min',
        numRun: '/js/plugIn/animateBackground-plugin',
        selectordie: './plugIn/selectordie.min',
        underscore: './plugIn/underscore-min',
        jquery: './plugIn/jquery-1.11.3.min',
        echarts: '/js/plugIn/echarts.min',
        text: './plugIn/require.text',
        Vue: './plugIn/vue',
        md5: './plugIn/md5',

        //公用js
        publicHtml: './public/publicHtml',
        component: "./public/component",
        ajaxAPI: "./public/ajaxAPI",
        Check: './public/Check',
        RegEx: "./public/RegEx",
        Tool: './public/Tool',
        base: './public/base',
        form: './public/form'
    },
    shim: {
        'jquery': {
            exports: 'jquery'
        },
        'template': {
            exports: 'template'
        }
    },
    waitSeconds: 0
});