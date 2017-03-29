import React from 'react';
import template from './template'

class BookIntroduce extends React.Component{
  constructor(props) {
    super(props);
    this.props.getBokkIntroduce(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }
  render() {
    return (
      <div>
        {this.props.location.pathname}
      </div>
    )
  }
}

export default template(BookIntroduce);