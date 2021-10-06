const activitiesCollection = new webix.DataCollection({
	data: [
		{id: 1, typeId: 1, date: "", time: "", details: "", contactId: 1, compeleted: false},
		{id: 2, typeId: 2, date: "", time: "", details: "", contactId: 2, compeleted: true},
		{id: 3, typeId: 4, date: "", time: "", details: "", contactId: 2, compeleted: true},
		{id: 4, typeId: 1, date: "", time: "", details: "", contactId: 2, compeleted: false},
		{id: 5, typeId: 3, date: "", time: "", details: "", contactId: 3, compeleted: false},
		{id: 6, typeId: 2, date: "", time: "", details: "", contactId: 1, compeleted: false},
		{id: 7, typeId: 5, date: "", time: "", details: "", contactId: 3, compeleted: false},
		{id: 8, typeId: 3, date: "", time: "", details: "", contactId: 2, compeleted: true},
		{id: 9, typeId: 1, date: "", time: "", details: "", contactId: 1, compeleted: false}
	]
});

export default activitiesCollection;
