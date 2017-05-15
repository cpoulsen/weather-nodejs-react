import React, {Component} from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {Tabs, Tab} from 'material-ui/Tabs';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';
import Skycons from 'react-skycons';
import axios from 'axios';


const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
    tabs: {
        backgroundColor: '#2B323B'
    },
    inkBar: {
        backgroundColor: '#BBC1F3'
    }

});

const style = {
    container: {
        position: 'relative',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    }
};

const icon = {
    height: 60,
    width: 120
};



function _roundingDecimal(number) {
    var decimalNumber = Math.round(number * 10) / 10
    return decimalNumber;
};

function _cutTime(time) {
    moment.locale('en-gb');
    var dateTime = moment(time*1000).format('LT');
    if (dateTime == '00:00') {
        return '24:00'
    }
    else {
        return dateTime;
    }

};

function _theDay(time) {
    moment.locale('en-gb');
    var dateTime = moment(time*1000).format('dddd');
    return dateTime;
};

class Summary extends Component {
    render() {
        return (
            <div className="col-xs-6 col-md-3 text-center vcenter box parent right-arrow">
                <div className="child">
                    <div className="text-center" id="summary">{this.props.summary}</div>
                </div>
            </div>
        );
    }
}


class Hourly extends Component {
    render() {
        return (
            <div id={this.props.id} className="col-xs-6 col-md-3 text-center vcenter box parent">
                <div className="child">
                    <div>{_theDay(this.props.day)}</div>
                    <div>{_cutTime(this.props.time)}</div>
                    <div className="temp">{Math.round(this.props.temperature)}&deg;C</div>
                    <div className="">Feels like {Math.round(this.props.apparentTemperature)}&deg;C</div>
                    <div>{this.props.summary}</div>
                    <div><Skycons style={icon} color='white' icon={this.props.icon.toUpperCase().replace(/-/g, "_")}/></div>
                    <div>{_roundingDecimal(this.props.precipIntensity)} mm</div>
                    <div>{_roundingDecimal(this.props.windSpeed)} m/s</div>
                </div>
            </div>
        );
    }
}

class Daily extends Component {
    render() {
        return (
            <div id={this.props.id} className="col-xs-6 col-md-3 text-center vcenter box parent">
                <div className="child">
                    <div>{_theDay(this.props.day)}</div>
                    <div className="temp">{Math.round(this.props.temperatureMax)}&deg;C</div>
                    <div>{this.props.summary}</div>
                    <div><Skycons style={icon} color='white' icon={this.props.icon.toUpperCase().replace(/-/g, "_")}/></div>
                    <div>{_roundingDecimal(this.props.precipIntensity)} mm</div>
                    <div>{_roundingDecimal(this.props.windSpeed)} m/s</div>
                </div>
            </div>
        );
    }
}


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weatherData: '',
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        if (navigator.geolocation){
            function success(position) {

                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
        axios.get('/api/forecast/'+latitude+'/'+longitude)
            .then(function (response) {
                this.setState({
                    weatherData: response.data,
                    loading: false,
                    error: null
                })
            }.bind(this));

        };
        function error() {
            console.log( 'geolocation error' )
        };
        navigator.geolocation.getCurrentPosition(success.bind(this), error);
    }
}

    renderLoading() {
        return  (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="text-center" id="loading-spinner">
                            <RefreshIndicator
                                size={70}
                                left={0}
                                top={0}
                                loadingColor={"#2B323B"}
                                status="loading"
                                style={style.refresh}
                            />
                            <p id="loading-text">Fetching your current location - Hang on</p>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    renderError() {
        return (
            <div id="error" className="text-center">
                Uh oh: {this.state.error.message}
            </div>
        );
    }

    renderWeather() {
        if(this.state.error) {
            return this.renderError();
        }

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Tabs>
                    <Tab label="Hourly" value="hourly" >
                        <div className="row" className="mainContent">
                            <Summary summary={this.state.weatherData.hourly.summary}/>
                            {this.state.weatherData.hourly.data.slice(0,23).map(hour => {
                                return (
                                    <Hourly
                                        key={hour.time}
                                        id={hour.time}
                                        day={hour.time}
                                        time={hour.time}
                                        temperature={hour.temperature}
                                        apparentTemperature={hour.apparentTemperature}
                                        summary={hour.summary}
                                        icon={hour.icon}
                                        precipIntensity={hour.precipIntensity}
                                        windSpeed={hour.windSpeed}
                                    />
                                );
                            })}
                        </div>
                        <a className="poweredby pull-right" href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
                    </Tab>
                    <Tab label="Daily" value="daily">
                        <div className="row" className="mainContent">
                            <Summary summary={this.state.weatherData.daily.summary}/>
                            {this.state.weatherData.daily.data.slice(0,7).map(day => {
                                return (
                                    <Daily
                                        key={day.time}
                                        id={day.time}
                                        day={day.time}
                                        temperatureMax={day.temperatureMax}
                                        summary={day.summary}
                                        icon={day.icon}
                                        precipIntensity={day.precipIntensity}
                                        windSpeed={day.windSpeed}
                                    />
                                );
                            })}
                        </div>
                        <a className="poweredby pull-right" href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
                    </Tab>

                </Tabs>

            </MuiThemeProvider>
        );
    }
    render() {
        return (
            <div>
                {this.state.loading ?
                    this.renderLoading()
                    : this.renderWeather()}
            </div>
        );
    }
}


export default Main;
