import React, { Component } from 'react';
import * as firebase from "firebase";

import "./index.css";

const auth = firebase.auth();

export default class SigninScreen extends Component {

  state = {
    email: 'zaidyounes94@gmail.com',
    password: 'rootroot',
    isError: false,
    errorMessage: null,
  }

  handleLockClick = () => this.setState({
    showPassword: !this.state.showPassword
  });

  handleSignIn = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).then((data) => {
      // alert('Signed in');
      this.setState({
        isError: false
      })
    })
      .catch((error) => {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        this.setState({
          isError: true,
          errorMessage
        })
        // if (errorCode === 'auth/wrong-password') {
        //   alert('Wrong password.');
        // } else {
        //   alert(errorMessage);
        // }
      });
  }

  render() {
    const { email, password, isError, errorMessage } = this.state;
    return (
      <div className="container">
        <section className="form-login">
          <div className="logo">
            <img alt="" src="images/pin.png"/>
            {isError && <h4 className="error-message">{errorMessage}</h4>}
          </div>
          <div className="pt-input-group pt-large ">
            <label className="pt-label">
              <input className="pt-input pt-large emailInput" type="email" placeholder="Email address" dir="auto" name="email" value={email} onChange={(e) => {
                e.preventDefault();
                this.setState({
                  email: e.target.value
                });
              }} />
            </label>
          </div>
          <div className="pt-input-group pt-large">
            <input type="password" className="pt-input pt-large" placeholder="password..." name="password" value={password} onChange={(e) => {
              e.preventDefault();
              this.setState({
                password: e.target.value
              })
            }} />
            <button className="pt-button pt-minimal pt-intent-warning pt-icon-lock" onClick={() => {
              alert('show password')
              this.handleLockClick();
            }}></button>
          </div>
          <button type="submit" class="pt-button pt-fill pt-large pt-intent-primary signin-button" onClick={(e) => {
            this.handleSignIn(email, password);
          }}>Sign in</button>
        </section>
      </div>
    )
  }
}