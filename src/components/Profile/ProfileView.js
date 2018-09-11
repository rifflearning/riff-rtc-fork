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

const ProfileView = ({user, emailStatus, emailMessage, emailInput, clearEmailError,
                      handleEmailSubmit, handleEmailInput, handleKeyPress}) => (
  <div className="section">
    <div className="columns">
      <div className="column">
        <div className="columns">
          <div className="column">
            <h1 className='is-size-3'>Profile</h1>
            <p className='is-size-5'>Here you can change your email and your default display name. More coming soon! </p>
          </div>
        </div>
        <div className="columns is-centered has-text-centered">
          <div className="column is-two-thirds has-text-left">
            <div className="field has-addons">
              <p className="control">
                <TextInputStart>
                  Email
                </TextInputStart>
              </p>
              <div className="control">
                <input className="input"
                       type="text"
                       value={ emailInput }
                       onChange={ event => handleEmailInput(event.target.value)}
                  onKeyPress={ handleKeyPress }/>
              </div>
              <div className="control">
                <a className="button is-primary" onClick={ () => handleEmailSubmit(emailInput) }>
                  Change
                </a>
              </div>
              <div style={{marginLeft: '10px'}} className="has-text-centered">
                {emailStatus == "loading" &&
                <BounceLoader color={"#8A6A94"} size={30} sizeUnit={"px"}/>}
                {emailStatus == "success" &&
                <MaterialIcon icon="check_circle" color={"#8A6A94"}/>
                  }
              </div>
            </div>
            { emailStatus == 'error' && <div className="notification is-warning">
                <button className="delete" onClick={clearEmailError}></button>
                {emailMessage}</div> }
          </div>
        </div>
      </div>
  </div>
  </div>
)

export default ProfileView;
