/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

const customTextViz = {
    /**
     * Configuration options for your visualization. In Looker, these show up in the vis editor
     * panel but here, you can just manually set your default values in the code.
     **/
    options: {
       font_size: {
         type: "string",
         label: "Font Size",
         values: [
           {"Large": "large"},
           {"Small": "small"}
         ],
         display: "radio",
         default: "large"
       }
     },
    
    /**
     * The create function gets called when the visualization is mounted but before any
     * data is passed to it.
     **/
       create: function(element, config){
            // Insert a <style> tag with some styles we'll use later.
       var css = element.innerHTML = `
         <style>
           .hello-world-vis {
             /* Vertical centering */
             height: 100%;
             display: flex;
             flex-direction: column;
             justify-content: center;
             text-align: left;
           }
           .hello-world-text-large {
             font-size: 72px;
           }
           .hello-world-text-small {
             font-size: 18px;
           }
         </style>
       `;
   
       // Create a container element to let us center the text.
       var container = element.appendChild(document.createElement("div"));
       container.className = "hello-world-vis hello-world-text-small";
   
       // Create an element to contain the text.
       this._textElement = container.appendChild(document.createElement("div"));
       },
   
    /**
     * UpdateAsync is the function that gets called (potentially) multiple times. It receives
     * the data and should update the visualization with the new data.
     **/
       updateAsync: function(data, element, config, queryResponse, details, doneRendering){
          // Clear any errors from previous updates
       this.clearErrors();
   
       // Throw some errors and exit if the shape of the data isn't what this chart needs
       if (queryResponse.fields.dimensions.length == 0) {
         this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
         return;
       }
   
       // Grab the first cell of the data
       
       for (i = 0; i < data.length; i++) { 
       var row = data[i];
       column = row[queryResponse.fields.dimensions[0].name];
         
       this._textElement.innerHTML += LookerCharts.Utils.htmlForCell(column) + '<br /><br />';  
       }
       
    //    var firstRow = data[0];
    //    var firstCell = firstRow[queryResponse.fields.dimensions[0].name];
   
       // Insert the data into the page
    //    this._textElement.innerHTML = text;
   
       // Set the size to the user-selected size
       if (config.font_size == "small") {
         this._textElement.className = "hello-world-text-small";
       } else {
         this._textElement.className = "hello-world-text-small";
       }
       }
   };
   
   looker.plugins.visualizations.add(customTextViz);
