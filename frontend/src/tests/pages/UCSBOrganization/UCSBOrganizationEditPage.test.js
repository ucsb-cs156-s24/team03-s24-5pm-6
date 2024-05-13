
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: "EWB"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "EWB" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Organization");
            expect(screen.queryByTestId("OrganizationsForm-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "EWB" } }).reply(200, {
                orgCode: "EWB",
                orgTranslationShort: "Eng Wo Bor",
                orgTranslation: "Engineers Without Borders",
                inactive: "false",
            });
            axiosMock.onPut('/api/ucsborganizations').reply(200, {
                orgCode: "EWB",
                orgTranslationShort: "UCSB EWB",
                orgTranslation: "UCSB Engineers Without Borders",
                inactive: "true",
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("OrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("OrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("OrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("OrganizationsForm-orgTranslation");
            const inactiveField = screen.getByTestId("OrganizationsForm-inactive");
            const submitButton = screen.getByTestId("OrganizationsForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("EWB");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Eng Wo Bor");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Engineers Without Borders");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(orgCodeField, { target: { value: 'EW' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'UCSB EW' } });
            fireEvent.change(orgTranslationField, { target: { value: 'UCSB Engineers Without' } });
            fireEvent.change(inactiveField, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - orgCode: EWB orgTranslationShort: UCSB EWB orgTranslation: UCSB Engineers Without Borders inactive: true");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "EW" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: 'EW',
                orgTranslationShort: 'UCSB EW',
                orgTranslation: 'UCSB Engineers Without',
                inactive: 'true'
            })); // posted object
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("OrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("OrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("OrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("OrganizationsForm-orgTranslation");
            const inactiveField = screen.getByTestId("OrganizationsForm-inactive");
            const submitButton = screen.getByTestId("OrganizationsForm-submit");

            expect(orgCodeField).toHaveValue("EWB");
            expect(orgTranslationShortField).toHaveValue("Eng Wo Bor");
            expect(orgTranslationField).toHaveValue("Engineers Without Borders");
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShortField, { target: { value: 'UCSB EWB' } });
            fireEvent.change(orgTranslationField, { target: { value: 'UCSB Engineers Without Borders' } });
            fireEvent.change(inactiveField, { target: { value: true } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - orgCode: EWB orgTranslationShort: UCSB EWB orgTranslation: UCSB Engineers Without Borders inactive: true");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });
        });
    });
});
