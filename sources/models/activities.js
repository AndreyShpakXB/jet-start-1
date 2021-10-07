const activitiesCollection = new webix.DataCollection({
	data: [
		{id: 1, typeId: 1, date: "2021-10-17 12:00", details: "Homework", contactId: 1, completed: false},
		{id: 2, typeId: 2, date: "2021-09-05 11:00", details: "TV", contactId: 2, completed: true},
		{id: 3, typeId: 4, date: "2021-12-01 00:00", details: "New year", contactId: 2, completed: false},
		{id: 4, typeId: 1, date: "2021-12-03 08:30", details: "Secret event", contactId: 2, completed: false},
		{id: 5, typeId: 3, date: "2020-06-24 11:00", details: "Birthday", contactId: 3, completed: true},
		{id: 6, typeId: 2, date: "2021-10-17 00:00", details: "Meeting", contactId: 1, completed: false},
		{id: 7, typeId: 5, date: "2021-06-15 13:00", details: "Shopping", contactId: 3, completed: false},
		{id: 8, typeId: 3, date: "2021-10-15 00:00", details: "Important phone call", contactId: 2, completed: true},
		{id: 9, typeId: 1, date: "2021-01-01 00:00", details: "First day of new year", contactId: 1, completed: false}
	]
});

export default activitiesCollection;
