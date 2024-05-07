import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { toast } from "react-toastify";

export default function RestaurantTable({
    menuItems,
    currentUser,
    testIdPrefix = "UCSBDiningCommonsMenuItemTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbdiningcommonsmenuitem/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cell => ({
            url: 'api/ucsbdiningcommonsmenuitem',
            method: 'DELETE',
            params: {
                id: cell.row.values.id,
            },
        }),
        {
            onSuccess: message => {
                console.log(message);
                toast(message);
            },
        },
        ["/api/ucsbdiningcommonsmenuitem/all"]
    );
    // Stryker restore all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Dining commons code',
            accessor: 'diningCommonsCode',
        },
        {
            Header: 'Station',
            accessor: 'station',
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    }

    return <OurTable
        data={menuItems}
        columns={columns}
        testid={testIdPrefix}
    />;
};

