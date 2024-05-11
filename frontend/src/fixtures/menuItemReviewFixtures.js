const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "itemId": 123,
        "reviewerEmail": "fakeEmail3@gmail.com",
        "stars": 4,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "This is amazing!"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 123,
            "reviewerEmail": "fakeEmail3@gmail.com",
            "stars": 4,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "This is amazing!"
        },
        {
            "id": 2,
            "itemId": 124,
            "reviewerEmail": "fakeEmail2@gmail.com",
            "stars": 3,
            "dateReviewed": "2022-02-02T13:00:00",
            "comments": "This is great!"
        },
        {
            "id": 3,
            "itemId": 125,
            "reviewerEmail": "fakeEmail1@gmail.com",
            "stars": 1,
            "dateReviewed": "2022-03-02T14:00:00",
            "comments": "This sucks!"
        }
    ]
};

export { menuItemReviewFixtures };