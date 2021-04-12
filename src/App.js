import { useEffect, useRef, useState } from 'react';
import './App.css';
import openCustomProtocol from './CPHandler';

import * as Sentry from "@sentry/react";
import T from './t';

import './Button.css';

// console.defaultLog = console.count.bind(console);
// console.logs = [];
// console.count = function () {
//     console.log(arguments);
//     // default &  console.log()
//     console.defaultLog.apply(console, arguments);
//     // new & array data
//     console.logs.push(Array.from(arguments));
// }

function _registerEvent(target, eventType, cb) {
    if (target.addEventListener) {
        target.addEventListener(eventType, cb);
        return {
            remove: function () {
                target.removeEventListener(eventType, cb);
            }
        };
    } else {
        target.attachEvent(eventType, cb);
        return {
            remove: function () {
                target.detachEvent(eventType, cb);
            }
        };
    }
}

function openUriWithTimeoutHack(uri, failCb, successCb, timeout = 1000) {
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            console.log('bye');
        } else {
            console.log('well back');
        }
    }, false);

    // function winonBlur() {
    //     handler1.remove();
    //     console.log('win blur');
    // }

    // // register blur for window
    // var handler1 = _registerEvent(window, "blur", winonBlur);


    // het timeout moi bat dau di check
    // wait popup show (if needed) to get correct top level
    const waitTimeout = setTimeout(() => {

        //catch blur event of top level
        var target = window;
        while (target != target.parent) {
            target = target.parent;
        }

        // case 1: uri not exists
        if (document.hasFocus()) {
            failCb();
            return;
        }

        // document blur => 1 pop up or 2 app open

        // neu app mo thi cho active tro lai la success


        // neu alert va cancle => winfocus

        // case 2: url exist, show popup, cancel
        // window lost focus then refocus
        console.log(window === target);


        // case 2: exists, not show popup, launch directly
        if (window === target)


            // neu popup show len thi no k phai la window
            // => cho ch no confirm
            window.onfocus = () => {
                console.log('winfocus');
            };

        var handler = _registerEvent(target, "blur", onBlur);

        function onBlur() {
            console.log('top blur');
            handler.remove();
        }

    }, timeout);

    window.location = uri;
}

function openUriInNewWindowHack(uri, failCb, successCb) {
    var myWindow = window.open('', '', 'width=0,height=0');

    myWindow.document.write("<iframe src='" + uri + "'></iframe>");

    setTimeout(function () {
        try {
            let a = myWindow.location.href;
            //myWindow.setTimeout("window.close()", 1000);
            successCb();
        } catch (e) {
            myWindow.close();
            failCb();
        }
    }, 1000);
}

function _createHiddenIframe(target, uri) {
    var iframe = document.createElement("iframe");
    iframe.src = uri;
    iframe.id = "hiddenIframe";
    iframe.style.display = "none";
    target.appendChild(iframe);

    return iframe;
}


function openUriUsingIE10InWindows7(uri, failCb, successCb) {

    var iframe = _createHiddenIframe(document.body, "about:blank");

    iframe.contentWindow.location = "randomprotocolstring://test/";
    window.setTimeout(function () {
        try {
            alert(iframe.contentWindow.location);
        } catch (e) { window.location = "/download/"; }
    }, 0);
}
function App() {

    const [result, setresult] = useState('this line show your action');

    const onClick = () => {
        openCustomProtocol('zalo://zalo.me/phone/111111', (r) => {
            setresult('your app was ' + r);
        });
    }

    const onClick2 = () => {
        openCustomProtocol('zola://zalo.me/phone/111111', (r) => {
            setresult('your app was ' + r);
        });
    }

    const a = () => {
        console.onerror = (r) => {
            console.log('errr');
        }
        // console.logs = [];
        console.log(window.console.memory);
        window.location.replace('zaloa://zalo.me/phone/0366272703');
        // setTimeout(() => {

        //     // console.log(console.logs);
        //     //console.count('Prevented navigation to “zaloo://zalo.me/phone/0366272703” due to an unknown protocol.');
        //     debugger;
        // }, 1000);

        window.console.error = (st) => {
            debugger;
        }
        console.log(window.console.memory);
    }

    return (
        <div className="App">
            <h1 id='h'>{result}</h1>
            <div className="container">
                
                <button className="btn btn-primary" onClick={onClick}>Open Zalo</button>
                <button className="btn btn-primary" onClick={onClick2}>Open Zola</button>
            </div>
        </div>
    );
}

export default App;
