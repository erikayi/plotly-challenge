
function buildPlot(BellyData) {

    // Fetch the JSON data and console log it
    d3.json("../../samples.json").then(function(data) {
    console.log(data);

    var ethnicity = data.metadata.map(race => race.ethnicity);
    console.log(`Ethnicities: ${ethnicity}`);

    var bbtype = data.metadata.map(bb => bb.bbtype);
    console.log(`Belly Button Types: ${bbtype}`);

    // Filter by ids
    var sample_values = data.samples.filter(sampleid => sampleid.id);
    console.log(sample_values);

    // Select one of the samples from the array
    var oneSample = sample_values[6];
    console.log(oneSample);
  
    // get top 10 sample_values of an individual
    var top10values = oneSample.sample_values.slice(0, 10); // includes 0 and excluding 10 to get only top 10
    console.log(top10values);

    // reverse the data because we want the highest values on the top
    top10values.reverse();

    // get top 10 otu_ids of an individual 
    var top10otu_ids = oneSample.otu_ids.slice(0, 10);
    console.log(top10otu_ids);

    // reverse it here to match with the labels
    top10otu_ids.reverse();

    // get the labels for each OTU labels for bar chart 
    var otu_label = top10otu_ids.map(label => "OTU " + label);
    console.log(`OTU IDs: ${otu_label}`);

    // put in the bar chart
    var OTU_barChart = [{
        type: 'bar',
        x: top10values,
        y: otu_label,
        orientation: 'h'
      }];
      
      Plotly.newPlot('bar', OTU_barChart);

      

    


});

};

buildPlot();
