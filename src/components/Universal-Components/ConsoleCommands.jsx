import React, { useEffect } from "react";

    const ConsoleCommands = ({ cmdAPI }) => {
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
            case "budgetTesterCommand":
                // cmdAPI.setDisplayedBudget((prev) => {
                //     return { ...prev, budget: 100};
                // });
              
                // cmdAPI.setDetails((prev) => {
                //     return { ...prev, budget: 100 };
                // });
                // cmdAPI.budgetSubmit;
                // setTimeout(() => {cmdAPI.handleSelect('entertainment', 'Concert', '90')}, 1000);
                // setTimeout(() => {cmdAPI.handleSelect('entertainment', 'Movie', '25')}, 2000);
                // setTimeout(() => {cmdAPI.handleSelect('entertainment', 'Theater', '50')}, 3000);
              
                // setTimeout(() => {
                //     cmdAPI.setDetails((prev) => {
                //         return { ...prev, budget: 20 };
                //     });
                //     cmdAPI.budgetSubmit;
                // }, 4000);

                //setTimeout(() => {cmdAPI.handleSelect("food", { name: "Dons", price: 25 })}, 1000);
                
                cmdAPI.budgetTest;

            //   cmdAPI.handleSelect("food", { name: "Dons", price: 25 });
            //   cmdAPI.handleSelect("food", { name: "Grimaldis", price: 60 });
            //   cmdAPI.handleSelect("food", { name: "Dons", price: 25 });
            //   cmdAPI.handleSelect("food", { name: "McDonalds", price: 25 });
            //   console.log("Batch food selection complete.");

              break;

            default:
              if (cmdAPI[command]) {
                cmdAPI[command](...args);
              } else {
                console.log("Unknown command");
              }
          }
        };
    }, [cmdAPI]);
    
      return null
}

export default ConsoleCommands;