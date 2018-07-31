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
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = { ...INITIAL_STATE };
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

  render() {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    const isInvalid =
    password === '' ||
    email === '';

    return (
      <div class="columns">
        <div class="column">
          <div class="card-content">
            <p class="title">
              Sign Up
            </p>
            <form onSubmit={this.handleSignUp}>
              <div class="field">
                <label class="label">email</label>
                <div class="control">
                  <input class="input"
                    value={email}
                    type="text"
                    name="email"
                    placeholder="example@riff.com"
                    onChange={event => this.setState({'email': event.target.value})}/>
                </div>
              </div>
              <div class="field">
                <label class="label">password</label>
                <div class="control">
                  <input class="input"
                    value={password}
                    type="password"
                    name="password"
                    placeholder="something unique and long"
                    onChange={event => this.setState({'password': event.target.value})}/>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button class="button is-link" type="submit" disabled={isInvalid}>Submit</button>
                </div>
              </div>
            </form>
          </div>
          <div class="column">
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUpContainer);
