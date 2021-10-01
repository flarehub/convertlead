import React, { Component } from "react";
import {Button, Form, Icon, Popup, Select} from "semantic-ui-react";
import * as moment from "moment";
import {compose} from "recompose";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DatePickerSelect from "../../@common/datepicker";
import {AgentsContainer, CompaniesContainer} from "../../../@containers";
import './index.scss';

class CompaignsModal extends Component {
    dateDisplayFormat = 'MM/DD/Y';

    state = {
        agentId: null,
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

        // this.props.getCompanyLeadStats(
        //     this.props.company.id,
        //     this.state.startDate,
        //     moment(date).format('Y-MM-DD'),
        //     this.state.agentId,
        // );
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
            this.state.agentId,
        );
    };

    onChangeAgent = (event, data) => {
        this.setState({
            ...this.state,
            agentId: data.value,
        });

        this.props.getCompanyLeadStats(
            this.props.companyObject.id,
            this.state.startDate,
            this.state.endDate,
            this.state.agentId,
        );
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.companyObject.id !== prevProps.companyObject.id) {
            this.props.getCompanyLeadStats(
                this.props.companyObject.id,
                this.state.startDate,
                this.state.endDate,
                this.state.agentId,
            );

            this.props.loadSelectBoxAgents({
                companyId: this.props.companyObject.id
            });
        }
    }


    componentDidMount() {
        // this.props.getCompanyLeadStats(
        //     this.props.companyObject.id,
        //     this.state.startDate,
        //     this.state.endDate,
        //     this.state.agentId,
        // );

        // this.props.loadSelectBoxAgents({
        //     companyId: this.props.companyObject.id
        // });
    }

    render() {
        const { onClose, agents, company, companyLeadStatsRecords, companyObject } = this.props;
        const { startDateDisplay, endDateDisplay, startDate, endDate } = this.state;

        return (
            <div className="companyLeadStats">
                <div className="btnClose" onClick={(e) => onClose(e)}><i className="flaticon stroke x-2"></i></div>
                <div className="company-name-header">
                    <label>OVERALL</label>
                    <div className="company-name">
                        Conversion Rate
                    </div>
                    <div className="pie-chart"></div>
                </div>
                <div className="company-lead-stats-container">
                    <label>Lead Stats</label>

                    <div className="totals">
                        <div className="total-leads">
                            <span className="value">
                                100
                                {/* {companyLeadStats.total_leads_count || 0} */}
                            </span>
                            <label>Total Leads</label>
                        </div>
                        <div className="total-leads-converted">
                            <span className="value">
                                95
                                {/* {companyLeadStats.total_leads_converted || 0} */}
                            </span>
                            <label>Conversions</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(CompaniesContainer, AgentsContainer)(CompaignsModal);

