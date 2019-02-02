import { Segment, Sidebar } from 'semantic-ui-react'
import React, { Component } from 'react'
import AppSidebar from '../sidebar'
import Container from './container'
import Header from './header'
import Footer from './footer'
import styles from './index.scss'

export class Layout extends Component {
  render() {
    return (<div className={styles.Layout}>
      <Sidebar.Pushable as={Segment}>
        <AppSidebar />
        <Sidebar.Pusher>
          <Header />
          <Container />
          <Footer />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>);
  }
}
