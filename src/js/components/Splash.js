var React = require('react');
var AppConstants = require('constants/AppConstants');
var util = require('utils/util');
var api = require('utils/api');
var UserActions = require('actions/UserActions');
import {Link} from 'react-router';
import GoogleLogin from 'react-google-login';
import {clone, merge} from 'lodash';
import {RaisedButton, Dialog, IconButton,
    TextField, FlatButton, Paper} from 'material-ui';
var client_secrets = require('constants/client_secrets');
import {browserHistory} from 'react-router';

export default class Splash extends React.Component {
    static defaultProps = {}
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    success(gUser) {
        var profile = gUser.getBasicProfile();
        var id_token = gUser.getAuthResponse().id_token;
        console.log(profile);
        let data = {token: id_token};
        var response = api.post('/api/auth/google_login', data, (res) => {
            UserActions.storeUser(res.user);
            browserHistory.push('/app/dashboard');
        })
    }

    fail(res) {
        console.log(res)
    }

    render() {
        let SITENAME = AppConstants.SITENAME;
        let {user} = this.props;
        let cta = user ? `Welcome back to ${SITENAME}` : `Welcome to ${SITENAME}`;
        return (
            <div>

                <div className="text-center">

                    <h2 style={{marginTop: "140px", marginBottom: "60px"}}>{cta}</h2>

                    <div hidden={!user}>
                        <Link to="/app/dashboard"><RaisedButton label="Your Dashboard" primary={true} /></Link>
                    </div>

                    <div hidden={user}>
                        <Link to="/app/about"><RaisedButton label="Learn More" /></Link>

                        <p style={{marginTop: "6px"}}>OR</p>

                        <GoogleLogin
                            clientId={client_secrets.G_OAUTH_CLIENT_ID}
                            buttonText="Login"
                            scope="profile email https://www.googleapis.com/auth/spreadsheets.readonly"
                            onSuccess={this.success.bind(this)}
                            onFailure={this.fail.bind(this)} />

                    </div>

                </div>

            </div>
        );
    }
}