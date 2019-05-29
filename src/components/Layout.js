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
    socket.on("newUser", res => console.log(res));
    socket.on("err", err => console.log(err));
    socket.on("success", res => console.log(res));
  };

  render() {
    console.log(socket);
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
