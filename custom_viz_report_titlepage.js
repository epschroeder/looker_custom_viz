/**
 * This is a Custom Visualization for Looker
 *
 * It shows the first 2 dimension columns as a title and a paragraph
 *
 * CREATED BY: Egbert Schroeder
 *
 * DEPENDENCIES:
 *
 *
 * TODO:
 *
 **/

const customVizReportTitlePage = {
    /**
     * Configuration options
     *
     **/

    options: {
        backgroundImageUrl: {
            default: 'https://via.placeholder.com/1920x1080',
            label: "Background Image URL",
            order: 1,
            type: "string"
        },
    },

    /**
     * The create function gets called when the visualization is mounted but before any
     * data is passed to it.
     **/
    create: function (element, config) {
        // Insert Bootstrap css file
        element.innerHTML =
            '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">';

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
                message: "This chart requires dimensions."
            });
            return;
        }

        // Select first row of data
        var firstRow = data[0];

        // Grab first column for the report title
        var title = firstRow[queryResponse.fields.dimensions[0].name];

        // Grab second column for the report subtitle/period
        var subTitle = firstRow[queryResponse.fields.dimensions[1].name];

        // Insert the data into text elements
        var html = '<img src="https://via.placeholder.com/1920x1080" class="img-fluid" alt="">';

        // Insert the generated html into the page
        this._vizContainer.innerHTML = html;
        console.log(config.backgroundImageUrl);
        doneRendering();
    }
};

looker.plugins.visualizations.add(customVizReportTitlePage);
