var NamedPipes = require("../lib/named-pipes.js");
var PipeName = "my_pipe_name";

try {
  let pipe = NamedPipes.connect(PipeName);

  pipe.send(
    "",
    {
      Url: "http://localhost:51549/addStatus",
      Event: "CONNECT_APP",
      MessageId: "vc_1",
    },
    false
  );
 
  pipe = null;
} catch (err) {
  console.log("err", err);
}
