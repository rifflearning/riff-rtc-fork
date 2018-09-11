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

const LogInContent = styled.div.attrs({
  className: 'content'
})`
max-height: 100%;
overflow-y: scroll;
`

const LogInView = ({handleLogIn,
                    handleEmail,
                    handlePassword,
                    clearError,
                    error,
                    email,
                    password,
                    isInvalid}) => (

                      <div className="section">
                        <div className="columns">
                          <GradientCol>
                            <FixedCard>
                              <p className="title">
                                Log In
                              </p>
                              <form onSubmit={handleLogIn}>
                                <div className="field">
                                  <label className="label">email</label>
                                  <div className="control">
                                    <input className="input"
                                           type="text"
                                           name="email"
                                           placeholder="example@riff.com"
                                           onChange={event => handleEmail(event.target.value)}/>
                                  </div>
                                </div>
                                <div className="field">
                                  <label className="label">password</label>
                                  <div className="control">
                                    <input className="input"
                                           type="password"
                                           name="password"
                                           placeholder="something unique and long"
                                           onChange={event => handlePassword(event.target.value)}/>
                                  </div>
                                </div>
                                <div className="field">
                                  <div className="control">
                                    <button className="button is-link" type="submit" disabled={isInvalid}>Submit</button>
                                  </div>
                                </div>
                                { error && <div className="notification is-warning">
                                    <button className="delete" onClick={clearError}></button>
                                    {error.message}</div>}
                              </form>
                            </FixedCard>
                          </GradientCol>
                          <div className="column">
                            <LogInContent>
                              <h1> Log in to access your meeting history!</h1>
                            </LogInContent>
                          </div>
                        </div>
                      </div>
                    );
export default LogInView;
