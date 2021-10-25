import URLs from "../urls";

const statusesCollection = new webix.DataCollection({
	url: URLs.statusesUrl,
	save: `rest->${URLs.statusesUrl}`
});

export default statusesCollection;
