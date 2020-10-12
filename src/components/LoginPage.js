import React from 'react';
import AppMode from "./../AppMode.js";

class LoginPage extends React.Component {

    constructor() {
        super();
        //Create a ref for the email input DOM element
        this.emailInputRef = React.createRef();
        this.repeatPassRef = React.createRef();
        this.profilePicRef = React.createRef();
        this.newUserRef = React.createRef();
        this.state = {showAccountDialog: false,
                      showPasswordDialog: false,
                      accountName: "",
                      displayName: "",
                      profilePicFile: "",
                      profilePicDataURL: "",
                      profilePicURL: "https://icon-library.net//images/default-profile-icon/default-profile-icon-24.jpg",
                      accountPassword: "",
                      accountPasswordRepeat: "",
                      accountSecurityQuestion: "",
                      accountSecurityAnswer: ""};

    }

    //checkAccountValidity -- Callback function invoked after a form element in
    //the 'Create Account' dialog box changes and component state has been
    //updated. We need to check whether the passwords match. If they do not, 
    //we set a custom validity message to be displayed when the user clicks the
    //'Create Account' button. Otherwise, we reset the custom validity message
    //to empty so that it will NOT fire when the user clicks 'Create Account'.
    checkAccountValidity = () => {
        if (this.state.accountPassword != this.state.accountPasswordRepeat) {
            //Passwords don't match
            this.repeatPassRef.current.setCustomValidity(
            "This password must match original password.");
        } else {
            this.repeatPassRef.current.setCustomValidity("");
        }
        let data = JSON.parse(localStorage.getItem(this.newUserRef.current.value));
        if (data != null) {
            //The user name is already taken
            this.newUserRef.current.setCustomValidity("An account already exists under this email address. " +
              "Use 'Reset password' to recover the password.");
        } else {
            this.newUserRef.current.setCustomValidity("");
        }
    }

    //handleNewAccountChange--Called when a field in a dialog box form changes.
    handleNewAccountChange = (event) => {
        if (event.target.name === "profilePic") {
            if (event.target.value.length == 0) { //The user canceled the file selection -- set back to default
                this.setState({profilePicDataURL: "",
                profilePicURL: "https://icon-library.net//images/default-profile-icon/default-profile-icon-24.jpg"});
            } else { //The user selected a file
                const self = this;
                const val = event.target.value;
                const reader = new FileReader();
                reader.readAsDataURL(this.profilePicRef.current.files[0]);
                reader.addEventListener("load",function() {
                    self.setState({profilePicFile: val,
                                    profilePicURL: "",
                                    profilePicDataURL: this.result});
                });
            }
        } else if (event.target.name === "accountName" && this.state.displayName === "") {
            this.setState({accountName: event.target.value,
                            displayName: event.target.value});
        } else {
            this.setState({[event.target.name]: event.target.value},this.checkAccountValidity);
            if (this.state.accountPassword != this.state.accountPasswordRepeat) {
                //Passwords don't match
                this.repeatPassRef.current.setCustomValidity(
                  "This password must match original password.");
            } else {
                this.repeatPassRef.current.setCustomValidity("");
            }
        }
    } 
    
