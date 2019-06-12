/**
 * This is a Custom Visualization for Looker
 *
 * It's a table visualization based on the DataTables.js library
 *
 * Created by: Egbert Schroeder
 **/

const customVizDataTable = {
  /**
   * Configuration options
   *
   **/

  options: {
    // Plot
    showSearch: {
      default: false,
      label: "Show Searchbar",
      order: 1,
      section: "Plot",
      type: "boolean"
    },
    showPagination: {
      default: false,
      label: "Show Pagination",
      order: 2,
      section: "Plot",
      type: "boolean"
    },
    showRowNumbers: {
      default: false,
      label: "Show Row Numbers",
      order: 2,
      section: "Plot",
      type: "boolean"
    },
    // SERIES
    truncateColumnNames: {
      default: false,
      label: "Truncate Column Names",
      order: 1,
      section: "Series",
      type: "boolean"
    },
    showFullFieldName: {
      default: true,
      label: "Show Full Field Name",
      order: 2,
      section: "Series",
      type: "boolean"
    }
  },

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function(element, config) {
    // Insert Bootstrap and DataTables css file
    element.innerHTML =
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">';

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

    for (let i = 0; i < data.length; i++) {
      var row = data[i];
      var rowData = [];
      for (var key in row) {
        rowData.push(row[key].value);
        if (i == 0) {
          for (var x = 0; x < queryResponse.fields.dimensions.length; x++) {
            if (
              queryResponse.fields.dimensions[x]["suggest_dimension"] == key
            ) {
              var label = queryResponse.fields.dimensions[x].label;
              var label_short = queryResponse.fields.dimensions[x].label_short;
              var type = queryResponse.fields.dimensions[x].type;
            }
          }
          for (var x = 0; x < queryResponse.fields.measures.length; x++) {
            if (queryResponse.fields.measures[x]["suggest_dimension"] == key) {
              var label = queryResponse.fields.measures[x].label;
              var label_short = queryResponse.fields.measures[x].label_short;
              var type = queryResponse.fields.measures[x].type;
            }
          }
          if (config.showFullFieldName == false) {
            var column_title = label_short;
          } else {
            var column_title = label;
          }
          headerArr.push({ title: column_title, type: type });
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
        searching: config.showSearch,
        paging: config.showPagination,
        data: dataArr,
        columns: headerArr
      });
    });
    doneRendering();
  }
};

looker.plugins.visualizations.add(customVizDataTable);
