/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

function initializeChart(Chart) {
    return class BaseChart extends React.Component {
        constructor(props) {
            super(props);
            this.getWidth = this.getWidth.bind(this);
            this.getHeight = this.getHeight.bind(this);
        }

        // Methods
        getWidth() {
            let width;
            width =
            parseInt(d3.select('#' + this.props.id).style('width')) -
            this.props.margin.left -
            this.props.margin.right || 700;
            return width;
        }

        getHeight() {
            let height;
            // TODO: actually get height
            height = 400;
            return height;
        }

        render() {
            return (
                <Chart
                    { ...this.props }
                    getWidth={ this.getWidth }
                    getHeight={ this.getHeight }
                />
            );
        }
    };
}

initializeChart.propTypes = {
    Chart: PropTypes.element,
    id: PropTypes.string,
    margin: PropTypes.object
};

export default initializeChart;
