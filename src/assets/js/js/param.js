//restricts if it runs outside an iFrame
if (window.location.href == window.top.location.href) {
    throw new Error('Forbidden' | translate);
}

(function () {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);

    window.params = params;
})();

window.selectedIcon = params.selectedIcon;

if (window.selectedIcon) {
    try {
        window.selectedIcon = window.selectedIcon.split('')[0].toUpperCase() + window.selectedIcon.replace(window
            .selectedIcon.split('').shift(1), '');
    } catch (e) {
        window.selectedIcon = 'Pencil';
    }
} else {
    window.selectedIcon = 'Pencil';
}

var script = document.createElement('script');
script.src = params.widgetJsURL || 'https://www.webrtc-experiment.com/Canvas-Designer/widget.js';
(document.body || document.documentElement).appendChild(script);