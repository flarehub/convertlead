import React from 'react';
import * as moment from "moment";
import {
  Checkbox
} from 'semantic-ui-react';
import { AvatarImage } from 'components/@common/image';
import { Link } from 'react-router-dom';
import { DATE_FORMAT } from "@constants";

export const CardContent = ({ onSelectedDeal, deal, link, company }) => (
  <React.Fragment>
    <div className="dealContainer">
      <div>
        <Checkbox value={deal.id} onChange={(event, value) => onSelectedDeal(value)} />
      </div>
      <Link to={{
        pathname: link,
        state: { deal }
      }}>
        <div className="companyContainer">
          <AvatarImage src={company.avatar_path} avatar rounded size='medium' />
          <p>{company.name}</p>
        </div>
        <div className="dealName">{deal.name}</div>
      </Link>
    </div>
    <div><label className="started">Started</label> {moment(deal.created_at).format(DATE_FORMAT)}</div>
    <div><label className="totalLeads">Total leads</label> {deal.leadsCount}</div>
    <div><label className="conversations">Conversations</label> {deal.leadNoteCount}</div>
  </React.Fragment>
);
