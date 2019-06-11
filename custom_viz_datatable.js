/**
 * This is a Custom Visualization for Looker
 *
 * It shows the first 2 dimension columns from the fir result as a title and a paragraph
 *
 * Created by: Egbert Schroeder
 **/

const customVizDataTable = {
  /**
   * Configuration options
   *
   **/

  options: {},

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function(element, config) {
    // Insert Bootstrap css file
    element.innerHTML =
      '<link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">';

    // Create a container element to let us center the text.
    this._vizContainer = element.appendChild(document.createElement("div"));
  },

  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function(
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
        message: "This chart requires dimensions."
      });
      return;
    }

    // Grab the first cell of the data
    // var first_row = data[0];

    // Grab first column
    // var cell1 = first_row[queryResponse.fields.dimensions[0].name];

    // Grab second column
    // var cell2 = first_row[queryResponse.fields.dimensions[1].name];

    // Insert the data into table elements
    // var html = "<tr>";
    // html += "<td>" + LookerCharts.Utils.htmlForCell(title) + "</td>";
    // html += "<td>" + LookerCharts.Utils.htmlForCell(paragraph) + "</td>";
    // html += "</tr>";

    var html =
      '<table id="example"><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>3268978</td><td>45644564564</td></tr></tbody></table>';
    // Insert the generated html into the page
    this._vizContainer.innerHTML = html;

    doneRendering();

    $(document).ready(function() {
      console.log(queryResponse);
      $("#example").DataTable({
        paging: false,
        data: queryResponse
      });
    });
  }
};

looker.plugins.visualizations.add(customVizDataTable);
