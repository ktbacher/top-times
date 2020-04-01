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
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
            var ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
            var worldRecords = [];
            ordered.forEach(t => {
                if (worldRecords.length == 0) {
                    worldRecords.push(t);
                }
                else if (t.Time < worldRecords.slice(-1,)[0].Time) {
                    worldRecords.push(t)
                }
            })

            svg.selectAll("g").remove();

            // Add X axis
            // var x = d3.scaleTime()
            var x = d3.time.scale()
                .domain([new Date("1960-1-1"), new Date("2018-1-1")])
                .range([ margin.left, width ]);
            // var xMargin = x.copy().range([margin.left, width - margin.right]);
            // svg.append("g")
            //     .attr("transform", "translate(0," + height + ")")
            //     // .call(d3.axisBottom(x));
            //     .call(d3.svg.axis(x));
            
            // Add Y axis
            var orderT = data.filter(d=> d.Event === event && d.Gender === gender).sort((a,b) => a.Time > b.Time);
            var minT = orderT[0].Time;
            var maxT = orderT.slice(-1,)[0].Time;
            // var y = d3.scaleLinear()
            var y = d3.scale.linear()
                .domain([minT.slice(0,2)*60*60+ minT.slice(3,5)*60+minT.slice(6,)*1, maxT.slice(0,2)*60*60+ maxT.slice(3,5)*60+maxT.slice(6,)*1])
                .range([ height, 0]);
            yMargin = y.copy().range([height - margin.bottom, margin.top]);
            // svg.append("g")
            //     .attr("transform", "translate("+margin.left+",0)")
            //     // .call(d3.axisLeft(y));
            //     .call(d3.svg.axis(y));
            var xAxis = d3.svg.axis()
                .scale(x);
                // .tickSize(-height);
            var yAxis = d3.svg.axis()
                .scale(y)
                // .ticks(4)
                .orient("left");
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
          
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);

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
                    tooltip.html(d.Name +"<br>"+ d.Time.slice(0,11)+"<br>"+d.Country)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("width", d.Name.length *7 +'px');	
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
                    tooltip.html(d.Name +"<br>"+ d.Time.slice(0,11)+"<br>"+d.Country)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("width", d.Name.length *7 +'px');	
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
            // console.log(ordered.slice(-1,)[0]);
            return ordered.slice(-1,)[0];
        });
    }

function makeMap(event, gender, lastDate=new Date("2018-1-1")) {
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
        var ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
        var counts = [];
        d3.csv("https://gist.githubusercontent.com/ktbacher/11888ae83d0b83b5a1d0072f1aa99d20/raw/fd6e18415a256ec37e0ca239f60d57bce659ba4b/country_geo.csv", function(geodata) {
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
            console.log("not found: ", notfound);
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
                
                // data: {
                // USA: {fillKey: 'lt50' },
                // RUS: {fillKey: 'lt50' },
                // CAN: {fillKey: 'lt50' },
                // BRA: {fillKey: 'gt50' },
                // ARG: {fillKey: 'gt50'},
                // COL: {fillKey: 'gt50' },
                // AUS: {fillKey: 'gt50' },
                // ZAF: {fillKey: 'gt50' },
                // MAD: {fillKey: 'gt50' }       
                // }
            })
            
            
            //sample of the arc plugin
            // map.arc([
            // {
            //     origin: {
            //         latitude: 40.639722,
            //         longitude: 73.778889
            //     },
            //     destination: {
            //         latitude: 37.618889,
            //         longitude: -122.375
            //     }
            // },
            // {
            //     origin: {
            //         latitude: 30.194444,
            //         longitude: -97.67
            //     },
            //     destination: {
            //         latitude: 25.793333,
            //         longitude: -0.290556
            //     }
            // }
            // ], {strokeWidth: 2});
            
            
            //bubbles, custom popup on hover template
            // map.bubbles([
            //     {name: 'Hot', latitude: 21.32, longitude: 5.32, radius: 10, fillKey: 'gt50'},
            //     {name: 'Chilly', latitude: -25.32, longitude: 120.32, radius: 18, fillKey: 'lt50'},
            //     {name: 'Hot again', latitude: 21.32, longitude: -84.32, radius: 8, fillKey: 'gt50'},
            
            //     ], {
            //     popupTemplate: function(geo, data) {
            //         return "<div class='hoverinfo'>It is " + data.name + "</div>";
            //     }
            // });
            console.log(counts);
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
        console.log("not found: ", notfound);
        console.log(counts);
        map.bubbles(counts, {
            popupTemplate: function(geo, data) {
                return "<div class='hoverinfo'>"+data.Country+" has "+Math.floor(data.radius*10)+" top marks.</div>";
            }
        });
        console.log("new map?")
        
        return data;
    });
}