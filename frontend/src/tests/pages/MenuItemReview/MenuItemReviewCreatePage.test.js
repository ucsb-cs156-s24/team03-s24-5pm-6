import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {

        const queryClient = new QueryClient();
        const review = {
            id: 3,
            itemId: 126,
            reviewerEmail: "blahblah@gmail.com",
            stars: 5,
            dateReviewed: "2022-04-02T14:00:00",
            comments: "This is godly..."
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailInput = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsInput = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedInput = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsInput = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: '126' } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'blahblah@gmail.com' } })
        fireEvent.change(starsInput, { target: { value: '5' } })
        fireEvent.change(dateReviewedInput, { target: { value: '2022-04-02T14:00:00' } })
        fireEvent.change(commentsInput, { target: { value: 'This is godly...' } })
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "126",
            reviewerEmail: "blahblah@gmail.com",
            stars: "5",
            dateReviewed: "2022-04-02T14:00",
            comments: "This is godly..."
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New MenuItemReview Created - id: 3 itemId: 126");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

    });
});


