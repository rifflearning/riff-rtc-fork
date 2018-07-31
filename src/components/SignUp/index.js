import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import app from "../../libs/base";
import SignUpView from "./SignUpView";

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class SignUpContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleSignUp = this.handleSignUp.bind(this);
    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSignUp (event) {
    event.preventDefault();
    console.log("event:", event, event.target);
    const { email, password } = event.target.elements;
    console.log("email", email, "password", password);
    try {
      const user = await app
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/home");
      console.log("history:",this.props.history);
    } catch (error) {
      alert(error);
    }
  }

  handleChange (obj) {
    this.setState(obj);
  }

  render() {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    return <SignUpView onSubmit={this.handleSignUp}
      email={this.state.email}
      password={this.state.password}
      handleChange={this.handleChange}
      isInvalid={this.isInvalid}/>;
  }
}

export default withRouter(SignUpContainer);