    //Focus cursor in email input field when mounted
    componentDidMount() {
        this.emailInputRef.current.focus();
    }  

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.changeMode(AppMode.FEED);
        this.props.setUserId(this.state.accountName);
    }

    //handleCreateAccount -- Triggered when user clicks on "Create Account" button.
    //Custom data checking ensures user account under this email does not 
    //already exist and that the rest of the info is valid. We create a new  
    // object for user, save it to localStorage and take user to app's 
    //landing page. 
    handleCreateAccount = (event) => {
        event.preventDefault();
        //Initialize user account
        let userData = {
            displayName: this.state.displayName,
            password: this.state.accountPassword,
            profilePicFile: this.state.profilePicFile, //if empty, use default
            profilePicDataURL: this.state.profilePicDataURL,
            securityQuestion: this.state.accountSecurityQuestion,
            securityAnswer: this.state.accountSecurityAnswer,
            rounds: {},
            roundCount: 0
        };
        //Commit to local storage
        localStorage.setItem(this.state.accountName,JSON.stringify(userData));
        //Set user Id in parent
        this.props.setUserId(this.state.accountName);
        //Log in user by switching to FEED mode
        this.props.changeMode(AppMode.FEED);
    }


    //renderAccountDialog -- Present the "create account" dialog
    renderAccountDialog = () => {
        return (
        <div className="modal" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <center>
                <h3 className="modal-title"><b>Create New Account</b></h3>
                </center>
                <button className="close" 
                    onClick={() => {this.setState({showAccountDialog: false})}}>
                    &times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleCreateAccount}>
                <label>
                    Email: 
                    <input
                    className="form-control form-text form-center"
                    name="accountName"
                    type="email"
                    size="35"
                    placeholder="Enter Email Address"
                    pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                    required={true}
                    ref={this.newUserRef}
                    value={this.state.accountName}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                    className="form-control form-text form-center"
                    name="accountPassword"
                    type="password"
                    size="35"
                    placeholder="Enter Password"
                    pattern=
                  "(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                    required={true}
                    value={this.state.accountPassword}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <label>
                    Repeat Password:
                    <input
                    className="form-control form-text form-center"
                    name="accountPasswordRepeat"
                    type="password"
                    size="35"
                    placeholder="Repeat Password"
                    required={true}
                    ref={this.repeatPassRef}
                    value={this.state.accountPasswordRepeat}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <label>
                    Display Name:
                    <input
                    className="form-control form-text form-center"
                    name="displayName"
                    type="text"
                    size="30"
                    placeholder="Display Name"
                    required={true}
                    value={this.state.displayName}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <label>
                    Profile Picture:<br/>
                    <input
                    className="form-control form-text form-center"
                    name="profilePic"
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg" 
                    ref={this.profilePicRef}
                    value={this.state.profilePic}
                    onChange={this.handleNewAccountChange}
                    />
                    <img src={this.state.profilePicURL != "" ? 
                              this.state.profilePicURL :
                              this.state.profilePicDataURL} 
                          height="60" width="60" />
                </label> 
                <label>
                    Security Question:
                    <textarea
                    className="form-control form-text form-center"
                    name="accountSecurityQuestion"
                    size="35"
                    placeholder="Security Question"
                    rows="2"
                    cols="35"
                    maxLength="100"
                    required={true}
                    value={this.state.accountSecurityQuestion}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <label>
                    Answer to Security Question:
                    <textarea
                    className="form-control form-text form-center"
                    name="accountSecurityAnswer"
                    type="text"
                    placeholder="Answer"
                    rows="2"
                    cols="35"
                    maxLength="100"
                    required={true}
                    value={this.state.accountSecurityAnswer}
                    onChange={this.handleNewAccountChange}
                    />
                </label>
                <br/>
                <button role="submit" 
                    className="btn btn-primary btn-color-theme modal-submit-btn">
                    <span className="fa fa-user-plus"></span>&nbsp;Create Account
                </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    render() {
        return(
        <div id="login-mode-div" className="padded-page">
        <center>
            <h1 />
            <form id="loginInterface" onSubmit={this.handleSubmit}>
            <label htmlFor="emailInput" style={{ padding: 0, fontSize: 24 }}>
                Email:
                <input
                ref={this.emailInputRef}
                className="form-control login-text"
                type="email"
                placeholder="Enter Email Address"
                id="emailInput"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                required={true}
                />
            </label>
            <p />
            <label htmlFor="passwordInput" style={{ padding: 0, fontSize: 24 }}>
                Password:
                <input
                className="form-control login-text"
                type="password"
                placeholder="Enter Password"
                pattern="[A-Za-z0-9!@#$%^&*()_+\-]+"
                required={true}
                />
            </label>
            <p className="bg-danger" id="feedback" style={{ fontSize: 16 }} />
            <button
                type="submit"
                className="btn-color-theme btn btn-primary btn-block login-btn">
                <span id="login-btn-icon" className="fa fa-sign-in"/>
                &nbsp;Log In
            </button>
            <p>
            <button type="button" className="btn btn-link login-link" 
                    onClick={() => {this.setState({showAccountDialog: true});}}>
                Create an account</button> | 
                <button type="button" className="btn btn-link login-link"
                        onClick={() => {this.setState({showPasswordDialog: true});}}>
                Reset your password</button>
            </p>  
            <p>
                <i>Version CptS 489</i>
            </p>
            </form>
            {this.state.showAccountDialog ? this.renderAccountDialog() : null}
            {this.state.showPasswordDialog ? this.renderPasswordDialog() : null}
        </center>
        </div>
        )
    }
} 

export default LoginPage;
