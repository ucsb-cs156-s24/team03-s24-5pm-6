
    
    import { fireEvent, render, waitFor, screen } from "@testing-library/react";
    import { QueryClient, QueryClientProvider } from "react-query";
    import RecommendationRequestsTable from "main/components/RecommendationRequests/RecommendationRequestsTable"
    import { MemoryRouter } from "react-router-dom";
    import { currentUserFixtures } from "fixtures/currentUserFixtures";
    import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
    
    
    const mockedNavigate = jest.fn();
    
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockedNavigate
    }));
    
    describe("UserTable tests", () => {
      const queryClient = new QueryClient();
    
      test("Has the expected column headers and content for ordinary user", () => {
    
        const currentUser = currentUserFixtures.userOnly;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <RecommendationRequestsTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        const expectedHeaders = ["id", "RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded", "Done"];
        const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "dateRequested", "dateNeeded", "done"];
        const testId = "RecommendationRequestsTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();
    
        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
    
      });
    
      test("Has the expected colum headers and content for adminUser", () => {
    
        const currentUser = currentUserFixtures.adminUser;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <RecommendationRequestsTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        const expectedHeaders = ["id", "RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded", "Done"];
        const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "dateRequested", "dateNeeded", "done"];
        const testId = "RecommendationRequestsTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    
        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");
    
        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    
      });
    
      test("Edit button navigates to the edit page for admin user", async () => {
    
        const currentUser = currentUserFixtures.adminUser;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <RecommendationRequestsTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        await waitFor(() => { expect(screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });
    
        const editButton = screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        
        fireEvent.click(editButton);
    
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/recommendationrequest/edit/1'));
    
      });

      test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
    
        // act - render the component
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <RecommendationRequestsTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
        );
    
        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`RecommendationRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("jdoe@ucsb.edu");
    
        const deleteButton = screen.getByTestId(`RecommendationRequestsTable-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
    
        // act - click the delete button
        fireEvent.click(deleteButton);
      });
    
    });
    
    