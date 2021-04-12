import React, { Component } from 'react';

class t extends Component {

    componentDidCatch(err, info) {
        console.log(err);
    }

    render() {
        return (
            <div>
                <a href="zaloo://zalo.me/phone/0366272703"></a>
            </div>
        );
    }
}

export default t;