import React, { Component } from "react";
import {Button, Form, Icon, Popup} from "semantic-ui-react";
import * as moment from "moment";
import {compose} from "recompose";

import DatePickerSelect from "../../@common/datepicker";
import {CompaniesContainer} from "../../../@containers";

import './index.scss';

class CompanyLeadStats extends Component {
    dateDisplayFormat = 'MM/DD/Y';

    state = {
        startDateDisplay: moment().startOf('isoWeek').format(this.dateDisplayFormat),
        endDateDisplay: moment().endOf('isoWeek').format(this.dateDisplayFormat),
        startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
        endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
    };

    onChangeDateFrom = (date) => {
        this.setState({
            ...this.state,
            startDate: moment(date).format('Y-MM-DD'),
            startDateDisplay: moment(date).format(this.dateDisplayFormat),
        });
    };

    onChangeDateTo = (date) => {
        this.setState({
            ...this.state,
            endDate: moment(date).format('Y-MM-DD'),
            endDateDisplay: moment(date).format(this.dateDisplayFormat),
        });

        this.props.getCompanyLeadStats(
            this.props.company.id,
            this.state.startDate,
            moment(date).format('Y-MM-DD')
        );
    };

    onRestDate = () => {
        this.setState({
            ...this.state,
            startDateDisplay: moment().startOf('isoWeek').format(this.dateDisplayFormat),
            endDateDisplay: moment().endOf('isoWeek').format(this.dateDisplayFormat),
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });

        this.props.getCompanyLeadStats(
            this.props.company.id,
            moment().startOf('isoWeek').format('Y-MM-DD'),
            moment().endOf('isoWeek').format('Y-MM-DD'),
        );
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.companyObject.id !== prevProps.companyObject.id) {
            this.props.getCompanyLeadStats(
                this.props.companyObject.id,
                this.state.startDate,
                this.state.endDate,
            );
        }
    }


    componentDidMount() {
        this.props.getCompanyLeadStats(
            this.props.companyObject.id,
            this.state.startDate,
            this.state.endDate,
        );
    }

    render() {
        const { onClose, company } = this.props;
        const { startDateDisplay, endDateDisplay, startDate, endDate } = this.state;

        return (
            <div className="companyLeadStats">
                <Icon name="close" onClick={(e) => onClose(e)} />
                <div className="company-name-header">
                    <label>Selected</label>
                    <div className="company-name">{company.name}</div>
                </div>
                <div className="company-lead-stats-container">
                    <label>Lead Stats</label>
                    <Popup position='bottom left'
                           trigger={
                               <Form.Field>
                                   <Button>
                                       <Icon name='calendar alternate outline'/>
                                       {startDateDisplay} - {endDateDisplay}
                                   </Button>
                               </Form.Field>} flowing hoverable>

                        <DatePickerSelect
                            onChangeDateFrom={this.onChangeDateFrom}
                            onChangeDateTo={this.onChangeDateTo}
                            onRestDate={this.onRestDate}
                            from={new Date(startDate)} to={new Date(endDate)}
                        />
                    </Popup>
                </div>
            </div>
        );
    }
}

export default compose(CompaniesContainer)(CompanyLeadStats);

