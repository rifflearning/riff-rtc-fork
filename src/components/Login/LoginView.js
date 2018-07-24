import React from "react";

const LoginView = ({ onSubmit }) => {
  return (
    <div class="card-content">
      <p class="title">
        Log In
      </p>
      <form onSubmit={onSubmit}>
        <div class="field">
          <label class="label">email</label>
          <div class="control">
            <input class="input" type="text" name="email" placeholder="example@riff.com"/>
          </div>
        </div>
        <div class="field">
          <label class="label">password</label>
          <div class="control">
            <input class="input" type="password" name="password" placeholder="something unique and long"/>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-link" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginView;

