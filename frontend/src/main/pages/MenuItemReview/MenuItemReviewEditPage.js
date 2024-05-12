import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from 'main/components/MenuItemReview/MenuItemReviewForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: reviews, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/menuitemreviews?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/menuitemreviews`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (reviews) => ({
        url: "/api/menuitemreviews",
        method: "PUT",
        params: {
            id: reviews.id,
        },
        data: {
            itemId: reviews.itemId,
            reviewerEmail: reviews.reviewerEmail,
            stars: reviews.stars,
            dateReviewed: reviews.dateReviewed,
            comments: reviews.comments,
        }
    });

    const onSuccess = (reviews) => {
        toast(`MenuItemReview Updated - id: ${reviews.id} itemId: ${reviews.itemId}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/menuitemreviews?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/menuitemreview" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit MenuItemReview</h1>
                {
                    reviews && <MenuItemReviewForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={reviews} />
                }
            </div>
        </BasicLayout>
    )

}
