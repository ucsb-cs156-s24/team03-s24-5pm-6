import React from 'react';
import RecommendationRequestsTable from "main/components/RecommendationRequests/RecommendationRequestsTable";
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/RecommendationRequests/RecommendationRequestsTable',
    component: RecommendationRequestsTable
};

const Template = (args) => {
    return (
        <RecommendationRequestsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    requests: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    requests: recommendationRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    requests: recommendationRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/recommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

