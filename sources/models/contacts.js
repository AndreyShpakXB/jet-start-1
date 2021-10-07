const contactsCollection = new webix.DataCollection({
	data: [
		{
			id: 1,
			name: "Andrey",
			surname: "Shpak",
			email: "shpak@",
			skype: "live:shpak",
			job: "Programmer",
			company: "XBsoftware",
			birthdate: "2003-06-24 00:00",
			location: "Belarus",
			status: "Work"
		},
		{
			id: 2,
			name: "Artem",
			surname: "Popkov",
			email: "popkov@",
			skype: "live:popkov",
			job: "Programmer",
			company: "ITechart",
			birthdate: "2003-01-17 00:00",
			location: "Belarus",
			status: "Work"
		},
		{
			id: 3,
			name: "Yana",
			surname: "Mistukevich",
			email: "mistukevich@",
			skype: "live:mistukevich",
			job: "?",
			company: "?",
			birthdate: "2003-21-05 00:00",
			location: "Belarus",
			status: "Open"
		}
	]
});

export default contactsCollection;
