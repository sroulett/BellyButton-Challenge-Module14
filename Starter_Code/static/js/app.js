// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    result = metadata.filter(row => row.id === +sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    result.forEach((data)=>{
      Object.entries(data).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    result = samples.filter(row => row.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    let bubbledata = [bubbleTrace]

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      margin: { t: 30 }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbledata, bubbleLayout); 

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.sort((first, second) => second - first).slice(0,10).reverse().map(id => `OTU ID ${id}`);
    let barTrace ={
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type:'bar',
      orientation:'h'
    };
    let bardata = [barTrace]

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 180 },
      xaxis: {
        title: 'Sample Values'
      },
      yaxis: {
        title: 'OTU ID'
      },

    };

    // Render the Bar Chart
    Plotly.newPlot('bar', bardata, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropMenu = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropMenu.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let dropMenu = d3.select('#selDataset');

  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
