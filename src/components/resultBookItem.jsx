import React from 'react';
import styles from '../styles/resultBookItem.less';
import { Link } from 'react-router-dom';

let errorLoading = require('../images/error.jpg')

class ResultBookItem extends React.Component{

  
  handleImageErrored(e){
    e.target.src = errorLoading;
  }

  render() {
    return (
      <Link to={`/bookIntroduce/${this.props.data._id}`}>
      <div className={styles.box}>
        <img src={this.props.data.cover} onError={this.handleImageErrored}/>
        <p>
          <span>{this.props.data.title}</span><br/>
          <span>{this.props.data.latelyFollower}人在追 | {this.props.data.retentionRatio}%读者留存 | {this.props.data.author}著</span>
        </p>
      </div>
      </Link>
    )
  }
}

export default ResultBookItem;