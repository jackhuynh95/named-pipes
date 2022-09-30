var NamedPipes = require("../lib/named-pipes.js");
var PipeNameWithNoPrefix = "my_pipe_name";
var PipeNameWithPrefix = "\\\\.\\pipe\\my_pipe_name";

const send = async (data = null, prefix = false) => {
	try {
		let address = prefix ? PipeNameWithPrefix : PipeNameWithNoPrefix;
		let pipe = NamedPipes.connect(address);

		await pipe.send(
			"",
			data,
			false
		);

		console.log("connected", data);

			pipe = null;
	} catch (err) {
		console.log("err", err);
	}
}

const main = async () => {
	// pipe name with no prefix and empty data
	send({}, false);

	// pipe name with no prefix
	setTimeout(() =>
	send({
		Url: "http://localhost:51549/addStatus",
		Event: "CONNECT_APP",
		MessageId: "vc_1",
	}, false), 5000);

	// pipe name with prefix
	setTimeout(() => send({
	Url: "http://localhost:51549/addStatus",
	Event: "CONNECT_APP",
	MessageId: "vc_2",
	}, true), 10000);
};

main();
