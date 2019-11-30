import React from 'react';
import * as moment from "moment";
import {
  Card
} from 'semantic-ui-react';
import { AvatarImage } from 'components/@common/image';
import { Link } from 'react-router-dom';
import { DATE_FORMAT } from "@constants";

export const CardContent = ({ deal, link, company }) => (<Link to={{
  pathname: link,
  state: { deal }
}}>
  <Card.Header>{deal.name}</Card.Header>
  <Card.Meta>Started {moment(deal.created_at).format(DATE_FORMAT)}</Card.Meta>
  <Card.Description>
    <AvatarImage src={company.avatar_path} avatar rounded size='medium' />
    {company.name}
  </Card.Description>
</Link>);
