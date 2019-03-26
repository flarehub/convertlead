import { Grid } from 'semantic-ui-react'
import React, { Component } from 'react'
import AppSidebar from '../sidebar'
import Container from './container'
import Header from './header'
import Footer from './footer'
import './index.scss'
import {Auth} from "@services";

export class Layout extends Component {
  render() {
    return (<div className='freshAppLayout'>
      <Grid padded='horizontally' columns={2}>
        <Grid.Column width={1}>
          <AppSidebar />
        </Grid.Column>
        <Grid.Column width={15}>
          {
            !Auth.isAgent ? <Header /> : null
          }
          <Container />
          <Footer />
        </Grid.Column>
      </Grid>
    </div>);
  }
}
