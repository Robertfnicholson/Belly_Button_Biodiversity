function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
// "Plot.js file" has "{)}" on the next line - it does because the code ended there. In challenge, we extend code
}

// Initialize the dashboard
init();

// When a change takes place in the dropdown, call a function
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample); 
}

// Demographics Panel - 
// declare the first of these functions buildMetadata().
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // Below line of code is add from "plot.js
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // added console.log with gauge chart
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    // Referenced code from Module 12 and provided starter code.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray2 = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray2[0];  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct variable definitions using slice method to get top 10 sample results.
    var  ids = result.otu_ids;
    var labels = result.otu_labels.slice(0, 10).reverse();
    var values = result.sample_values.slice(0,10).reverse();
    console.log(labels);
    console.log(values);

    // Create variables for the bubble chart labels and values
    // // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct code error in deliverable 2, step 1-2 by adding variables.
    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log(yticks);
  
    // 8. Create the trace for the bar chart. 
    // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct variable definition.
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
// Create a Bubble charts

    // 1. Create the trace for the bubble chart.
    // Referenced code from https://plotly.com/javascript/bubble-charts/
    // // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct variable definition above in deliverable 1, step 6.
    var bubbleData = [{
      x: ids,
      y: bubbleValues,
      text: bubbleLabels,
      mode: 'markers',
      marker: {
        size: bubbleValues,
        color: ids,
        colorscale: 'Earth'
      }
    }];

    // 2. Create the layout for the bubble chart.
     // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct variable definition above in deliverable 1, step 6.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      automargin: true,
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // Create a gauge chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample)
  
    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washfreq = gaugeResult.washfreq;
    colsole.log(washfreq);
    
    // 4. Create the trace for the gauge chart.
    // Referenced code from Emmanuel Martinez (emmanuelmartinezs), "charts.js" on GitHub to correct syntax for 
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washfreq,
        title: { text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week", font: { size: 24 } },     
        gauge: {
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0, 2, color: "red" },
            { range: [2, 4, color: "orange" },
            { range: [4, 6, color: "yellow" },
            { range: [6, 8, color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          dtick: 2
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automatrgin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
