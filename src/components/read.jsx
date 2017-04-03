import React from 'react';
import { Link } from 'react-router-dom'
import {Spin} from 'antd';
import styles from '../styles/read.less';
import template from './template'
import 'whatwg-fetch';
class Read extends React.Component{
  constructor(props) {
    super(props);
    this.index = 0;
    this.pos = this.props.match.params.id;
    this.state = {
      loading: true,
      chapter: ''
    }
    this.getChapter = (index) => {
      this.setState({loading: true});
      document.getElementsByTagName('body')[0].scrollTop = 0;
      fetch('/chapter/' + this.props.bookList.list[this.pos].list.chapters[index].link + '?k=2124b73d7e2e1945&t=1468223717')
      .then(res => res.json())
      .then( data => this.setState({loading: false, chapter: data.chapter}))
      .catch(error => console.log(error))
    }

    this.nextChapter = () => this.getChapter(++this.index);
    this.preChapter = () => this.getChapter(--this.index);
  }

  componentWillMount() {
    this.getChapter(this.index);
  }

  render() {
    return (
      <Spin className='loading' spinning={this.state.loading} tip="书籍搜索中...">
        <div className={styles.box}>
        {this.state.loading ? '' : (()=>{
          return (
            <div>
              <h1>{this.state.chapter.title}</h1>
              <pre>{this.state.chapter.cpContent}</pre>
              <h1 className={styles.control}>
                <span onClick={this.preChapter}>上一章</span>
                <span onClick={this.nextChapter}>下一章</span>
              </h1>
            </div>
          )
        })()}
        </div>
      </Spin>
    )
  }
}

export default template(Read);