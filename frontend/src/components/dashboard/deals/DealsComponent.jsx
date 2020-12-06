import React from "react";
import {Button, Card} from "semantic-ui-react";
import {CardContent} from "./card-content";
import {Auth} from "@services";

export const DealsComponent = ({deals, deleted, loadForm, openConfirmModal}) => (
  (!deals && deals.length === 0) && (
    <div className="empty-deal-wrapper">
      Welcome! Looks like you haven’t created a campaign yet. Once you create one, you’ll see
      it here.
    </div>
  ) || (
    deleted && (
      <Card.Group>
        {
          deals.map((deal, key) => (
            <Card key={key}>
              <Card.Content>
                {
                  Auth.isAgency
                    ? <CardContent deal={deal} company={deal.company}
                                   link={`/companies/${deal.company.id}/deals/${deal.id}/campaigns`}/>
                    : <CardContent deal={deal} company={deal.agency}
                                   link={`/deals/${deal.id}/campaigns`}/>
                }
              </Card.Content>
            </Card>
          ))
        }
      </Card.Group>
    ) || <Card.Group>
      {
        deals.map((deal, key) => (
          <Card key={key}>
            <Card.Content>
              {
                Auth.isAgency
                  ? <CardContent deal={deal} company={deal.company}
                                 link={`/companies/${deal.company.id}/deals/${deal.id}/campaigns`}/>
                  : <CardContent deal={deal} company={deal.agency}
                                 link={`/deals/${deal.id}/campaigns`}/>
              }
              <Button.Group basic size='small'>
                <Button onClick={loadForm.bind(this, {
                  ...deal,
                  companyId: deal.company.id,
                  show: true
                })}>Edit</Button>
                <Button icon='trash alternate outline'
                        onClick={openConfirmModal.bind(this, true, deal.company.id, deal.id)}/>
              </Button.Group>
            </Card.Content>
          </Card>
        ))
      }
    </Card.Group>
  )
)
