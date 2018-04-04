import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    Line, PieChart, Pie, Sector
} from 'recharts'
import commonActions from "../actions/commonActions";
import Loader from "../components/Loader";
import loader from '../../assets/earth-loader.svg';
import {getDashboardData} from "../utils/dashboardSelector";


class ActivityDashboard extends PureComponent {

    constructor() {
        super();

        this.state = {
            activeIndex: 0
        }
    }

    componentWillMount() {
        this.props.dispatch(commonActions.setGetUsersActivityRequest());
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                      fill="#333">{`${value} ${value === 1 ? 'event' : 'events'}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    render() {
        const {activityData, commonRequestPending, rateData} = this.props;

        if (commonRequestPending) {
            return (
                <Loader key="loader" loaderSrc={loader} size="250px" loadingText="Loading..."/>
            )
        }

        return (
            <div className="grid-noGutter-spaceAround col-12 dashboard">
                <div className="col-6_xs-12_sm-12_md-10_lg-6_xlg-6 grid-center bar-chart">
                    <p className="message info-message col-12">All users activities:</p>
                    {activityData &&
                    <ComposedChart width={700}
                                   height={500}
                                   data={activityData}
                                   margin={{top: 20, right: 30, bottom: 0, left: 20}}>
                        <XAxis dataKey="username"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <CartesianGrid strokeDasharray="3 3" stroke='#f5f5f5'/>
                        <Bar dataKey="upcoming" stackId="a" fill="#2968ce"/>
                        <Bar dataKey="progress" stackId="a" fill="#821be2"/>
                        <Bar dataKey="completed" stackId="a" fill="#0ccc19"/>
                        <Line type='monotone' dataKey='total' stroke='#d88211'/>
                    </ComposedChart>
                    }

                    {!activityData && <h3 className="message warning-message">No actual data to display.</h3>}
                </div>

                <div className="col-6_xs-12_sm-12_md-10_lg-6_xlg-6 grid-center pie-chart">
                    <p className="message info-message col-12">My events rates:</p>
                    {rateData &&
                        <PieChart
                            width={800}
                            height={400}
                            className="col-11_xs-12_sm-12_md-9_lg-12-xlg-12">
                            <Pie
                                activeIndex={this.state.activeIndex}
                                activeShape={this.renderActiveShape}
                                data={rateData}
                                dataKey="value"
                                cx={300}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                onMouseEnter={this.onPieEnter}
                            />
                        </PieChart>
                    }
                    {!rateData &&
                        <h3 className="message warning-message">You haven't created no one event yet.</h3>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => (state) => {
    return getDashboardData()(state);
};

export default connect(mapStateToProps)(ActivityDashboard);
