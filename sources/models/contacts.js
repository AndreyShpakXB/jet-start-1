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
			birthdate: "24-06-2003",
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
			birthdate: "17-01-2003",
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
			birthdate: "21-05-2003",
			location: "Belarus",
			status: "Open"
		}
	]
});

export default contactsCollection;
