import React, { Component } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:7000/chat");

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      message: "",
      messages: []
    };
  }
  componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    socket.on("connected", msg => {
      console.log(msg);
    });
    socket.emit("joinRoom", this.props.room);
    socket.on("err", err => console.log(err));
    socket.on("success", res => console.log(res));
    socket.on("newUser", res => console.log(res));
    socket.on("msg", res => {
      this.setState({ messages: [...this.state.messages, res] });
    });
  };
  sendMessage = () => {
    socket.emit("newMsg", {
      user: this.state.username,
      message: this.state.message
    });
    this.setState({ message: "" });
  };
  render() {
    return (
      <div className="container">
        <div className="card-title">Global Chat</div>
        <div className="messages">
          {this.state.messages.map((message, index) => {
            return (
              <div key={index}>
                {message.user}: {message.message}
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
            value={this.state.message}
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
