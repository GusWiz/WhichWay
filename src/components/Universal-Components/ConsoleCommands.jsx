import React, { useEffect } from "react";

    const ConsoleCommands = ({ cmdPassThru }) => {
    useEffect(() => {
        window.runCommand = (command, ...args) => {
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
            case "budgetTest":
              cmdPassThru.budgetTest();
              break;

            default:
              if (cmdPassThru[command]) {
                cmdPassThru[command](...args);
              } else {
                console.log("Unknown command");
              }
          }
        };
    }, [cmdPassThru]);
    
      return null
}

export default ConsoleCommands;