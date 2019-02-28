import React, { Component }  from 'react';
import {
  Form,
  Input,
  Segment,
} from 'semantic-ui-react';
import styles from './index.scss';

class OptinForm extends Component {
  componentWillMount() {
    // todo load optin form
  }
  render() {
    return (<div className={styles.OptionForm}>
      <Form>
        <h1>Optin Form</h1>
        <Form.Field required>
          <label>Full name</label>
          <Input placeholder='Full name' />
        </Form.Field>
        <Form.Field required>
          <label>Phone</label>
          <Input placeholder='Phone' />
        </Form.Field>
        <Form.Field required>
          <label>E-mail</label>
          <Input placeholder='E-mail' />
        </Form.Field>
        <Segment basic textAlign='right'>
          <Form.Button>Submit</Form.Button>
        </Segment>
      </Form>
    </div>)
  }
}

export default OptinForm;