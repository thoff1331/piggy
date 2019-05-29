import React, { Component } from "react";
import io from "socket.io-client";
// const socketUrl = "172.31.99.90:8080";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      username: "",
      message: "",
      messages: []
    };
  }
  componentWillMount() {
    this.initSocket();
  }
  sendMessage = ev => {
    console.log("helloooo");
    this.state.socket.emit("SEND_MESSAGE", {
      author: this.state.username,
      message: this.state.message
    });
    this.setState({ message: "" });
    this.state.socket.on("RECEIVE_MESSAGE", data => {
      let { messages } = this.state;
      messages.push(data);
      this.setState({ messages });
    });
  };
  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("connected");
    });
    this.setState({ socket });
  };

  render() {
    return (
      <div className="container">
        <div className="card-title">Global Chat</div>
        <div className="messages">
          {this.state.messages.map(message => {
            return (
              <div>
                {message.author}: {message.message}
              </div>
            );
          })}
        </div>

        <div className="card-footer">
          <input
            type="text"
            placeholder="Username"
            onChange={ev => this.setState({ username: ev.target.value })}
          />
          <br />
          <input
            type="text"
            placeholder="Message"
            onChange={ev => this.setState({ message: ev.target.value })}
          />
          <br />
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default Layout;
