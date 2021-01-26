import React, { Component } from 'react'
const axios = require('axios')
const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

  componentDidMount = async () => {
    // const response = await axios.get("/data")


    // Соединение открыто
    socket.addEventListener('open', function (event) {
      socket.send('Hello Server!');
    });

    // Наблюдает за сообщениями
    socket.addEventListener('message', async (event) => {
      console.log('Message from server ', event.data);
      const data = JSON.parse(event.data);
      this.setState({ data })

    });


  }
  render() {
    return (
      <div>
        {this.state.data?.map(e => (
          <div style={{ margin: "20px" }}>

            <div> currency : {e.currency}</div>
            <div> rate : {e.rate}</div>
            <div> bid : {e.bid}</div>
            <div> ask : {e.ask}</div>
            <div> high : {e.high}</div>
            <div> low : {e.low}</div>
            <div> open : {e.open}</div>
            <div> close : {e.close}</div>
            <div> timestamp : {e.timestamp}</div>
          </div>
        ))}
      </div>
    )
  }
}
