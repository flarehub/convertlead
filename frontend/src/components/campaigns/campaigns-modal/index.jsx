import React, { Component } from "react";
import {compose} from "recompose";

import {AgentsContainer, CompaniesContainer} from "../../../@containers";
import './index.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class CompaignsModal extends Component {

    state = {
        agentId: null,
    };
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.props.companyObject.id !== prevProps.companyObject.id) {
        //     this.props.getCompanyLeadStats(
        //         this.props.companyObject.id,
        //         this.state.startDate,
        //         this.state.endDate,
        //         this.state.agentId,
        //     );

        //     this.props.loadSelectBoxAgents({
        //         companyId: this.props.companyObject.id
        //     });
        // }
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
        console.log("compaigns: ", this.props);
        const { onClose, agents, company, companyLeadStatsRecords, companyObject } = this.props;
        const { startDateDisplay, endDateDisplay, startDate, endDate } = this.state;
        // const config = {
        //     percentage: 12,
        //     title: "test"
        // };
        const percentage = 12;
        return (
            <div className="companyLeadStats">
                <div className="btnClose" onClick={(e) => onClose(e)}><i className="flaticon stroke x-2"></i></div>
                <div className="company-name-header">
                    <label>OVERALL</label>
                    <div className="company-name">
                        Conversion Rate
                    </div>
                    <div className="ring-chart">
                    <div className="ring-chart-text"> CONVERSION RATE </div>
                    
                    <CircularProgressbar 
                        value={percentage} 
                        text={`${percentage}`} 
                        styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0,
                            textSize: '16px',
                        
                            // How long animation takes to go from one percentage to another, in seconds
                            //pathTransitionDuration: 0.5,
                        
                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',
                            // Colors
                            pathColor: `#4a74ff, ${percentage / 100})`,
                            textColor: 'black',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                          })}                        
                    />
                    <div className="ring-chart-percent"> % </div>
                </div>   
                </div>
                <div className="company-lead-stats-container">
                    <label>Lead Stats</label>
                 
                

                    <div className="totals">
                        <div className="total-leads">
                            <span className="value">
                                100
                                {/* {companyLeadStats.total_leads_count || 0} */}
                            </span>
                            <label>TOTAL LEADS</label>
                        </div>
                        <div className="total-leads-converted">
                            <span className="value">
                                95
                                {/* {companyLeadStats.total_leads_converted || 0} */}
                            </span>
                            <label>CONVERSIONS</label>
                        </div>                        
                    </div>
                    <br />
                    <div className="totals">
                        <div className="total-leads">
                            <span className="value">
                                100
                                {/* {companyLeadStats.total_leads_count || 0} */}
                            </span>
                            <label>CONTACTED</label>
                        </div>
                        <div className="total-leads-converted">
                            <span className="value">
                                95
                                {/* {companyLeadStats.total_leads_converted || 0} */}
                            </span>
                            <label>MISSED LEADS</label>
                        </div>                        
                    </div>                    
                </div>
            </div>
        );
    }
}

export default compose(CompaniesContainer, AgentsContainer)(CompaignsModal);

