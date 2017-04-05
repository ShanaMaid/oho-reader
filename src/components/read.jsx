import React from 'react';
import { Link } from 'react-router-dom'
import {Layout, Spin, message, Icon} from 'antd';
import styles from '../styles/read.less';
import template from './template';
import 'whatwg-fetch';
import storejs from 'store/dist/store.legacy';

const { Header, Footer } = Layout;
var _ = require('underscore')
class Read extends React.Component{
  constructor(props) {
    super(props);
    this.flag = true; //标记第一次进入， 判断是否读取上一次阅读的scrollTop
    this.pos = this.props.match.params.id;
    this.index = storejs.get('bookList')[this.pos].list.readIndex || 0;
    this.readSetting = storejs.get('readSetting') || {fontSize: '12', backgroundColor: 'rgb(196, 196 ,196)'};
    this.state = {
      loading: true,
      chapter: '',
      show: false,
      readSetting: this.readSetting
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

    this.nextChapter = (e) => {
      e.stopPropagation();
      this.getChapter(++this.index);
    }
    this.preChapter = (e) => {
      e.stopPropagation();
      this.getChapter(--this.index);
    }

    this.shwoSetting = () => {
      this.setState({show: !this.state.show});
    }

    this.fontUp = () => {
      this.readSetting.fontSize++
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.fontDown = () => {
      if (this.readSetting.fontSize <=12) {
        return;
      }
      this.readSetting.fontSize--
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.changeBackgroudnColor = (e) => {
      this.readSetting.backgroundColor = e.target.style.backgroundColor;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.readScroll = () => {
      let bookList = storejs.get('bookList');
      bookList[this.pos].readScroll = this.refs.box.scrollTop;
      storejs.set('bookList', bookList);
    }

  }

  componentWillMount() {
    this.getChapter(this.index);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.flag) { //加载上次阅读进度
      let bookList = storejs.get('bookList');
      this.refs.box.scrollTop = _.has(bookList[this.pos], 'readScroll') ? bookList[this.pos].readScroll : 0;
      this.flag = false;
    }
  }


  render() {
    return (
      <Spin className='loading' spinning={this.state.loading} tip="章节内容加载中">
        <Layout >
          {
            this.state.show ? (() => {
              return (
                <Header className={styles.header}>
                  <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
                  <span className={styles.origin}>换源</span>
                </Header>
              )
            })() : ''
          }
          <div ref='box' className={styles.box} style={this.state.readSetting} onClick={this.shwoSetting} onScroll={this.readScroll}>
          {this.state.loading ? '' : (()=>{
            return (
              <div>
                <h1>{this.state.chapter.title}</h1>
                <pre >{ _.has(this.state.chapter, 'cpContent') ? this.state.chapter.cpContent : this.state.chapter.body}</pre>
                <h1 className={styles.control}>
                  <span onClick={this.preChapter}>上一章</span>
                  <span onClick={this.nextChapter}>下一章</span>
                </h1>
              </div>
            )
          })()}
          </div>
          {
            this.state.show ?  (() => {
              return (
                <Footer className={styles.footer}>
                  <div className={styles.setting}>
                    <Icon type="setting" /><br/>设置
                    <div>
                      <div className={styles.font}>
                        <span onClick={this.fontDown}>Aa -</span>
                        <span onClick={this.fontUp}>Aa +</span>
                      </div>
                      <div className={styles.color}>
                        <i onClick={this.changeBackgroudnColor} style={{backgroundColor: 'rgb(196, 196 ,196)'}}></i>
                        <i onClick={this.changeBackgroudnColor} style={{backgroundColor: 'rgb(162, 157, 137)'}}></i>
                        <i onClick={this.changeBackgroudnColor} style={{backgroundColor: 'rgb(173, 200, 169)'}}></i>
                      </div>
                    </div>
                  </div>
                  <div><Icon type="download" /><br/>下载</div>
                  <div><Icon type="bars" /><br/>目录</div>
                </Footer>
              )
            })() : ''
          }
          
        </Layout>
      </Spin>
    )
  }
}

export default template(Read);