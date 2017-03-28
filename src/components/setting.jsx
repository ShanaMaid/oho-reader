import React from 'react';

class Setting extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.location.pathname}
      </div>
    )
  }
}

export default Setting;