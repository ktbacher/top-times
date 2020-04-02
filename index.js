// let i = document.querySelector('input');
// let t = document.querySelector('h2');

// var distances = ['100 m', '200 m', '400 m', '800 m', '1 mile', '5000 m', '10,000 m', 'Marathon'];

// // console.log(i.value);
// t.innerHTML = i.value;

// i.addEventListener('input', function () {
//     t.innerHTML = i.value;
//   }, false);
var map; 
var locationData;

function makeChart(event, gender, lastDate=new Date("2018-1-1")) {
    var created = false;
    var ordered = [];
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
            ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
            created = true;
            var worldRecords = [];
            ordered.forEach(t => {
                if (worldRecords.length == 0) {
                    worldRecords.push(t);
                }
                else if (t.Time < worldRecords.slice(-1,)[0].Time) {
                    worldRecords.push(t)
                }
            })
            // console.log("w", width);
            // console.log("h", height);
            svg.selectAll("g").remove();
            svg.selectAll("line").remove();

            var formatTime = d3.time.format("%M:%S.%L"),
                formatMinutes = function(d) {
                    // console.log("old", new Date(2000, 0, 1, 0, 0, d).getSeconds()); console.log("d",new Date(Math.floor(d*1000))); console.log("new",new Date(Math.floor(d*1000)).getSeconds());
                    return formatTime(new Date(d*1000)).slice(0,7);};
                    // return formatTime(new Date(2000, 0, 1, 0, 0, d)); };

            // Add X axis
            // var x = d3.scaleTime()
            var x = d3.time.scale()
                .domain([new Date("1960-1-1"), new Date("2018-1-1")])
                .range([ margin.left, width ]);
            
            // Add Y axis
            var orderT = data.filter(d=> d.Event === event && d.Gender === gender).sort((a,b) => a.Time > b.Time);
            var minT = orderT[0].Time;
            var maxT = orderT.slice(-1,)[0].Time;
            // var y = d3.scaleLinear()
            var y = d3.scale.linear()
                .domain([minT.slice(0,2)*60*60+ minT.slice(3,5)*60+minT.slice(6,)*1, maxT.slice(0,2)*60*60+ maxT.slice(3,5)*60+maxT.slice(6,)*1])
                .range([ height, 0]);
            yMargin = y.copy().range([height - margin.bottom, margin.top]);

            var xAxis = d3.svg.axis()
                .scale(x);
            var yAxis = d3.svg.axis()
                .scale(y)
                // .ticks(5)
                .orient("left")
                .tickFormat(formatMinutes);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
          
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
            
            // svg.append("path")
            //     .attr("class", "line")
            //     .style("stroke-dasharray", ("3, 3"))  // <== This line here!!
            //     .attr("d", worldRecords.slice(-1,)[0]);
            d = worldRecords.slice(-1,);
            lines = [{x1: margin.left, x2: width, y1: d[0].Time.slice(0,2)*60*60+ d[0].Time.slice(3,5)*60+d[0].Time.slice(6,)*1, y2: d[0].Time.slice(0,2)*60*60+ d[0].Time.slice(3,5)*60+d[0].Time.slice(6,)*1}];//horizontal
        
            svg.selectAll(".grid-line")
                .data(lines).enter()
                .append("line")
                .attr("x1", function(d){ return d.x1; })
                .attr("x2", function(d){ return d.x2; })
                .attr("y1", function(d){ return y(d.y1); })
                .attr("y2", function(d){ return y(d.y2); })
                .style("stroke-dasharray", ("3, 3"))  // <== This line here!!
                .style("stroke", "#000")

            svg.append('g')
                .selectAll("text")
                .data(d)
                .enter()
                .append("text")
                .attr('x', margin.left)
                .attr('y', d=> y(d.Time.slice(0,2)*60*60+ d.Time.slice(3,5)*60+d.Time.slice(6,)*1))
                .attr('dx', 10)
                .attr('dy', '-5px')
                // .attr('fill', 'black')
                .style('font-size', 'small')
                .text(d => d.Time.slice(3,11))


            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(ordered)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(new Date(d.Date)); } )
                .attr("cy", function (d) { return y(d.Time.slice(0,2)*60*60+ d.Time.slice(3,5)*60+d.Time.slice(6,)*1); } )
                .attr("r", 3)
                .style("fill", "#d3d3d3")
                .on("mouseover", function(d) {		
                    // console.log(d.Name);
                    tooltip.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    tooltip.html(d.Name +"<br>"+ d.Time.slice(3,11)+"<br>"+d.Country)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("width", d.Name.length *8 +'px');	
                    // tooltip.style("opacity", .9);
                    // tooltip.text(d.Name);
                    // return tooltip
                    })
                // .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})					
                .on("mouseout", function(d) {		
                    tooltip.transition()		
                        .duration(500)		
                        .style("opacity", 0);
                    // return tooltip.style("opacity", 0);	
                });
            svg.append('g')
                .selectAll("dot")
                .data(worldRecords)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(new Date(d.Date)); } )
                // .attr("cy", function (d) { return y(new Date("January 1, 1970 " +d.Time.slice(0,8))); } )
                .attr("cy", function (d) { return y(d.Time.slice(0,2)*60*60+ d.Time.slice(3,5)*60+d.Time.slice(6,)*1); } )
                .attr("r", 5)
                .style("fill", "#e76060")
                .on("mouseover", function(d) {		
                    // console.log(d.Name);
                    tooltip.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    tooltip.html(d.Name +"<br>"+ d.Time.slice(3,11)+"<br>"+d.Country)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("width", d.Name.length *8 +'px');	
                    // tooltip.style("opacity", .9);
                    // tooltip.text(d.Name);
                    // return tooltip
                    })
                // .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})					
                .on("mouseout", function(d) {		
                    tooltip.transition()		
                        .duration(500)		
                        .style("opacity", 0);
                    // return tooltip.style("opacity", 0);	
                });
            // console.log("here", worldRecords.slice(-1,)[0]);
            // updateText(worldRecords.slice(-1,)[0]);
            return ordered.slice(-1,)[0];
        });
    }

