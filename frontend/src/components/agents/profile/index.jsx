import React, { Component }  from 'react';

class AgentProfile extends Component {
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    }, false);
  }

  render() {
    return (
      <div>
        Agent Profile
      </div>
    )
  }
}

export default AgentProfile;