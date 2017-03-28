import React from 'react';
import styles from '../styles/bookItem.less';

class BookItem extends React.Component{
  render() {
    return (
      <div className={styles.box}>
        <img src="http://qidian.qpic.cn/qdbimg/349573/1003354631/180" />
        <p>
          <span>一念永恒</span><br/>
          <span>第一章 他叫白小纯</span>
        </p>
      </div>
    )
  }
}

export default BookItem;