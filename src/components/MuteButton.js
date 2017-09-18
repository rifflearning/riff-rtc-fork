import React from 'react';


class MuteButton extends React.Component {

  render() {
    let icon="mic";
    if (this.props.muted) {
      icon="mic_off";
    }
    return (
      <a href="#" className="waves-effect waves-light btn-floating light-blue" onClick={this.props.onClick}>
        <i className="small material-icons">{icon}</i>
      </a>
    );
  }

}

export default MuteButton;
