import React from 'react';

const Iframe = ({ source }) => {

    const onClick = (e) => {
        setTimeout(() => {
            // var cookie = document.contentWindow.cookie;
            console.log('hehe');
            // console.log(cookie);
            console.log(e.target.contentWindow.cookie);
        }, 2000);
    }

    if (!source) {
        return <div>Loading...</div>;
    }

    const src = source;
    return (
        <div className="col-md-12">
            <div className="emdeb-responsive">
                <iframe id='if' src={src} style={{ width: "78%", height: "100vh", float: "right" }}>
                    {/* <button onClick={onClick}>click</button> */}
                </iframe>
            </div>
        </div>
    );
};

export default Iframe;