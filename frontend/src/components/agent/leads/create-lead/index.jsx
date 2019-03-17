import React, { Component } from 'react';
import {compose} from "recompose";
import {
  CompaniesContainer, LeadFormContainer, LeadsContainer, MessageContainer, BreadCrumbContainer,
  ProfileContainer
} from "@containers";
import { Button } from 'semantic-ui-react';
import LeadForm from "components/@common/forms/lead";
import * as R from "ramda";

class CreateLead extends Component {
  componentWillMount() {
    this.props.loadForm({});
    this.props.loadSelectBoxCompanies();
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/companies/leads'
    }, true);
    this.props.addBreadCrumb({
      name: 'Create',
      path: '',
      active: true,
    }, false);
  }

  onSave = () => {
    if (this.validate()) {
      this.props.saveForm(this.props.form);
    }
  };

  validate = () => {
    if (R.has('required', this.props)) {
      const requiredFields = R.mapObjIndexed((value, fieldName) => {
        if (!this.props.form[fieldName] && value) {
          return {
            field: fieldName,
            required: true,
          }
        }
        return {
          required: false
        }
      }, this.props.required) || [];

      const fields = R.reduce((acc, value) => {
        return `${(acc ? acc+',\n'+value.field : value.field)}`
      }, '', R.filter(field => field.required, R.values(requiredFields)));
      if (fields) {
        this.props.sendMessage(`Missing required "${fields}"!`, true);
        return false;
      }
    }
    return true;
  };

  render() {
    return (<div>
      <LeadForm {...this.props} />
      <div>
        <Button onClick={this.onSave}>Save</Button>
      </div>
    </div>)
  }
}

export default compose(
  BreadCrumbContainer,
  ProfileContainer,
  LeadFormContainer,
  LeadsContainer,
  MessageContainer,
  CompaniesContainer
)(CreateLead);