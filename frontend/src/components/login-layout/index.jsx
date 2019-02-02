import React, { Component } from 'react'
import { compose } from 'recompose';
import { AuthContainer } from "@containers";
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import './index.scss';

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

  componentWillMount() {
    console.log(this.props);
  }

  render () {
    return (
      <div className='login-form'>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src='/logo.png' /> Log-in to your account
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