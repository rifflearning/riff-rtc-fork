import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../../libs/base";
import history from "../../history"

import LoginView from "./LoginView";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async handleSignUp (event) {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const user = await app
            .auth()
            .signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/home");
      console.log(history)
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return <LoginView onSubmit={this.handleSignUp} />;
  }
}

export default withRouter(LoginContainer);
