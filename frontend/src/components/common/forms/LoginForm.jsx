import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import './LoginForm.css';

export default class LoginForm extends Component {
	render () {
		return (
			<div className='login-form'>
				<Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as='h2' color='teal' textAlign='center'>
							<Image src='/logo.png' /> Log-in to your account
						</Header>
						<Form size='large'>
							<Segment stacked>
								<Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
								<Form.Input
									fluid
									icon='lock'
									iconPosition='left'
									placeholder='Password'
									type='password'
								/>

								<Button color='teal' fluid size='large' onClick={this.login} >
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