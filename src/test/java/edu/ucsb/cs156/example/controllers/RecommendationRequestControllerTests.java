package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase {

        @MockBean
        RecommendationRequestRepository recommendationRequestRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/reccomendationrequest/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest/all")) //WHAT IS THE NAME OF THE API??
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest/all")) //do we not change anything else??
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_recommendationrequests() throws Exception { //this changes to what??

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2022-05-01T00:00:00");
/*
 * String requesterEmail;
  String professorEmail;
  String explanation;
  LocalDateTime dateRequested;
  LocalDateTime dateNeeded;
  boolean done;
 */
                RecommendationRequest recReq1 = RecommendationRequest.builder()
                                .requesterEmail("cgaucho@ucsb.edu")
                                .professorEmail("phtcon@ucsb.edu")
                                .explanation("BS/MS program")
                                .done(false)
                                .dateRequested(ldt1)
                                .dateNeeded(ldt2)
                                .build();

                LocalDateTime ldt3 = LocalDateTime.parse("2022-05-20T00:00:00");
                LocalDateTime ldt4 = LocalDateTime.parse("2022-11-15T00:00:00");

                RecommendationRequest recReq2 = RecommendationRequest.builder()
                                .requesterEmail("ldelplaya@ucsb.edu\t")
                                .professorEmail("richert@ucsb.edu")
                                .explanation("PhD CS Stanford")
                                .done(false)
                                .dateRequested(ldt3)
                                .dateNeeded(ldt4)
                                .build();

                ArrayList<RecommendationRequest> expectedRequests = new ArrayList<>(); 
                expectedRequests.addAll(Arrays.asList(recReq1, recReq2)); 

                when(recommendationRequestRepository.findAll()).thenReturn(expectedRequests);

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRequests);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/ucsbdates/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/recommendationrequest/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/recommendationrequest/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_recommendationrequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2022-05-01T00:00:00");

                RecommendationRequest recReq1 = RecommendationRequest.builder()
                .requesterEmail("cgaucho@ucsb.edu")
                .professorEmail("phtcon@ucsb.edu")
                .explanation("BS/MS program")
                .done(true)
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .build();

                when(recommendationRequestRepository.save(eq(recReq1))).thenReturn(recReq1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/recommendationrequest/post?requesterEmail=cgaucho@ucsb.edu&professorEmail=phtcon@ucsb.edu&explanation=BS/MS program&done=true&dateRequested=2022-04-20T00:00:00&dateNeeded=2022-05-01T00:00:00")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).save(recReq1);
                String expectedJson = mapper.writeValueAsString(recReq1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
//tests for getmapping
        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest?id=123"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2022-05-01T00:00:00");
/*
 * String requesterEmail;
  String professorEmail;
  String explanation;
  LocalDateTime dateRequested;
  LocalDateTime dateNeeded;
  boolean done;
 */
                RecommendationRequest recReq1 = RecommendationRequest.builder()
                                .requesterEmail("cgaucho@ucsb.edu")
                                .professorEmail("phtcon@ucsb.edu")
                                .explanation("BS/MS program")
                                .done(false)
                                .dateRequested(ldt1)
                                .dateNeeded(ldt2)
                                .build();

                

                when(recommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.of(recReq1));

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(recReq1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(recommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("RecommendationRequest with id 7 not found", json.get("message"));
        }
// DELETE Testing
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-04-22T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2022-05-04T00:00:00");
                RecommendationRequest recReq1 = RecommendationRequest.builder()
                                .requesterEmail("something@ucsb.edu")
                                .professorEmail("else@ucsb.edu")
                                .explanation("BS/MS program")
                                .done(true)
                                .dateRequested(ldt1)
                                .dateNeeded(ldt2)
                                .build();

                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.of(recReq1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendationrequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                verify(recommendationRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Recommendation Request with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_recommendationrequest_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendationrequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
        }

        // Tests for PUT /api/ucsbdates?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_recommendationrequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-06T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-09T00:00:00");
                LocalDateTime ldt3 = LocalDateTime.parse("2024-01-03T00:00:00");
                LocalDateTime ldt4 = LocalDateTime.parse("2024-02-03T00:00:00");
                
                RecommendationRequest recReqOrig = RecommendationRequest.builder()
                                .requesterEmail("something@ucsb.edu")
                                .professorEmail("else@ucsb.edu")
                                .explanation("BS/MS program")
                                .done(true)
                                .dateRequested(ldt1)
                                .dateNeeded(ldt2)
                                .build();
                RecommendationRequest recReqEdited = RecommendationRequest.builder()
                                .requesterEmail("another@ucsb.edu")
                                .professorEmail("thing@ucsb.edu")
                                .explanation("MS program")
                                .done(false)
                                .dateRequested(ldt3)
                                .dateNeeded(ldt4)
                                .build();
                String requestBody = mapper.writeValueAsString(recReqEdited);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.of(recReqOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendationrequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                verify(recommendationRequestRepository, times(1)).save(recReqEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_recommendationrequest_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");
                
                RecommendationRequest editedRecReq = RecommendationRequest.builder()
                                .requesterEmail("another@ucsb.edu")
                                .professorEmail("thing@ucsb.edu")
                                .explanation("MS program")
                                .done(false)
                                .dateRequested(ldt1)
                                .dateNeeded(ldt2)
                                .build();

                String requestBody = mapper.writeValueAsString(editedRecReq);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendationrequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 67 not found", json.get("message"));

        }
}


