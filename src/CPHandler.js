
const browser = {
    'opera': {
        'name': 'opera',
        'alertW': 0,
        'alertH': 0
    },
    'firefox': {
        'name': 'firefox',
        'alertW': 453,
        'alertH': 279
    },
    'safari': {
        'name': 'safari',
        'alertW': 0,
        'alertH': 0
    },
    'IE': {
        'name': 'IE',
        'alertW': 0,
        'alertH': 0
    },
    'samsung': {
        'name': 'samsung',
        'alertW': 0,
        'alertH': 0
    },
    'edge': {
        'name': 'edge',
        'alertW': 0,
        'alertH': 0
    },
    'edgeChromium': {
        'name': 'edgeChromium',
        'alertW': 570,
        'alertH': 129
    },
    'chrome': {
        'name': 'chrome',
        'alertW': 500,
        'alertH': 125
    },
    'unknown': {
        'name': 'unknown',
        'alertW': 0,
        'alertH': 0
    }
}

const openUriRsult = {
    'success': 'success',
    'cancel': 'cancel',
    'unsupport': 'unsupport'
}

function delectBrowser() {

    // cache to avoid run more than one time
    if (delectBrowser.prototype._cachedBrowser)
        return delectBrowser.prototype._cachedBrowser;

    const sUsrAg = navigator.userAgent;
    let result;

    // // Opera 8.0+
    // var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // passed

    // // Firefox 1.0+
    // var isFirefox = typeof InstallTrigger !== 'undefined'; // pasesed

    // // Safari 3.0+ "[object HTMLElementConstructor]" 
    // var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    // // Internet Explorer 6-11
    // var isIE = /*@cc_on!@*/false || !!document.documentMode; // not tested

    // // Edge 20+
    // var isEdge = !isIE && !!window.StyleMedia; // passed

    // // Chrome 1 - 79
    // var isChrome = sUsrAg.indexOf("Chrome") > -1;

    // // Edge (based on chromium) detection
    // var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1); // failure

    if (sUsrAg.indexOf("Firefox") > -1) {
        result = browser.firefox;
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
        result = browser.samsung;
        // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        result = browser.opera;
        // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf("Trident") > -1) {
        result = browser.IE;
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf("Edge") > -1) {
        result = browser.edge;
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf("Edg") > -1 && sUsrAg.indexOf("Chrome") > -1) {
        result = browser.edgeChromium;
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf("Chrome") > -1) {
        result = browser.chrome; //"Google Chrome or Chromium";
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf("Safari") > -1) {
        result = browser.safari;
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
        result = browser.unknown;
    }

    return delectBrowser.prototype._cachedBrowser = result;
}

function launchInIEnME(uri, onResult) {
    if (navigator.msLaunchUri) {
        // This proprietary method is specific to Internet Explorer,
        // and Microsoft Edge versions 18 and lower.
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/msLaunchUri
        navigator.msLaunchUri(uri, () => {
            onResult(openUriRsult.success);
        }, 
        () => {
            onResult(openUriRsult.unsupport);
        });
    }
}

function launchInIFrameBody(uri, onSuccess, onFailure, timeout) {

    var i = document.createElement("iframe");
    i.src = uri;
    i.hidden = true;
    document.body.appendChild(i);

    // In firefox, if uri not exists will render error page
    // in that case, we can't get body because cross origin site
    setTimeout(function () {
        try {
            console.log(i.contentWindow.document.body);
            onSuccess();
        } catch (error) {
            onFailure();
        }

        document.body.removeChild(i);
    }, timeout);
}

function launchWithLostFocus(uri, onSuccess, onFailure, timeout) {
    const fallback = setTimeout(() => {
        onFailure();
    }, timeout);

    window.addEventListener('blur', () => {
        console.log('onblur');
    });

    var tabVisible = (function () {
        var stateKey,
            eventKey,
            keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
        return function (c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        }
    })();

    tabVisible(function () {
        console.log(tabVisible());
    });

    document.location.replace(uri)
}

function launchInPhucnhAlgorithm(uri, onResult, browserType, timeout) {

    // wait to check blur of not
    const blueTimeout = setTimeout(() => {
        onResult(openUriRsult.unsupport);
    }, timeout);

    var mouses = {};

    const inDangerArea = (mouses) => {
        if (!mouses.x) {
            return true;
        }

        var sw = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var sh = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        const alertW = browserType.alertW, alertH = browserType.alertH;
        const delX = 100, delY = 40;

        const matchX = (mouses.x - delX < 0.5 * (sw + alertW)) && (mouses.x + delX > 0.5 * (sw + alertW));
        const matchY = (mouses.y - delY < alertH) && (mouses.y + delY > alertH);

        return matchX && matchY;
    }

    function onMouseMove(e) {
        if (!mouses.x) {
            mouses = {
                x: e.offsetX,
                y: e.offsetY
            };
        }
    }

    function onBlur() {
        console.log('blur');
        // if come here, we believe uri is correct
        clearTimeout(blueTimeout);
        window.addEventListener('mousemove', onMouseMove);
    }

    function onFocus() {
        setTimeout(() => {
            if (document.hasFocus()) {
                //cancel or back from app
                onResult(inDangerArea(mouses) ? openUriRsult.cancel : openUriRsult.success);
            } else {
                // accept open app cause blur again
                onResult(openUriRsult.success);
            }

            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('mousemove', onMouseMove);
        }, 500);
    }

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    window.location.replace(uri);
}

function openCustomProtocol(uri, onResult, timeout = 300) {
    const myBrowser = delectBrowser();
    console.log(myBrowser);

    switch (myBrowser.name) {
        case browser.edge.name:
        case browser.IE.name:
            launchInIEnME(uri, onResult);
            break;
        // case browser.firefox.name:
        //     launchInIFrameBody(uri, onSuccess, onFailure, timeout);
        //     break;

        case browser.firefox.name:
        case browser.chrome.name:
        case browser.edgeChromium.name:
            launchInPhucnhAlgorithm(uri, onResult, myBrowser, timeout)
            break;

        default:
            // window.location.replace(uri);
            launchWithLostFocus(uri, onResult, timeout);
    }
}


export default openCustomProtocol;