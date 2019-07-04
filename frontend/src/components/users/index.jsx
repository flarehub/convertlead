import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'recompose';
import {UsersContainer, BreadCrumbContainer} from '@containers';
import Loader from '../loader';
import {
    Table,
    Segment,
    Pagination,
    Button,
    Checkbox,
    Header,
    Form,
    Input,
    Icon,
    Grid,
    Menu,
} from 'semantic-ui-react';
import './index.scss';
import * as R from "ramda";

class Users extends Component {
    state = {
        open: false,
        companyId: null,
        ready: false,
    };

    componentWillMount() {
        this.props.addBreadCrumb({
            name: 'Users',
            path: '/users',
            active: true,
        }, true);
        this.props.loadUsers();
    }

    getSort = field => {
        const fieldStatus = R.path(['query', 'sort', field], this.props);
        if (fieldStatus === true) {
            return 'sort amount down';
        }
        if (fieldStatus === false) {
            return 'sort amount up';
        }
        return 'sort';
    };

    loadUserPage = (event, data) => {
        this.props.gotoUserPage(data.activePage);
    };

    onSearch = event => {
        console.log(event.target.value);
        this.props.searchUsers(event.target.value)
    };

    onShowArch = () => {
    };

    render() {
        const users = this.props.users || [];
        const {pagination, query} = this.props;
        return (
            <div className='Companies'>
                <Segment attached='top'>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Header floated='left' as='h1'>Users</Header>
                            <Form.Field>
                                <Checkbox label='Show Archived' toggle onChange={this.onShowArch}/>
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Menu secondary>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input icon='search'
                                               onChange={this.onSearch}
                                               value={query.search} placeholder='Search...'/>
                                    </Menu.Item>
                                    <Button color='teal' content='New User'/>
                                </Menu.Menu>
                            </Menu>
                        </Grid.Column>
                    </Grid>
                    <Segment basic>
                        <Loader/>
                        <Table singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name
                                        <Icon name={this.getSort('name')}
                                              onClick={this.props.sort.bind(this, 'name')}/>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>E-mail
                                        <Icon name={this.getSort('email')}
                                              onClick={this.props.sort.bind(this, 'email')}/>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Role
                                        <Icon name={this.getSort('role')}
                                              onClick={this.props.sort.bind(this, 'role')}/>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Phone
                                        <Icon name={this.getSort('phone')}
                                              onClick={this.props.sort.bind(this, 'phone')}/>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    users.map((user, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{user.name}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>{user.role}</Table.Cell>
                                            <Table.Cell>{user.phone}</Table.Cell>
                                            <Table.Cell>
                                                <Button>Edit</Button>
                                                <Button>Delete</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }

                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment>
                <Segment textAlign='right' attached='bottom'>
                    <Pagination onPageChange={this.loadUserPage}
                                defaultActivePage={pagination.current_page}
                                prevItem={null}
                                nextItem={null}
                                totalPages={pagination.last_page}/>
                </Segment>
            </div>
        );
    }
}

export default compose(UsersContainer, BreadCrumbContainer)(Users);