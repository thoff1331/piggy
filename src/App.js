import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Layout from "./components/Layout";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      latitude: 0,
      longitude: 0,
      compareLatitude: 0,
      compareLongitude: 0,
      miles: 0,
      button: true
    };
  }
  componentDidMount = () => {
    this.getLocation();
  };
  getLocation = () => {
    navigator.geolocation.getCurrentPosition(this.showPosition);
  };

  showPosition = position => {
    let display = `Latitude: ${position.coords.latitude} Longitude: ${
      position.coords.longitude
    }`;
    this.setState({
      display,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  };
  latChangeHandler = e => {
    this.setState({ compareLatitude: e.target.value });
  };
  lonChangeHandler = e => {
    this.setState({ compareLongitude: e.target.value });
  };
  calClickHandler = () => {
    let milesSquared =
      Math.pow(this.state.latitude - this.state.compareLatitude, 2) +
      Math.pow(this.state.longitude - this.state.compareLongitude, 2);
    let miles = Math.sqrt(milesSquared) / 0.0145;
    this.setState({ miles });
  };
  buttonClickHandler = () => {
    this.setState({ button: !this.state.button });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.button ? (
            <div>
              {" "}
              <button onClick={this.buttonClickHandler}>Maybe</button>
              <Layout room={"test"} />
            </div>
          ) : (
            <div>
              <button onClick={this.buttonClickHandler}>Test</button>
              <Layout room={"maybe"} />
            </div>
          )}
          {this.state.display}
          <input onChange={this.latChangeHandler} placeholder="lat" />
          <input onChange={this.lonChangeHandler} placeholder="lon" />
          <button onClick={this.calClickHandler}>Calculate distance</button>
          {this.state.miles !== 0 ? <p>{this.state.miles} miles away</p> : null}
        </header>
      </div>
    );
  }
}

export default App;
