import React, { Component } from 'react'
import { Link, Switch } from 'react-router-dom'
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import styles from './AppSidebar.scss';
import Dashboard from "./Dashboard";
import Companies from "./company";
import PrivateRoute from "./@common/PrivateRoute";
import Profile from "../containers/profile";

class AppSidebar extends Component {
	componentDidMount() {
		console.log(this.props);
	}

	updateUser = () => (this.props.updateProfile({ name: 'Teo' }))

	render() {
		return (
			<div className={styles.AppSidebar}>
				<Sidebar.Pushable as={Segment}>
					<Sidebar
						as={Menu}
						animation='overlay'
						icon='labeled'
						inverted
						vertical
						visible={true}
						width='thin'
					>
						<Link to="/dashboard" onClick={this.updateUser}>
							<Menu.Item>
									<Icon name='home' />
									Dashboard
							</Menu.Item>
						</Link>
						<Link to="/companies">
							<Menu.Item>
								<Icon name='gamepad' />
								Companies
							</Menu.Item>
						</Link>
						<Menu.Item>
							<Icon name='camera' />
							Channels
						</Menu.Item>
					</Sidebar>

					<Sidebar.Pusher>
						<Segment basic className="app-segment-container" stacked={true} size="massive">
							<h1>{this.props.name}</h1>
							<Switch>
								<PrivateRoute exact path="/companies" component={Companies}/>
								<PrivateRoute path='/dashboard' component={Dashboard} />
							</Switch>
						</Segment>
					</Sidebar.Pusher>
				</Sidebar.Pushable >
			</div>
		)
	}
}

export default Profile(AppSidebar);