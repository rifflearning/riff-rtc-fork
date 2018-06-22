import React from 'react';

class Home extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
        <h1>Hi! THis is the homepage</h1>
    );
  }

}

export default Home;
