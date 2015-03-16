var BuildFixtures = {
  good: [
    {
      "id": 1000001,
      "uuid": "2f406670-007f-0132-cb2f-5247614ee66f",
      "status": "success",
      "commit_id": "03aa27da48bf5d6ee5c162351a2d7f721cc1ad28",
      "message": "testing a codeship build",
      "branch": "backbonify"
    },
    {
      "id": 1000002,
      "uuid": "70d42460-e9fd-0131-b97c-5a04e3162754",
      "status": "success",
      "commit_id": "c36460f43313a549437ec410270376bf3edd4729",
      "message": "turned this into a quite long commit message so i could consider committing this in order to see what happens",
      "branch": "master"
    },
    {
      "id": 1000003,
      "uuid": "8424fba0-007f-0132-8277-1eba7344906a",
      "status": "error",
      "commit_id": "fab58ad0ba4ec78efee303ef6d3dd9824cab2c78",
      "message": "corrected backbone and less config issues.",
      "branch": "master"
    },
    {
      "id": 1000004,
      "uuid": "8905dee0-e9d9-0131-1ab9-0ec2eab3611a",
      "status": "success",
      "commit_id": "84beb1684c33fdb7f7287ea634adcfbdb6a6d59b",
      "message": "testing deployment via codeship through heroku",
      "branch": "master"
    }
  ],

  testing: [
    {
      "id": 1000005,
      "uuid": "2f406670-007f-0132-cb2f-5247614ee66f",
      "status": "testing",
      "commit_id": "03aa27da48bf5d6ee5c162351a2d7f721cc1ad28",
      "message": "testing a codeship build",
      "branch": "backbonify"
    }
  ],

  error: [
    {
      "id": 1000005,
      "uuid": "2f406670-007f-0132-cb2f-5247614ee66f",
      "status": "error",
      "commit_id": "03aa27da48bf5d6ee5c162351a2d7f721cc1ad28",
      "message": "testing a codeship build",
      "branch": "master"
    }
  ]
}
