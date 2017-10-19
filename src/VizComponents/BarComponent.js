// Scatterplot
import React, {Component} from 'react';
import {scaleQuantize,min,max} from 'd3';
import '../css/BarChart.css';
import {ORFrame} from 'semiotic';

const dateAccess = (i) => {
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - (52-i)*7);
    oneWeekAgo = oneWeekAgo.toDateString();
    return oneWeekAgo.substring(4, oneWeekAgo.length);
}

const tooltipFunct = (d) => {
    return <div className="tooltip-content" > <p>Commits: {d.pieces[0].value}</p><p>Date: {d.pieces[0].step}</p></div>
}

const labelAccessor = (d,i) => {
   return <text transform="rotate(45)">{i[0].renderKey %4 === 0 ? d : null}</text>
}


class BarComponent extends Component{
	render() {

        const tiles = Array(this.props.data.length)
            .fill()
            .map((d,i) => ({ step: dateAccess(i), value: this.props.data[i]}))

        const heatScale = scaleQuantize()
            .domain([min(tiles,d => d.value),max(tiles,d => d.value)])
            .range( ["#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);    

        const axis = {
                orient: "left",
                tickFormat: d => d,
                label: {
                  name: this.props.yscaleName,
                  position: { anchor: "middle" },
                  locationDistance: 40
                }
            }
       
		return (
            <ORFrame
            title={this.props.title}
            size={[ 1200,300 ]}
            data={tiles}
            axis={axis}
            projection={'vertical'}
            style={d => ({ fill: heatScale(d.value), stroke: "white", strokeWidth: 0 })}
            type={'bar'}
            oAccessor={d => d.step}
            rAccessor={d => d.value}
            oLabel={(d,i) => labelAccessor(d,i)}
            margin={{ left: 100, top: 50, bottom: 50, right: 50 }}
            oPadding={2}
            disableContext={true} 
            hoverAnnotation={true}
            tooltipContent={d => tooltipFunct(d)}
            />
		);
	}
}

export default BarComponent;
