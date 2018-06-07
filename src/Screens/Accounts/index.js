import React, { Component } from 'react';
// import { Button, Intent } from '@blueprintjs/core';

import './index.css';
import AccountItem from './AccountItem';

class AccountScreen extends Component {

  state = {
    isError: false,
  }

  handleError = () => {
    this.setState({
      isError: !this.state.isError
    })
  }
  render() {
    const { isError } = this.state;
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
                  <input id="fullName" className="pt-input " type="text" placeholder="Full Name" dir="auto" />
                </div>
              </div>
              <div className="pt-form-group pt-intent-primary">
                <label className="pt-label" htmlFor="email">
                  User Email
                </label>
                <div className="pt-form-content">
                  <div className="pt-input-group pt-large pt-intent-primary">
                    <span className="pt-icon pt-icon-envelope"></span>
                    <input id="email" className="pt-input " type="email" placeholder="Email address" dir="auto" />
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
                    <input id="password" className="pt-input " type="password" placeholder="Password" dir="auto" />
                  </div>
                  <div className="pt-form-helper-text">Please 6 characters minumum</div>
                </div>
              </div>
              {isError && <span>TEXT ERROR TEXT ERROR TEXT ERROR </span>}
              <div className="submit-container">
                <button type="button" className="pt-button pt-minimal pt-large pt-icon-account" onClick={(e) => {
                  this.handleError();
                }}>CREATE ACCOUNT</button>
              </div>
            </aside>
            <aside className="accounts-list">
              <div className="list-header">
                <i className="zmdi zmdi-accounts-list zmdi-hc-2x"></i>
                <h6>List of users </h6>
              </div>
              <div className="scrollable-div">
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
                <AccountItem />
              </div>
            </aside>
          </section>
        </section>
      </div>
    )
  }
}

export default AccountScreen;