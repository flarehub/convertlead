import {Grid, Icon, Responsive, Segment, Sidebar, Menu} from 'semantic-ui-react'
import React, {Component} from 'react'
import AppSidebar from '../sidebar'
import Container from './container'
import Header from './header'
import Footer from './footer'
import './index.scss'
import {Auth} from "@services";
import PropTypes from "prop-types";

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopContainer extends Component {
    state = {}
    render() {
        const {children} = this.props

        return (
            <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
                <div className='freshAppLayout'>
                    <Grid padded='horizontally' columns={2}>
                        <Grid.Column width={1}>
                            <AppSidebar/>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            {
                                !Auth.isAgent ? <Header/> : null
                            }
                            <Container/>
                            <Footer/>
                        </Grid.Column>
                    </Grid>
                </div>
            </Responsive>
        )
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.node,
}

class MobileContainer extends Component {
    state = {}

    handleSidebarHide = () => this.setState({sidebarOpened: false})
    handleToggle = () => this.setState({sidebarOpened: true})
    render() {
        const {children} = this.props
        const {sidebarOpened} = this.state

        return (
            <Responsive as={Sidebar.Pushable} getWidth={getWidth} maxWidth={Responsive.onlyMobile.maxWidth}>
                <Sidebar
                    animation='push'
                    onHide={this.handleSidebarHide}
                    vertical
                    visible={sidebarOpened}>
                    <AppSidebar/>
                </Sidebar>

                <Sidebar.Pusher dimmed={sidebarOpened}>
                    <Segment
                        textAlign='center'
                        style={{minHeight: 700, padding: '1em 0em'}}
                        vertical>
                        {/*<Container>*/}
                        <Menu pointing secondary size='large'>
                            <Menu.Item onClick={this.handleToggle}>
                                <Icon name='sidebar'/>
                            </Menu.Item>
                        </Menu>
                        {/*</Container>*/}
                        <Grid padded='horizontally'>
                            <Grid.Column>
                                {
                                    !Auth.isAgent ? <Header/> : null
                                }
                                <Container/>
                                <Footer/>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Sidebar.Pusher>
            </Responsive>
        )
    }
}

MobileContainer.propTypes = {
    children: PropTypes.node,
}

const Layout = () => (
    <div>
        <DesktopContainer/>
        <MobileContainer/>
    </div>
)

export default Layout
