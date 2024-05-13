import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                id: 1,
                requesterEmail: "wario@mushroomkingdom.gov",
                teamId: "1pm-6",
                tableOrBreakoutRoom: "111",
                requestTime: "2022-01-03T00:00:00",
                explanation: "wariooo",
                solved: true
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: "1",
                requesterEmail: "goomba@mushroomkingdom.gov",
                teamId: "2pm-6",
                tableOrBreakoutRoom: "12",
                requestTime: "2023-01-03T00:00:00",
                explanation: "im stomped",
                solved: false
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("1");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("wario@mushroomkingdom.gov");
            expect(teamIdField).toBeInTheDocument();
            expect(teamIdField).toHaveValue("1pm-6");
            expect(tableOrBreakoutRoomField).toBeInTheDocument();
            expect(tableOrBreakoutRoomField).toHaveValue("111");
            expect(requestTimeField).toBeInTheDocument();
            expect(requestTimeField).toHaveValue("2022-01-03T00:00");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("wariooo");
            expect(solvedField).toBeInTheDocument();
            expect(solvedField).toBeChecked();

            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(requesterEmailField, { target: { value: 'goomba@mushroomkingdom.gov' } });
            fireEvent.change(teamIdField, { target: { value: '2pm-6' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: '12' } });
            fireEvent.change(requestTimeField, { target: { value: '2023-01-03T00:00:00' } });
            fireEvent.change(explanationField, { target: { value: 'im stomped' } });
            fireEvent.click(solvedField);

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 1 requesterEmail: goomba@mushroomkingdom.gov");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });            
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "goomba@mushroomkingdom.gov",
                teamId: "2pm-6",
                tableOrBreakoutRoom: "12",
                requestTime: "2023-01-03T00:00",
                explanation: "im stomped",
                solved: false
            })); // posted object

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("1");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("wario@mushroomkingdom.gov");
            expect(teamIdField).toBeInTheDocument();
            expect(teamIdField).toHaveValue("1pm-6");
            expect(tableOrBreakoutRoomField).toBeInTheDocument();
            expect(tableOrBreakoutRoomField).toHaveValue("111");
            expect(requestTimeField).toBeInTheDocument();
            expect(requestTimeField).toHaveValue("2022-01-03T00:00");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("wariooo");
            expect(solvedField).toBeInTheDocument();
            expect(solvedField).toBeChecked();

            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(requesterEmailField, { target: { value: 'goomba@mushroomkingdom.gov' } });
            fireEvent.change(teamIdField, { target: { value: '2pm-6' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: '12' } });
            fireEvent.change(requestTimeField, { target: { value: '2023-01-03T00:00:00' } });
            fireEvent.change(explanationField, { target: { value: 'im stomped' } });
            fireEvent.click(solvedField);

            fireEvent.click(submitButton);


            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 1 requesterEmail: goomba@mushroomkingdom.gov");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
        });

       
    });
});
