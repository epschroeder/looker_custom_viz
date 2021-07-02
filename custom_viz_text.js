/**
 * This is a Custom Visualization for Looker
 *
 * It shows the first 2 dimension columns as a title and a paragraph
 *
 * CREATED BY: Egbert Schroeder
 *
 **/

const customVizTextFromData = {
  /**
   * Configuration options
   *
   **/

  options: {},

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function (element, config) {
    // Insert Bootstrap css file
    element.innerHTML =
      '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet">';

    // Create a container element to let us center the text.
    this._vizContainer = element.appendChild(document.createElement("div"));
    this._vizContainer.className = "container-fluid";
  },

  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    doneRendering
  ) {
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions.",
      });
      return;
    }

    var html = "";
    // Iterate through every row in the data
    for (var x = 0; x < data.length; x++) {
      var row = data[x];

      // Grab first column for the title
      var title = row[queryResponse.fields.dimensions[0].name];

      // Grab second column for the paragraph
      var paragraph = row[queryResponse.fields.dimensions[1].name];

      // Insert the data into text elements
      html += "<h4>" + LookerCharts.Utils.htmlForCell(title) + "</h4>";
      html += "<p>" + LookerCharts.Utils.textForCell(paragraph) + "</p>";
    }

    html += "";

    // Insert the generated html into the page
    this._vizContainer.innerHTML = html;

    doneRendering();
  },
};

looker.plugins.visualizations.add(customVizTextFromData);
