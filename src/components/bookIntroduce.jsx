import React from 'react';

class BookIntroduce extends React.Component{
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

export default BookIntroduce;