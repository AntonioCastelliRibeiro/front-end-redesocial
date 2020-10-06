import React from 'react';

class Contador extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      date: new Date()
    };
  }


  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidUpdate(){
    if(this.props.state) {return false}
    const lvHora = this.state.date.getHours();
    const lvMin = this.state.date.getMinutes();
    const lvSec = this.state.date.getSeconds();

    if ((lvHora > 23) || (lvHora === 22 && lvMin >= 1  && lvSec >= 0)) {this.props.setarBackGround()}
  }

  componentWillMount(){
    console.log('desmontei')
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        {/* <h1></h1>
        <h2> {this.state.date.toLocaleTimeString()}.</h2> */}
      </div>
    );
  }

}

export default Contador;