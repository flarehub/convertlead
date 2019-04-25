import React from 'react';
import {Link} from 'react-router-dom';
import {Grid, Header} from 'semantic-ui-react';
import {compose, lifecycle} from 'recompose';
import './index.scss';
import {Breadcrumb} from 'components';
import {ProfileContainer} from '@containers';

const LayoutHeader = ({profile}) => (
    <div className='freshAppHeader'>
        <Grid columns={2} stackable>
            <Grid.Row verticalAlign="middle">
                <Grid.Column>
                    <Breadcrumb/>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                    <Link to='/profile'>
                        <Header as='h2'>
                            {profile.name}
                        </Header>
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </div>
);

export default compose(ProfileContainer, lifecycle({
    componentWillMount() {
        this.props.getUserProfile();
    }
}))(LayoutHeader);