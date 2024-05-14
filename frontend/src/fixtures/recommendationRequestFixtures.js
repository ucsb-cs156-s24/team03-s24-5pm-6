const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "jdoe@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu",
        "explanation": "BS Degree",
        "dateRequested": "2022-01-01T12:00:00",
        "dateNeeded": "2022-01-03T12:00:00",
        "done": false
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "jdoe@ucsb.edu",
            "professorEmail": "phtcon@ucsb.edu",
            "explanation": "BS/MS Degree",
            "dateRequested": "2022-01-01T12:00:00",
            "dateNeeded": "2022-01-03T12:00:00",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "adoc@ucsb.edu",
            "professorEmail": "phcon@ucsb.edu",
            "explanation": "BS/MS Degree",
            "dateRequested": "2024-01-06T12:00:00",
            "dateNeeded": "2024-11-03T12:00:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "gdac@ucsb.edu",
            "professorEmail": "phon@ucsb.edu",
            "explanation": "MS Degree",
            "dateRequested": "2024-03-06T12:00:00",
            "dateNeeded": "2024-05-03T12:00:00",
            "done": true
        }
    ]
};


export { recommendationRequestFixtures };