import React from 'react';
import styles from '../styles/resultBookItem.less';

class ResultBookItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: '1',
      latelyFollower: '',
      retentionRatio: '',
      author: '',
      cover: ''
    }
  }

  componentWillMount() {
    this.setState(this.props.data)
  }

  componentWillUpdate(nextProps, nextStatus) {

  }

  shouldComponentUpdate(nextProps, nextStatus) {
    return true
  }

  handleImageErrored(e){
    console.log(e.target)
    e.target.src = '../images/error.jpg'
  }

  render() {
    return (
      <div className={styles.box}>
        <img src={this.props.data.cover} onError={this.handleImageErrored}/>
        <p>
          <span>{this.props.data.title}</span><br/>
          <span>{this.props.data.latelyFollower}人在追 | {this.props.data.retentionRatio}读者留存 | {this.props.data.author}著</span>
        </p>
      </div>
    )
  }
}

export default ResultBookItem;