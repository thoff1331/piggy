import React, { Component } from "react";
import io from "socket.io-client";

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
    const socket = io("0.0.0.0", { reconnection: false });
    socket.on("connected", msg => {
      console.log(msg);
    });
    socket.emit("joinRoom", this.props.room);
    socket.on("err", err => console.log(err));
    socket.on("success", res => console.log(res));
    socket.on("newUser", res => console.log(res));
    socket.on("msg", res => {
      if (res.room === this.props.room) {
        this.setState({ messages: [...this.state.messages, res.data] });
      }
    });
  };
  sendMessage = () => {
    const socket = io("0.0.0.0", { reconnection: false });
    socket.emit("newMsg", {
      room: this.props.room,
      data: {
        user: this.state.username,
        message: this.state.message
      }
    });
    this.setState({ message: "" });
  };
  // componentWillUnmount() {
  //   const socket = io("http://localhost:7000/chat", { reconnection: false });
  //   socket.emit("leave", this.props.room);
  //   socket.on("left", res => {
  //     console.log(res);
  //   });
  //   socket.on("disconnect", () => {
  //     socket.disconnect();
  //   });
  // }
  render() {
    // console.log(socket);
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
