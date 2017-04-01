import React from 'react';
import styles from '../styles/bookItem.less';

class BookItem extends React.Component{
  render() {
    return (
      <div className={styles.box}>
        <img src={this.props.data.cover} />
        <p>
          <span>{this.props.data.title}</span><br/>
          <span>{this.props.data.lastChapter}</span>
        </p>
      </div>
    )
  }
}

export default BookItem;