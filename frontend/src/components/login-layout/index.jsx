import React, {Component} from 'react'
import {Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {AuthContainer} from "@containers";
import {Button, Form, Grid, Header, Image, Segment} from 'semantic-ui-react'
import './index.scss';
import logo from '../static/assets/logo.png';

class Login extends Component {
    email = '';
    password = '';

    onEmailChange = (event) => {
        this.email = event.target.value;
    };

    onPasswordChange = (event) => {
        this.password = event.target.value;
    };


    login = () => {
        this.props.login(this.email, this.password);
    };

    async componentWillMount() {
        await this.props.autoLogin();
    }

    render() {
        return (
            <div className='login-form'>
                {
                    this.props.isAuthorised ? <Redirect from='/login' to='/dashboard'/> : null
                }
                <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}} className="logincontainer">
                        <Form size='large' onSubmit={this.login}>
                           <Segment stacked>
                               <Header as='h2' color='teal' textAlign='center'>
                                   <Image src={logo}/>
                               </Header>
                                <p> Sign in to your account </p>
                                <label>Username/E-mail address</label>
                                <Form.Input
                                    fluid
                                    icon={{className: 'linearicons-user'}}
                                    iconPosition='left'
                                    placeholder='E-mail address'
                                    type='text'
                                    onChange={this.onEmailChange}/>

                                <label>Password</label>

                                <Form.Input
                                    fluid
                                    icon={{className: 'linearicons-lock'}}
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={this.onPasswordChange}/>
                               <label><a href="/password-reset">Forgot password ?</a></label>
                                <Button color='teal' fluid size='large'>
                                    Sign in
                                </Button>

                                <span>Don't have an account? <a href="http://convertlead.com">Sign up here</a> </span>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default compose(AuthContainer)(Login);