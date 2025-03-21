import React, { useEffect } from "react";

function ConsoleCommands() {
  

  return (useEffect(() => {
    window.runCommand = (command) => {
      console.log(`Command received: ${command}`);

      switch (command) {
        case "hello":
          console.log("Hello, world!");
          break;
        case "date":
          console.log(`Today's date is: ${new Date().toLocaleDateString()}`);
          break;
        case "time":
          console.log(`Current time is: ${new Date().toLocaleTimeString()}`);
          break;
        default:
          console.log("Unknown command");
      }
    };
  }, []));
}

export default App;