import React from 'react';
import styles from '../styles/bookItem.less';

let errorLoading = require('../images/error.jpg')

class BookItem extends React.Component{
  
  handleImageErrored(e){
    e.target.src = errorLoading;
  }

  render() {
    return (
      <div className={styles.box}>
        <img src={this.props.data.cover} onError={this.handleImageErrored} />
        <p>
          <span>{this.props.data.title}</span><br/>
          <span>{this.props.data.lastChapter}</span>
        </p>
      </div>
    )
  }
}

export default BookItem;