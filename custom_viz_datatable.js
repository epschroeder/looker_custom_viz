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
    // Insert DataTables css file
    element.innerHTML =
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">\
      <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4-4.1.1/jq-3.3.1/dt-1.10.18/datatables.min.css"/>';

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
    if (
      queryResponse.fields.dimensions.length == 0 &&
      queryResponse.fields.measures.length == 0
    ) {
      this.addError({
        title: "No Fields",
        message: "This chart requires at least one dimension or measure."
      });
      return;
    }

    var dataArr = [];
    var headerArr = [];
    var counter = 0;

    for (let i = 0; i < data.length; i++) {
      var row = data[i];
      var rowData = [];
      for (var key in row) {
        //key_new = key.replace('.','_');
        rowData.push(row[key].value);
        if (i == 0) {
          headerArr.push({ title: key });
        }
      }
      dataArr.push(rowData);
    }
    //dataArr = JSON.stringify(dataArr);
    //console.log(headerArr);
    //alert(dataArr);

    var html = '<table id="example" class="table table-striped table-bordered"></table>';
    // Insert the generated html into the page
    this._vizContainer.innerHTML = html;

    $(document).ready(function() {
      //console.log(data);
      $("#example").DataTable({
        searching: true,
        paging: true,
        data: dataArr,
        columns: headerArr
      });
    });
    doneRendering();
  }
};

looker.plugins.visualizations.add(customVizDataTable);
