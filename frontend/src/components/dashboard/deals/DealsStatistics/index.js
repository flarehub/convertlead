import React from "react";
import { compose } from 'redux';

import {DealsContainer} from "@containers";

import './index.scss'
import moment from "moment";

class DealsStatistics extends React.Component {

  componentDidMount() {
    this.props.fetchDealsStatistics(
      this.props.dealIds,
      moment().startOf('week'),
      moment().endOf('week')
    );
  }

  render() {
    return (<div>Statistic</div>)
  }
}

DealsStatistics.defaultProps = {
  dealIds: [],
};

export default compose(DealsContainer)(DealsStatistics);
