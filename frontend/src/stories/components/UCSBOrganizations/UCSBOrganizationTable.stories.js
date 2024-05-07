import React from 'react';
import OrganizationsTable from 'main/components/Organizations/OrganizationsTable';
import { organizationFixtures } from 'fixtures/ucsbOrganizationFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Organizations/OrganizationsTable',
    component: OrganizationsTable
};

const Template = (args) => {
    return (
        <OrganizationsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    organizations: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    organizations: organizationFixtures.threeOrganizations,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    organizations: organizationFixtures.threeOrganizations,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/organizations', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
