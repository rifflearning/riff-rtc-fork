import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import styled, { injectGlobal, keyframes } from 'styled-components';
import {BounceLoader} from 'react-spinners';
import MaterialIcon from 'material-icons-react';
import { Link } from 'react-router-dom';



const TextInputStart = styled.a.attrs({
  className: 'button is-static'
})`
background-color: #fff;
border-color: #fff;
margin-left: 1px;
`

const EmailChangeView = (props) => (
  <div class="column is-two-thirds has-text-left">
    <div class="field has-addons">
      <p class="control">
        <TextInputStart>
          Email
        </TextInputStart>
      </p>
      <div class="control">
        <input class="input"
               type="text"
               value={ props.emailInput }
               onChange={ event => props.handleEmailInput(event.target.value)}
          onKeyPress={ props.handleKeyPress }/>
      </div>
      <div class="control">
        <a class="button is-primary" onClick={ () => props.handleEmailSubmit(props.emailInput) }>
          Change
        </a>
      </div>
      <div style={{marginLeft: '10px'}} class="has-text-centered">
        {props.emailStatus == "loading" &&
        <BounceLoader color={"#8A6A94"} size={30} sizeUnit={"px"}/>}
        {props.emailStatus == "success" &&
          <MaterialIcon icon="check_circle" color={"#8A6A94"}/>
          }
      </div>
    </div>
    { props.emailStatus == 'error' && <div class="notification is-warning">
        <button class="delete" onClick={props.clearEmailError}></button>
        {props.emailMessage}</div> }
  </div>);

const ProfileView = (props) => (
  <div class="section">
    <div class="columns">
      <div class="column">
        <div class="columns">
          <div class="column">
            <h1 class='is-size-3'>Profile</h1>
          </div>
        </div>
        <div class="columns is-centered has-text-centered">
          <EmailChangeView {...props}/>
        </div>
      </div>
  </div>
  </div>
)

export default ProfileView;
