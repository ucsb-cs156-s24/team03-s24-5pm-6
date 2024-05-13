import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { organizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import OrganizationsTable from "main/components/Organizations/OrganizationsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("OrganizationsTable tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = [
    "Organization Code",
    "Organization Name Short",
    "Organization Name Full",
    "Inactive",
  ];
  const expectedFields = [
    "orgCode",
    "orgTranslationShort",
    "orgTranslation",
    "inactive",
  ];
  const testId = "OrganizationsTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable organizations={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable
            organizations={organizationFixtures.threeOrganizations}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)
    ).toHaveTextContent("EWB");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`)
    ).toHaveTextContent("false");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)
    ).toHaveTextContent("ZPR");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-inactive`)
    ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();
  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable
            organizations={organizationFixtures.threeOrganizations}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)
    ).toHaveTextContent("EWB");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)
    ).toHaveTextContent("ZPR");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable
            organizations={organizationFixtures.threeOrganizations}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`)
    ).toHaveTextContent("EWB");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)
    ).toHaveTextContent("Eng Wo Bor");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)
    ).toHaveTextContent("Engineers Without Borders");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`)
    ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/ucsborganizations/edit/EWB")
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable
            organizations={organizationFixtures.threeOrganizations}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("EWB");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("Eng Wo Bor");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("correctly renders inactive status", () => {
    const currentUser = currentUserFixtures.adminUser;
    const organizations = [
      { ...organizationFixtures.threeOrganizations[0], inactive: true },
      { ...organizationFixtures.threeOrganizations[1], inactive: false },
    ];
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable organizations={organizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    const inactiveStatusTrue = screen.getByTestId('OrganizationsTable-cell-row-0-col-inactive');
    expect(inactiveStatusTrue).toHaveTextContent('true');
  
    const inactiveStatusFalse = screen.getByTestId('OrganizationsTable-cell-row-1-col-inactive');
    expect(inactiveStatusFalse).toHaveTextContent('false');
  });

  test("correctly handles when there is empty input", async () => {

    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsTable currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
    expect(screen.queryByTestId("OrganizationsTable-cell-row-0-col-orgCode")).not.toBeInTheDocument();
  });
});
