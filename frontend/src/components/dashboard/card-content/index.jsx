import React from 'react';
import * as moment from "moment";
import {
  Card, Image
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const CardContent = ({ deal, link, company }) => (<Link to={{
  pathname: link,
  state: { deal }
}}>
  <Card.Header>{deal.name}</Card.Header>
  <Card.Meta>Started {moment(deal.created_at).format('DD/MM/YYYY')}</Card.Meta>
  <Card.Description>
    <Image avatar src={company.avatar_path} size='medium' circular />
    {company.name}
  </Card.Description>
</Link>);
