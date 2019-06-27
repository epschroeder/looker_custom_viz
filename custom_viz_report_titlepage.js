/**
 * This is a Custom Visualization for Looker
 *
 * It shows a full-width background image the first 2 dimension columns as a title and a subtitle
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
            headerImageUrl: {
                type: "string",
                label: "Image URL",
                default: 'https://via.placeholder.com/1920x1080',
                placeholder: 'https://via.placeholder.com/1920x1080',
                order: 1,
            },
            headerImageWidth: {
                type: "boolean",
                label: "Full Width Image",
                default: false,
                order: 2
            }
        },

        /**
         * The create function gets called when the visualization is mounted but before any
         * data is passed to it.
         **/
        create: function (element, config) {
            // Insert Bootstrap css file
            element.innerHTML = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
             <style>
                body, html {
                    height: 100%;
                }
                
                .row {
                    height:50vh;
                    overflow: hidden;
                }
             </style>`;

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
            if (queryResponse.fields.dimensions.length < 2) {
                this.addError({
                    title: "Not Enough Dimensions",
                    message: "This visualisation requires 2 dimensions."
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
            var html = `<div class="row">
                            <div class="col text-center align-self-center">
                                <img src="` + config.headerImageUrl + `" id="header-image" class="img-fluid" alt="">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col text-center align-self-center"><h1 class="display-3">` + title.value + `</h1>
                            <h3>` + subTitle.value + `</h3>
                          </div>
                        </div>`;

            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;
            //console.log(config.backgroundImageUrl);

            if (config.headerImageWidth == true) {
                document.getElementById("header-image").classList.add('w-100');
            } else {
                document.getElementById("header-image").classList.remove('w-100');
            }
            ;

            doneRendering();
        }
    }
;

looker.plugins.visualizations.add(customVizReportTitlePage);
