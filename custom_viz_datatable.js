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

  options: {
    showSearch: {
      default: false,
      label: "Show searchbar to search results",
      order: 1,
      section: "Options",
      type: "boolean"
    },
    showPagination: {
      default: false,
      label: "Show pagination to navigate through results",
      order: 2,
      section: "Options",
      type: "boolean"
    }
  },

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function(element, config) {
    // Insert DataTables css file
    element.innerHTML =
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">\
      <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css"/>';

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

    function capitalize(str) {
      str = str.split(" ");

      for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }

      return str.join(" ");
    }

    var dataArr = [];
    var headerArr = [];
    var counter = 0;

    for (let i = 0; i < data.length; i++) {
      var row = data[i];
      var rowData = [];
      for (var key in row) {
        rowData.push(row[key].value);
        if (i == 0) {
          key = key.split(".")[1].replace("_", " ");
          key = capitalize(key);
          headerArr.push({ title: key });
        }
      }
      dataArr.push(rowData);
    }

    var html =
      '<table id="example" class="table table-striped table-bordered" style="width:100%"></table>';
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