// function updateText(data) {
//     if (data !== undefined) {
//         o.innerHTML = "Best time to date is " + data.Time.slice(3,11);
//     } else {
//         o.innerHTML = "Use slider to explore progression over time"
//     }
// }

function setBubble(range, bubble) {
    const val = range.value;
    const year =1900 + new Date(new Date("1960-1-1").getTime()+new Date((new Date("2018-1-1").getTime()-new Date("1960-1-1").getTime())*range.value/100).getTime()).getYear();
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = year;
  
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left =  `calc(${50+newVal/2}% + (${0 - newVal * .5}px))`;
    // bubble.style.left =  `calc(${50+newVal/2}% + (${8 - newVal * 1}px))`;
  }

function makeMap(event, gender, lastDate=new Date("2018-1-1")) {
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
        var ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
        var counts = [];
        d3.csv("https://gist.githubusercontent.com/ktbacher/548c594460a610147e1e9ba0749a5d0f/raw/ae02654ad9b6fe2e07d883b503448ef75bd2be7b/country_centroids_editted.csv", function(geodata) {
        // d3.csv("https://gist.githubusercontent.com/ktbacher/548c594460a610147e1e9ba0749a5d0f/raw/ec864577e1e2eb98b298f117b68fe2d6d701a490/country_centroids_editted.csv", function(geodata) {
        // d3.csv("https://gist.githubusercontent.com/ktbacher/548c594460a610147e1e9ba0749a5d0f/raw/ab8c88e8f20cd1fca6cd9c5ea225f7ca4a7c9efe/country_centroids_editted.csv", function(geodata) {
            locationData = geodata;
            var notfound = [];
            ordered.forEach(d => {
                var country = counts.find(entry => {return entry.Country == d.Country})
                if(country != undefined) {
                    country.radius += .1;
                } else {
                    var geoDat = geodata.find(geo=> {return geo.adm0_a3 == d.Country})
                    if (geoDat != undefined) {
                        counts.push({Country: d.Country, radius: .1, latitude: geoDat.Latitude, longitude: geoDat.Longitude, fillKey: 'gt50'})
                    } else {
                        notfound.push(d.Country);
                    }

                }
            });
            // console.log(counts);
            // console.log("not found: ", notfound);
            map = new Datamap({
                scope: 'world',
                element: document.getElementById('map'),
                projection: 'mercator',
                height: 350,
                fills: {
                defaultFill: 'grey',//'#f0af0a',
                lt50: 'rgba(0,244,244,0.9)',
                gt50: 'red'
                },
            })
            
            
            map.bubbles(counts, {
                popupTemplate: function(geo, data) {
                    return "<div class='hoverinfo'>"+data.Country+" has "+Math.floor(data.radius*10)+" marks in the top 1000.</div>";
                }
            });
            return map;
        })
        
        return data;
    });
}

function updateMap(event, gender, lastDate=new Date("2018-1-1")) {
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
        var ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
        var counts = [];
        var notfound = [];
        ordered.forEach(d => {
            var country = counts.find(entry => {return entry.Country == d.Country})
            if(country != undefined) {
                country.radius += .1;
            } else {
                var geoDat = locationData.find(geo=> {return geo.adm0_a3 == d.Country})
                if (geoDat != undefined) {
                    counts.push({Country: d.Country, radius: .1, latitude: geoDat.Latitude, longitude: geoDat.Longitude, fillKey: 'gt50'})
                } else {
                    notfound.push(d.Country);
                }

            }
        });
        // console.log(counts);
        // console.log("not found: ", notfound);
        // console.log(counts);
        map.bubbles(counts, {
            popupTemplate: function(geo, data) {
                return "<div class='hoverinfo'>"+data.Country+" has "+Math.floor(data.radius*10)+" top marks.</div>";
            }
        });
        // console.log("new map?")
        
        return data;
    });
}