import React from "react";
import './index.scss';
import {Icon} from "semantic-ui-react";

export const CompanyLeadStats = ({ company, onClose = () => null }) => <div className="companyLeadStats">
    <Icon name="close" onClick={(e) => onClose(e)} />
    <div className="company-name-header">
        <label>Selected</label>
        <div className="company-name">{company.name}</div>
    </div>
    <div className="company-lead-stats-container">
        <label>Lead Stats</label>

    </div>
</div>
