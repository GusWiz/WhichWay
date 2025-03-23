// How to use this file:
// First, in the page that you want to use a console command, create a function inside that page, not this one,
// that runs the series of commands that you want to test. Then create a new structure called "const cmdPassThru"
// and it should looks something like this:
//
//      const cmdPassthru = {
//          budgetTest
//      };
//
// where budgetTest is the function I created and want to be used here. This should be inside the App portion
// of your page but before its return().
//
// Then, inside the return function, find anywhere to place
//
//      <ConsoleCommands cmdPassThru={cmdPassthru} />
//
// like you would any other page component. Doesn't matter where its placed
//
// Then, just create a new case inside the switch block where the case is the command you want to type.
// Run commands by doing
//
//      runCommand("budgetTest")
//
// in the console.


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
