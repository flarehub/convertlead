import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { AuthContainer } from "@containers";
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import './index.scss';
import logo from '../static/assets/logo.png';

class Login extends Component {
  email = '';
  password = '';


  onEmailChange = (event) => {
    this.email = event.target.value;
  }
  onPasswordChange = (event) => {
    this.password = event.target.value;
  }


  login = () => {
    this.props.login(this.email, this.password);
  }

  async componentWillMount() {
    await this.props.autoLogin();
  }

  render () {
    return (
      <div className='login-form'>
        {
          this.props.isAuthorised ? <Redirect from='/login' to='/dashboard' /> : null
        }
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logo} /> Log-in to your account
            </Header>
            <Form size='large' onSubmit={this.login}>
              <Segment stacked>
                <Form.Input fluid icon='user' type='text' onChange={this.onEmailChange} iconPosition='left' placeholder='E-mail address' />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={this.onPasswordChange}
                />

                <Button color='teal' fluid size='large' >
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default compose(AuthContainer)(Login);