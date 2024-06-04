package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendationreq() throws Exception {
        setupUser(true);

        page.getByText("RecommendationRequest").click();

        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("rbeans@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("gummies@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("Needed for a degree");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2024-01-03T00:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2024-01-03T00:00");
        page.getByTestId("RecommendationRequestForm-done").fill("true");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-explanation"))
                .hasText("Needed for a degree");

        page.getByTestId("RecommendationRequestsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-explanation").fill("BS Degree");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-explanation")).hasText("BS Degree");

        page.getByTestId("RecommendationRequestsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("RecommendationRequest").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}