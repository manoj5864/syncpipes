var jiraObjectMapper = [{
    from: "project", to: null,
    attributes: [{ from: "self", to: null },
        { from: "id", to: null},
        { from: "name", to: null}]
    }, {
    from: "issue", to: null,
    attributes: [{ from: "self", to: null },
        { from: "id", to: null },
        { from: "timespent", to: null},
        { from: "timeoriginalestimate", to: null},
        { from: "description", to: null},
        { from: "summary", to: null},
        { from: "created", to: null},
        { from: "duedate", to: null},
        { from: "issuetype", fromType: "object", fromId: "id", to: null },
        { from: "project", fromType: "object", fromId: "id", to: null},
        { from: "priority", fromType: "object", fromId: "id", to: null},
        { from: "status", fromType: "object", fromId: "id", to: null},
        { from: "subtasks", fromType: "arrayOfObjects", fromId: "id", to: null}]
    }, {
    from: "status", to: null,
    attributes: [{ from: "self", to: null },
        { from: "id", to: null },
        { from: "name", to: null },
        { from: "description", to: null }]
    }, {
    from: "priority", to: null,
    attributes: [{ from: "self", to: null },
        { from: "statusColor", to: null },
        { from: "name", to: null },
        { from: "description", to: null }]
    }, {
    from: "issuetype", to: null,
    attributes: [{ from: "self", to: null },
        { from: "id", to: null },
        { from: "name", to: null },
        { from: "subtask", to: null },
        { from: "description", to: null }]
    }
];
