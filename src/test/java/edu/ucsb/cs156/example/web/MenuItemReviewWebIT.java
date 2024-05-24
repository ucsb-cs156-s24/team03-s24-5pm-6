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
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuitemreviews() throws Exception {
        setupUser(true);

        page.getByText("MenuItemReview").click();

        page.getByText("Create MenuItemReview").click();
        assertThat(page.getByText("Create New MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-itemId").fill("123");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("fakeEmail3@gmail.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("5");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2023-01-03T00:00");
        page.getByTestId("MenuItemReviewForm-comments").fill("Godly.");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
                .hasText("Godly.");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-comments").fill("THE BEST");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("THE BEST");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_MenuItemReview() throws Exception {
        setupUser(false);

        page.getByText("MenuItemReview").click();

        assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }
}