var NamedPipes = require("../lib/named-pipes.js");
var PipeNameWithNoPrefix = "my_pipe_name";
var PipeNameWithPrefix = "\\\\.\\pipe\\my_pipe_name";

// pipe name with no prefix
try {
  let pipe = NamedPipes.connect(PipeNameWithNoPrefix);

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

// pipe name with prefix
// try {
//   let pipe = NamedPipes.connect(PipeNameWithPrefix);

//   pipe.send(
//     "",
//     {
//       Url: "http://localhost:51549/addStatus",
//       Event: "CONNECT_APP",
//       MessageId: "vc_2",
//     },
//     false
//   );

//   pipe = null;
// } catch (err) {
//   console.log("err", err);
// }
