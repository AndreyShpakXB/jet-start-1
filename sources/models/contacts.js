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
			status: "work"
		},
		{
			id: 2,
			name: "Artem",
			surname: "Popkov",
			email: "popkov@",
			skype: "live:popkov",
			job: "Programmer",
			company: "itechart",
			birthdate: "17-01-2002",
			location: "Belarus",
			status: "work"
		},
		{
			id: 3,
			name: "Yana",
			surname: "Mistukevich",
			email: "mistukevich@",
			skype: "live:mistukevich",
			job: "Wife",
			company: "Home",
			birthdate: "21-05-2003",
			location: "Belarus",
			status: "open"
		}
	]
});

export default contactsCollection;
