import React from "react";
import { withRouter } from 'react-router-dom';

const SignUpView = ({ onSubmit, state }) => {

  return (
    <div class="columns">
      <div class="column">
        <div class="card-content">
          <p class="title">
            Sign Up
          </p>
          <form onSubmit={onSubmit}>
            <div class="field">
              <label class="label">email</label>
              <div class="control">
                <input class="input" value={state.email} type="text" name="email" placeholder="example@riff.com" onChange={event => this.setState({'email': event.target.value})}/>
              </div>
            </div>
            <div class="field">
              <label class="label">password</label>
              <div class="control">
                <input class="input" value={state.password} type="password" name="password" placeholder="something unique and long"/>
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
};

export default withRouter(SignUpView);
