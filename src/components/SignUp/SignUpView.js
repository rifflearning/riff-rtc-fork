import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';

const GradientCol = styled.div.attrs({
  className: 'column'
})`
height: 100%;
`
const FixedCard = styled.div.attrs({
  className: 'card-content'
})`
  border-radius: 5px;
  background: linear-gradient(30deg, rgba(138,106,148,1) 12%, rgba(171,69,171,1) 87%);
  @media (min-width: 625px) {
    position: fixed;
    width: 40%;
  }
  p {
    color: #fff;
  }
  label {
    color: #fff;
  }
`

const SignInContent = styled.div.attrs({
  className: 'content'
})`
  max-height: 100%;
  overflow-y: scroll;
`

class SignUpView extends Component {

  render () {

    const isInvalid =
    this.props.password === '' ||
    this.props.email === '';
    return (
      <div class="section">
        <div class="columns">
          <GradientCol>
            <FixedCard>
              <p class="title">
                Sign Up
              </p>
              <form onSubmit={this.props.onSubmit}>
                <div class="field">
                  <label class="label">email</label>
                  <div class="control">
                    <input class="input"
                      value={this.props.email}
                      type="text"
                      name="email"
                      placeholder="example@riff.com"
                      onChange={event => this.props.handleChange({'email': event.target.value})}/>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">password</label>
                    <div class="control">
                      <input class="input"
                        value={this.props.password}
                        type="password"
                        name="password"
                        placeholder="something unique and long"
                        onChange={event => this.props.handleChange({'password': event.target.value})}/>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <button class="button is-link" type="submit" disabled={isInvalid}>Submit</button>
                      </div>
                    </div>
                    { this.props.error && <div class="notification is-warning">
                      <button class="delete" onClick={this.props.clearError}></button>
                      {this.props.error.message}</div>}
                    </form>
                  </FixedCard>
                </GradientCol>
                <div class="column">
                  <SignInContent>
                    <h1> Sign up to reserve rooms and see data about your conversations. </h1>
                    <p>Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations. Sign up to reserve rooms and see data about your conversations.
                      Sign up to reserve rooms and see data about your conversations.</p>
                    <p>Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations. Sign up to reserve rooms and see data about your conversations.
                        Sign up to reserve rooms and see data about your conversations.</p>
                    <p>Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations. Sign up to reserve rooms and see data about your conversations.
                          Sign up to reserve rooms and see data about your conversations.</p>
                    <p>Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations. Sign up to reserve rooms and see data about your conversations.
                            Sign up to reserve rooms and see data about your conversations.</p>

                  </SignInContent>
                </div>
              </div>
            </div>
      );
    }
};

export default withRouter(SignUpView);
