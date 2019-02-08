import { Segment, Grid } from 'semantic-ui-react'
import React, { Component } from 'react'
import AppSidebar from '../sidebar'
import Container from './container'
import Header from './header'
import Footer from './footer'
import styles from './index.scss'

export class Layout extends Component {
  render() {
    return (<div className={styles.Layout}>
      <Grid columns={2}>
        <Grid.Column width={1}>
          <AppSidebar />
        </Grid.Column>
        <Grid.Column width={15}>
          <Segment>
            <Header />
            <Container />
            <Footer />
          </Segment>
        </Grid.Column>
      </Grid>
    </div>);
  }
}
