import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

class SignUpView extends Component {

  render () {

    const isInvalid =
    this.props.password === '' ||
    this.props.email === '';
    return (
    <div class="columns">
      <div class="column">
        <div class="card-content">
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
              </form>
            </div>
            <div class="column">
            </div>
          </div>
        </div>
      );
    }
};

export default withRouter(SignUpView);
