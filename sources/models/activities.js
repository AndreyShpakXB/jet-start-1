const activitiesCollection = new webix.DataCollection({
	data: [
		{id: 1, typeId: 1, date: "17 October 2021", time: "", details: "Homework", contactId: 1, completed: false},
		{id: 2, typeId: 2, date: "10 October 2021", time: "", details: "RIP", contactId: 2, completed: true},
		{id: 3, typeId: 4, date: "01 December 2021", time: "", details: "Happy new year", contactId: 2, completed: true},
		{id: 4, typeId: 1, date: "", time: "", details: "", contactId: 2, completed: false},
		{id: 5, typeId: 3, date: "", time: "", details: "", contactId: 3, completed: false},
		{id: 6, typeId: 2, date: "", time: "", details: "", contactId: 1, completed: false},
		{id: 7, typeId: 5, date: "", time: "", details: "", contactId: 3, completed: false},
		{id: 8, typeId: 3, date: "", time: "", details: "", contactId: 2, completed: true},
		{id: 9, typeId: 1, date: "", time: "", details: "", contactId: 1, completed: false}
	]
});

export default activitiesCollection;
