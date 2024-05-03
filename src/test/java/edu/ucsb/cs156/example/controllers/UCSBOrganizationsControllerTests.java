package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;

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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBOrganizationsController.class)
@Import(TestConfig.class)
public class UCSBOrganizationsControllerTests extends ControllerTestCase {

    @MockBean
    UCSBOrganizationsRepository ucsbOrganizationsRepository;

    @MockBean
    UserRepository userRepository;
    // Tests for GET /api/ucsborganizations/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsborganizations() throws Exception {

                // arrange

                UCSBOrganizations skydiving = UCSBOrganizations.builder()
                                .orgCode("SKY")
                                .orgTranslationShort("SKYDIVING CLUB")
                                .orgTranslation("SKYDIVING CLUB AT UCSB")
                                .inactive(false)
                                .build();

                UCSBOrganizations student_life = UCSBOrganizations.builder()
                                .orgCode("OSLI")
                                .orgTranslationShort("STUDENT LIFE")
                                .orgTranslation("OFFICE OF STUDENT LIFE")
                                .inactive(false)
                                .build();

                ArrayList<UCSBOrganizations> expectedOrganizations = new ArrayList<>();
                expectedOrganizations.addAll(Arrays.asList(skydiving, student_life));

                when(ucsbOrganizationsRepository.findAll()).thenReturn(expectedOrganizations);

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationsRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedOrganizations);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/ucsborganizations...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsborganizations/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsborganizations/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_organizations() throws Exception {
                // arrange

                UCSBOrganizations zpr = UCSBOrganizations.builder()
                                .orgCode("ZPR")
                                .orgTranslationShort("ZETA PHI RHO")
                                .orgTranslation("ZETA PHI RHO")
                                .inactive(false)
                                .build();

                when(ucsbOrganizationsRepository.save(eq(zpr))).thenReturn(zpr);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/ucsborganizations/post?orgCode=ZPR&orgTranslationShort=ZETA PHI RHO&orgTranslation=ZETA PHI RHO&inactive=false")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationsRepository, times(1)).save(zpr);
                String expectedJson = mapper.writeValueAsString(zpr);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbOrganizationsRepository.findById(eq("xyz"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations?code=xyz"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbOrganizationsRepository, times(1)).findById(eq("xyz"));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganizations with id xyz not found", json.get("message"));
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations?code=ZPR"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                UCSBOrganizations organizations = UCSBOrganizations.builder()
                                .orgCode("ZPR")
                                .orgTranslationShort("ZETA PHI RHO")
                                .orgTranslation("ZETA PHI RHO")
                                .inactive(false)
                                .build();

                when(ucsbOrganizationsRepository.findById(eq("ZPR"))).thenReturn(Optional.of(organizations));

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations?code=ZPR"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationsRepository, times(1)).findById(eq("ZPR"));
                String expectedJson = mapper.writeValueAsString(organizations);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }


        // Tests for PUT /api/ucsborganizations?...

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_organizations() throws Exception {
                // arrange

                UCSBOrganizations zprOrig = UCSBOrganizations.builder()
                                .orgCode("ZPR")
                                .orgTranslationShort("ZETA PHI RHO")
                                .orgTranslation("ZETA PHI RHO")
                                .inactive(false)
                                .build();

                UCSBOrganizations zprEdited = UCSBOrganizations.builder()
                                .orgCode("ZPRR")
                                .orgTranslationShort("ZET PH RH")
                                .orgTranslation("ZETA PHI RHO FRATERNITY")
                                .inactive(true)
                                .build();

                String requestBody = mapper.writeValueAsString(zprEdited);

                when(ucsbOrganizationsRepository.findById(eq("zpr"))).thenReturn(Optional.of(zprOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsborganizations?code=zpr")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationsRepository, times(1)).findById("zpr");
                verify(ucsbOrganizationsRepository, times(1)).save(zprEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_organizations_that_does_not_exist() throws Exception {
                // arrange

                UCSBOrganizations editedOrg = UCSBOrganizations.builder()
                                .orgCode("xyz")
                                .orgTranslationShort("X Y Z")
                                .orgTranslation("X Y Z")
                                .inactive(false)
                                .build();

                String requestBody = mapper.writeValueAsString(editedOrg);

                when(ucsbOrganizationsRepository.findById(eq("xyz"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsborganizations?code=xyz")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationsRepository, times(1)).findById("xyz");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganizations with id xyz not found", json.get("message"));
        }

        // Tests for DELETE /api/ucsborganizations?...

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_organization() throws Exception {
                // arrange

                UCSBOrganizations abc = UCSBOrganizations.builder()
                                .orgCode("abc")
                                .orgTranslationShort("A B C")
                                .orgTranslation("AY BEE CEE")
                                .inactive(false)
                                .build();

                when(ucsbOrganizationsRepository.findById(eq("abc"))).thenReturn(Optional.of(abc));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsborganizations?code=abc")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationsRepository, times(1)).findById("abc");
                verify(ucsbOrganizationsRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganizations with id abc deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_commons_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ucsbOrganizationsRepository.findById(eq("VSA"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsborganizations?code=vsa")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationsRepository, times(1)).findById("vsa");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganizations with id vsa not found", json.get("message"));
        }

}