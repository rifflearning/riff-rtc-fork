import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../../libs/base";
import history from "../../history"

import SignUpView from "./SignUpView";

class SignUpContainer extends Component {
  async handleSignUp (event) {
    event.preventDefault();
    console.log("event:", event, event.target);
    const { email, password } = event.target.elements;
    console.log("email", email, "password", password);
    try {
      const user = await app
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value);
      history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return <SignUpView onSubmit={this.handleSignUp} />;
  }
}

export default withRouter(SignUpContainer);
