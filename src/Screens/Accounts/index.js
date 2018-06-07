import React, { Component } from 'react';
// import { Button, Intent } from '@blueprintjs/core';
import * as firebase from 'firebase';
import { db } from 'Database/config';
import moment from 'moment';


import './index.css';
import AccountItem from './AccountItem';
import AppToaster from 'Components/Toast';

class AccountScreen extends Component {

  state = {
    users: [],
    fullName: '',
    email: '',
    password: '',
    errorMessage: null,
    isError: false,
  }
  
  showSuccessToast = (message) => {
    AppToaster.show({
      message: message,
      intent: "success"
    });
  }

  addUserToDatabase= (idDoc, fullName, email) => {
    db.collection("users").doc(idDoc).set({
      fullName: fullName,
      email: email,
      postedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
        // this.showAddDriverToast();
      })
      .catch(function (error) {
        alert("Something went wrong!");
        console.error("Error adding document: ", error);
    });
  
  }

  createAccount = (fullName, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      user.updateProfile({
        displayName: fullName,
        // photoURL: "https://lh3.googleusercontent.com/-bslOcKGLOK4/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq2r_iLwcSUlmYrEjcHmzDJj1s2y4A/s32-c-mo/photo.jpg"
      }).then(function(user){
        // Update successful.
        // alert(JSON.stringify(firebase.auth().currentUser));
        const fullName = firebase.auth().currentUser.displayName;
        const email = firebase.auth().currentUser.email;
        const idDoc = firebase.auth().currentUser.uid;
        
        db.collection("users").doc(idDoc).set({
          fullName: fullName,
          email: email,
          postedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
        })
          .then(docRef => {
            // this.showAddDriverToast();
          })
          .catch(function (error) {
            alert("Something went wrong!");
            console.error("Error adding document: ", error);
        });

      }).catch(function(error){
        // An error happened.
        alert('error updating : ' +error)
      });
      this.showSuccessToast("Done");
      this.setState({
        fullName: '',
        email: '',
        password: '',
        isError: false,
      })
    })
    .catch((error) => {
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      this.setState({
        isError: true,
        errorMessage
      })
    });
  }

  componentDidMount() {
    db.collection("users").orderBy('postedAt', 'desc').onSnapshot((DocRef) => {
      const userItems = [];
      DocRef.forEach(doc => {
        const data = doc.data();
        let docItem = {
          fullName: data.fullName,
          email: data.email,
          postedAt: data.postedAt,
        }
        userItems.push(docItem);
      });
      this.setState({
        users: userItems,
      })
    });
  }

  render() {
    const { fullName, email, password, isError, errorMessage, users} = this.state;
    return (
      <div className="screen-wrapper accounts-screen">
        <header>
          <div className="account-header pt-card pt-elevation-2">
            <i className="zmdi zmdi-account-add zmdi-hc-3x"></i>
            <h5>Welcome, In this page youn can create users accounts to sign in to your mobile app</h5>
          </div>
        </header>
        <section>
          <section className="account-form-container">
            <aside className="account-form">
              <div className="pt-form-group pt-intent-primary">
                <label className="pt-label" htmlFor="fullName">
                  User Full Name
                </label>
                <div className="pt-input-group pt-large pt-intent-primary">
                  <span className="pt-icon pt-icon-person"></span>
                  <input id="fullName" className="pt-input " type="text" placeholder="Full Name" dir="auto" value={fullName} onChange={(e) => {
                    e.preventDefault();
                    this.setState({
                      fullName: e.target.value
                    });
                  }}/>
                </div>
              </div>
              <div className="pt-form-group pt-intent-primary">
                <label className="pt-label" htmlFor="email">
                  User Email
                </label>
                <div className="pt-form-content">
                  <div className="pt-input-group pt-large pt-intent-primary">
                    <span className="pt-icon pt-icon-envelope"></span>
                    <input id="email" className="pt-input " type="email" placeholder="Email address" dir="auto" value={email} onChange={(e) => {
                      e.preventDefault();
                      this.setState({
                        email: e.target.value
                      });
                    }}/>
                  </div>
                  <div className="pt-form-helper-text">Please enter a valid address</div>
                </div>
              </div>
              <div className="pt-form-group pt-intent-primary">
                <label className="pt-label" htmlFor="password">
                  User Password
                </label>
                <div className="pt-form-content">
                  <div className="pt-input-group pt-large pt-intent-primary">
                    <span className="pt-icon pt-icon-lock"></span>
                    <input id="password" className="pt-input " type="password" placeholder="Password" dir="auto" value={password} onChange={(e) => {
                      e.preventDefault();
                      this.setState({
                        password: e.target.value
                      });
                    }}/>
                  </div>
                  <div className="pt-form-helper-text">Please 6 characters minumum</div>
                </div>
              </div>
              {isError && <span>{errorMessage}</span>}
              <div className="submit-container">
                <button type="button" className="pt-button pt-minimal pt-large pt-icon-account"  disabled={!fullName || !email || !password} onClick={(e) => {
                  this.createAccount(fullName, email, password);
                }}>CREATE ACCOUNT</button>
              </div>
            </aside>
            <aside className="accounts-list">
              <div className="list-header">
                <i className="zmdi zmdi-accounts-list zmdi-hc-2x"></i>
                <h6>List of users </h6>
              </div>
              <div className="scrollable-div">
                {users.map((item, i) => <AccountItem key={i} user={user} />)}
              </div>
            </aside>
          </section>
        </section>
      </div>
    )
  }
}

export default AccountScreen;