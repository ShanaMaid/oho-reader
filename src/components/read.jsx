import React from 'react';
import { Link } from 'react-router-dom'
import {Spin, message} from 'antd';
import styles from '../styles/read.less';
import template from './template';
import 'whatwg-fetch';
import storejs from 'store/dist/store.legacy';

class Read extends React.Component{
  constructor(props) {
    super(props);
    this.pos = this.props.match.params.id;
    this.index = storejs.get('bookList')[this.pos].list.readIndex || 0;
    this.state = {
      loading: true,
      chapter: ''
    }
    this.getChapter = (index) => {
      let chapters = this.props.bookList.list[this.pos].list.chapters;
      if (index < 0) {
        message.info('已经是第一章了！');
        this.index = 0;
        return;
      }
      else if(index >= chapters.length) {
        message.info('已经是最新的一章了！');
        this.index = chapters.length - 1;
        return;
      }
      this.setState({loading: true});
      document.getElementsByTagName('body')[0].scrollTop = 0;
      fetch('/chapter/' + chapters[index].link + '?k=2124b73d7e2e1945&t=1468223717')
      .then(res => res.json())
      .then( data => {
        if (!data.ok) {
          message.info('章节内容丢失！');
          return this.setState({loading: false});
        }
        let bookList = storejs.get('bookList');
        bookList[this.pos].list.readIndex = index;
        storejs.set('bookList', bookList);
        return this.setState({loading: false, chapter: data.chapter})
      })
      .catch(error => message.info(error))
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