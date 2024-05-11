import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import OrganizationsForm from 'main/components/Organizations/OrganizationsForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: organizations, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsborganizations?orgCode=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsborganizations`,
                params: {
                    orgCode: id,
                },
            }
        );

    const objectToAxiosPutParams = (organizations) => ({
        url: "/api/ucsborganizations",
        method: "PUT",
        params: {
            orgCode: organizations.orgCode,
        },
        data: {
            orgCode: organizations.orgCode,
            orgTranslationShort: organizations.orgTranslationShort,
            orgTranslation: organizations.orgTranslation,
            inactive: organizations.inactive
        }
    });

    const onSuccess = (organizations) => {
        toast(`Organization Updated - orgCode: ${organizations.orgCode} orgTranslationShort: ${organizations.orgTranslationShort} orgTranslation: ${organizations.orgTranslation} inactive: ${organizations.inactive}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/ucsborganizations?orgCode=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsborganizations" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Organization</h1>
                {
                    organizations && <OrganizationsForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={organizations} />
                }
            </div>
        </BasicLayout>
    )

}