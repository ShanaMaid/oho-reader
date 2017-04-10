import React from 'react';
import styles from '../styles/bookItem.less';
import Tappable from 'react-tappable/lib/Tappable';
import {Modal} from 'antd';

const confirm = Modal.confirm;

let errorLoading = require('../images/error.jpg')

class BookItem extends React.Component{
  constructor(props) {
    super(props);
    this.showConfirm = () => {
    confirm({
      title: '删除本书',
      content: `确认删除本书《${this.props.data.title}》吗？` ,
      onOk: () => {
        this.props.deleteBook(this.props.data);
      },
      onCancel() {},
    });
  }
  }

  handleImageErrored(e) {
    e.target.src = errorLoading;
  }

  render() {
    return (
      <Tappable
        onPress ={this.showConfirm}
      >
        <div className={styles.box}>
          <img src={this.props.data.cover} onError={this.handleImageErrored} />
          <p>
            <span>{this.props.data.title}</span><br/>
            <span>{this.props.data.lastChapter}</span>
          </p>
        </div>
      </Tappable>
    )
  }
}

export default BookItem;