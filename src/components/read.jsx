import React from 'react';
import { Link } from 'react-router-dom'
import {Layout, Spin, message, Icon, Modal} from 'antd';
import { Row, Col } from 'antd';
import styles from '../styles/read.less';
import template from './template';
import 'whatwg-fetch';
import storejs from 'store/dist/store.legacy';
import jss from 'jss-node';

const { Header, Footer } = Layout;
var _ = require('underscore');

class Read extends React.Component{
  constructor(props) {
    super(props);
    this.flag = true; //标记第一次进入， 判断是否读取上一次阅读的scrollTop
    this.pos = this.props.match.params.id; //书籍在列表的序号
    this.index = storejs.get('bookList')[this.pos].readIndex || 0; //章节号
    this.chapterList = storejs.get('bookList')[this.pos].list.chapters;
    this.readSetting = storejs.get('readSetting') || {flowDirection: 'vertical', fontFamily: 'initial', fontSize: '18', color: 'black', backgroundColor: 'rgb(196, 196 ,196)', lineHeight: '1.5'};
    this.state = {
      loading: true,
      chapter: '',
      show: false,
      readSetting: this.readSetting,
      chapterListShow: false,
      readSettingShow: false,
      readMoreSettingShow: false,
      showPagination: false,
      fullScreen: false, // to disable fullscreen requests initially
      battery: 0,
      clock: ''
    }
    this.ellipsis = null;
    this.getChapter = (index, prefetch=false) => {
      if (!prefetch && index < 0) {
        message.info('已经是第一章了！');
        this.index = 0;
        return;
      }
      else if(!prefetch && index >= this.chapterList.length) {
        message.info('已经是最新的一章了！');
        this.index = this.chapterList.length - 1;
        index = this.index;
      }

      
      if (!prefetch) this.setState({loading: true});
      let chapters = storejs.get('bookList')[this.pos].list.chapters;
      if (_.has(chapters[index], 'chapter')) {
        this.setState({loading: false, chapter: chapters[index].chapter}, () => {
          this.refs.box.scrollTop = 0;
        });
        let bookList = storejs.get('bookList');
        bookList[this.pos].readIndex = index;
        storejs.set('bookList', bookList);
        return;
      }
      
      fetch(`/chapter/${encodeURIComponent(this.chapterList[index].link)}?k=2124b73d7e2e1945&t=1468223717`)
      .then(res => res.json())
      .then( data => {
        if (!prefetch && !data.ok) {
          message.info('章节内容丢失！');
          return this.setState({loading: false});
        }
        let content = _.has(data.chapter, 'cpContent') ?  data.chapter.cpContent :  data.chapter.body;
        if (data.chapter.title == '.') {
          data.chapter.title = this.chapterList[index].title;
        }
        data.chapter.cpContent =  '　　' + content.replace(/\n/g, '\n　　');
        data.chapter.cpContent.trimRight('\n');

        let bookList = storejs.get('bookList');
        bookList[this.pos].readIndex = index;
        storejs.set('bookList', bookList);

        if (!prefetch) this.setState({loading: false, chapter: data.chapter})
      })
      .catch(error => message.info(error))
      if (prefetch) return;

      var that = this;
      if (this.ellipsis) {
        this.ellipsis = null;
      }
      setTimeout(function () {
        if (that.readSetting.flowDirection == 'vertical') {
          that.changeFlowVertical();
        } else {
          let bookList = storejs.get('bookList');
          that.refs.box.scrollTop = _.has(bookList[index], 'readScroll') ? bookList[index].readScroll : 0;
          that.changeFlowHorizontal();
        }
      }, 100);
      if (this.state.fullScreen) {
        var that = this;
        navigator.getBattery().then(battery => {
          that.setState({battery: battery.level});
        });
      }
    }

    this.nextChapter = (e) => {
      e.stopPropagation();
      this.getChapter(++this.index);
      this.getChapter(this.index + 1, true);
    }
    this.prevChapter = (e) => {
      e.stopPropagation();
      this.getChapter(--this.index);
    }

    this.targetChapter = (e) => {
      e.stopPropagation();
      this.index = e.target.id
      this.getChapter(this.index);
      this.setState({chapterListShow: false});
    }

    this.showSetting = () => {
      this.setState({show: !this.state.show});
    }

    this.fontUp = () => {
      this.readSetting.fontSize++;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.fontDown = () => {
      if (this.readSetting.fontSize <= 12) {
        return;
      }
      this.readSetting.fontSize--;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.changeFont = (e) => {
      this.readSetting.fontFamily = e.target.style.fontFamily;
      /* Following is localStorage cache support for woff fonts.
       * Disabled due to tiny localStorage size quota on common browsers.
       * As of now (20170623), desktop/android chrome: 5.2M, ios chrome/safari: 2.7M, per domain.
       * Fonts are loaded via @font-face. Current limitation with this method: all fonts are loaded on 'fonts>more' slide.
      var fontFamily = e.target.style.fontFamily;
      // Forked from github.com/jaicab/localFont/launcher.html
      // once cached, the css file is stored on the client forever unless
      // the URL below is changed. Any change will invalidate the cache
      var css_href = '/assets/css/' + fontFamily + '.css';
      // a simple event handler wrapper
      function on(el, ev, callback) {
        if (el.addEventListener) {
          el.addEventListener(ev, callback, false);
        } else if (el.attachEvent) {
          el.attachEvent("on" + ev, callback);
        }
      }
      
      // if we have the fonts in localStorage or if we've cached them using the native batrowser cache
      if ((window.localStorage && localStorage['font_css_cache_' + fontFamily]) || document.cookie.indexOf('font_css_cache_' + fontFamily) > -1){
        // just use the cached version
        console.log('inject from cache');
        injectFontsStylesheet();
      } else {
       // otherwise, don't block the loading of the page; wait until it's done.
        console.log('load font');
        injectFontsStylesheet();
      }
      
      // quick way to determine whether a css file has been cached locally
      function fileIsCached(href) {
        return window.localStorage && localStorage['font_css_cache_' + fontFamily] && (localStorage.font_css_cache_file === href);
      }

      // time to get the actual css file
      function injectFontsStylesheet() {
       // if this is an older browser
        if (!window.localStorage || !window.XMLHttpRequest) {
          var stylesheet = document.createElement('link');
          stylesheet.href = css_href;
          stylesheet.rel = 'stylesheet';
          stylesheet.type = 'text/css';
          console.log(stylesheet);
          document.getElementsByTagName('head')[0].appendChild(stylesheet);
          // just use the native browser cache
          // this requires a good expires header on the server
          document.cookie = "font_css_cache_" + fontFamily;
        
        // if this isn't an old browser
        } else {
           // use the cached version if we already have it
          if (fileIsCached(css_href)) {
            injectRawStyle(localStorage['font_css_cache_' + fontFamily]);
          // otherwise, load it with ajax
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", css_href, true);
            // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                // once we have the content, quickly inject the css rules
                injectRawStyle(xhr.responseText);
                // and cache the text content for further use
                // notice that this overwrites anything that might have already been previously cached
                localStorage['font_css_cache_' + fontFamily] = xhr.responseText;
                localStorage.font_css_cache_file = css_href;
              }
            };
            xhr.send();
          }
        }
      }

      // this is the simple utitily that injects the cached or loaded css text
      function injectRawStyle(text) {
        var style = document.createElement('style');
        // cater for IE8 which doesn't support style.innerHTML
        style.setAttribute("type", "text/css");
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.innerHTML = text;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
      }*/
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }
    //this.dup = this.changeFont({'target': {'style': this.readSetting}});

    this.changeLineHeight = (e) => {
      this.readSetting.lineHeight = e.target.style.lineHeight;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.changeFontWeight = (e) => {
      this.readSetting.fontWeight = e.target.style.fontWeight;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.changeFontColor = (e) => {
      this.readSetting.color = e.target.style.color;
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
    }

    this.changeBackgroundColor = (e) => {
      this.readSetting.backgroundColor = e.target.style.backgroundColor;
      if (e.target.style.backgroundColor == 'rgb(0, 0, 0)') {
        this.changeFontColor({'target': {'style': {'color': 'white'}}});
      } else {
        this.changeFontColor({'target': {'style': {'color': 'black'}}});
      }
      this.setState({readSetting: this.readSetting});
      storejs.set('readSetting', this.readSetting);
      if (!this.state.fullScreen) {
        jss.set('.' + styles.box + '::-webkit-scrollbar-track-piece', {'background-color': this.readSetting.backgroundColor});
      }
    }

    this.changeFlowVertical = () => {
      this.readSetting.flowDirection = 'vertical';
      storejs.set('readSetting', this.readSetting);
      this.refs.box.style.overflowY = 'scroll';
      this.refs.navi.style.display = 'block';
      this.setState({showPagination: false});
      if (this.ellipsis) {
        this.ellipsis.unset();
      }
    }

    this.changeFlowHorizontal = () => {
      this.readSetting.flowDirection = 'horizontal';
      storejs.set('readSetting', this.readSetting);
      this.refs.box.style.overflowY = 'hidden';
      this.setState({showPagination: true});
      var that = this;
      function checkLoop() {
        var navi = that.refs.navi;
        if (navi == undefined) {
          setTimeout(checkLoop, 100);
        } else {
          navi.style.display = 'none';
          if (that.ellipsis == null) {
            var element = that.refs.box;
            that.totalHeight = element.children[0].clientHeight;
            that.ellipsis = new Ellipsis(element);
          }
          if (that.ellipsis.child == undefined || that.ellipsis.child == null) {
            that.ellipsis.calc();
            that.totalLine = Math.ceil(that.totalHeight / that.ellipsis.lineHeight);
            that.totalPage = Math.ceil(that.totalLine / that.ellipsis.linesPerColumn);
            that.pageHeight = that.ellipsis.lineHeight * that.ellipsis.linesPerColumn;
            var newline = Math.floor(that.totalPage * that.pageHeight / that.ellipsis.lineHeight - that.totalLine);
            that.state.chapter.cpContent += Array(newline + 1).join('\n');
            that.ellipsis.calc();
            that.totalLine = Math.ceil(that.totalHeight / that.ellipsis.lineHeight);
            that.totalPage = Math.floor(that.totalLine / that.ellipsis.linesPerColumn) + 1;
            that.pageHeight = that.ellipsis.lineHeight * that.ellipsis.linesPerColumn;
            //ellipsis.set();
            //next page: scrollTop += pageHeight;
            //prev page: scrollTop -= Math.min(pageHeight, scrollTop);
            //after flip page: set ellipsis
          }
          that.currentPage = Math.floor(that.refs.box.scrollTop / that.pageHeight);
          var scrollTop = that.currentPage * that.pageHeight;
          that.refs.box.scrollTop = scrollTop;
          that.ellipsis.child.clampedHeight = scrollTop + that.pageHeight;
          that.ellipsis.set();
          that.setState({currentPage: that.currentPage + 1, totalPage: that.totalPage});
        }
      }
      checkLoop();
    }

    this.nextPage = (e) => {
      if (this.refs.box.scrollTop + this.pageHeight > this.totalHeight) {
        this.nextChapter(e);
      } else {
        this.ellipsis.unset();
        this.refs.box.scrollTop += this.pageHeight;
        this.ellipsis.calc();
        this.ellipsis.child.clampedHeight = this.refs.box.scrollTop + this.pageHeight;
        this.ellipsis.set();
        this.readScroll();
        this.currentPage = Math.floor(this.refs.box.scrollTop / this.pageHeight);
        this.setState({currentPage: this.currentPage + 1, totalPage: this.totalPage});
      }
    }

    this.prevPage = (e) => {
      if (this.refs.box.scrollTop == 0) {
        this.prevChapter(e);
      } else {
        this.ellipsis.unset();
        this.refs.box.scrollTop -= Math.min(this.pageHeight, this.refs.box.scrollTop);
        this.ellipsis.calc();
        this.ellipsis.child.clampedHeight = this.refs.box.scrollTop + this.pageHeight;
        this.ellipsis.set();
        this.readScroll();
        this.currentPage = Math.floor(this.refs.box.scrollTop / this.pageHeight);
        this.setState({currentPage: this.currentPage + 1, totalPage: this.totalPage});
      }
    }

    this.readScrollFlag = true // reduce performance impact on scrolling.
    this.readScroll = () => {
      if (this.readScrollFlag) {
        this.readScrollFlag = false;
        setTimeout(this.readScrollSave, 1000);
      }
    }
    this.readScrollSave = () => {
      let bookList = storejs.get('bookList');
      bookList[this.pos].readScroll = this.refs.box.scrollTop;
      storejs.set('bookList', bookList);
      this.readScrollFlag = true;
    }

    this.showChapterList = (chapterListShow) => {
      this.setState({ chapterListShow });
    }

    this.downloadBook = () => {
      let pos = this.pos;
      Modal.confirm({
        title: '缓存',
        content: (
          <div>
            <p>是否缓存后100章节？</p>
          </div>
        ),
        onOk() {
          let bookList = storejs.get('bookList');
          let chapters = bookList[pos].list.chapters;
          let download = (start, end) => {
            if (start > end || start >= chapters.length) {
              message.info('缓存完成');
              return;
            }
            if(_.has(chapters[start], 'chapter')) {
              download(++start, end);
              return;
            }
            fetch(`/chapter/${encodeURIComponent(chapters[start].link)}?k=2124b73d7e2e1945&t=1468223717`)
            .then(res => res.json())
            .then( data => {
              let content = _.has(data.chapter, 'cpContent') ?  data.chapter.cpContent :  data.chapter.body;
          if (data.chapter.title == '.') {
            data.chapter.title = this.chapterList[index].title;
          }
              data.chapter.cpContent =  '　　' + content.replace(/\n/g, '\n　　');
              chapters[start].chapter = data.chapter;
              bookList[pos].list.chapters = chapters;
              storejs.set('bookList', bookList);
              download(++start, end);
            })
            .catch(error => message.info(error))
          }

          for(let i = 0; i < bookList[pos].readIndex; i++) {
            delete chapters[i].chapter;
          }

          download(bookList[pos].readIndex, bookList[pos].readIndex + 100);
        },
        onCancel() {
        }
      });
    }

    this.readSettingShowControl = (e) => {
      e.stopPropagation();
      let value = !this.state.readSettingShow;
      this.setState({readSettingShow: value});
      if (value == false) {
        this.state.readMoreSettingShow = false;
        this.setState({readMoreSettingShow: false});
      }
    }

    this.readMoreSettingShowControl = (e) => {
      e.stopPropagation();
      let value = !this.state.readMoreSettingShow;
      this.setState({readMoreSettingShow: value});
    }

    this.requestFullscreen = (ele) => {
      if ('ontouchstart' in document.documentElement && !this.state.fullScreen) {
        var that = this;
        setTimeout(function () {
          that.setState({fullScreen: true});
        });
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        } else {
          //console.log('Fullscreen API is not supported.');
        }
      }
    }

    this.exitFullscreen = () => {
      if ('ontouchstart' in document.documentElement) {
        var that = this;
        setTimeout(function () {
          that.setState({fullScreen: false});
        });
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else {
          //console.log('Fullscreen API is not supported.');
        }
      }
      return '';
    }

    this.clockLock = true;
    this.clock = () => {
      if (this.clockLock) {
        this.clockLock = false;
        setTimeout(this.getClock, 1000);
      }
    }
    this.getClock = () => {
      var now = new Date();
      this.setState({clock: ('0' + now.getHours()).substr(-2) + ':' + ( '0' + now.getMinutes()).substr(-2)});
      this.clockLock = true;
    }
  }

  componentWillMount() {
    this.getChapter(this.index);

    // 刷新最近阅读的书籍列表顺序
    let bookList = storejs.get('bookList');
    bookList.unshift(bookList.splice(this.pos, 1)[0]);
    storejs.set('bookList', bookList);
    this.pos = 0;
    navigator.getBattery().then(battery => {
      this.setState({battery: battery.level});
    });
    if (!this.state.fullScreen) {
      jss.set('.' + styles.box + '::-webkit-scrollbar-track-piece', {'background-color': this.readSetting.backgroundColor});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.flag) { //加载上次阅读进度
      let bookList = storejs.get('bookList');
      var scrollTop = _.has(bookList[this.pos], 'readScroll') ? bookList[this.pos].readScroll : 0;
      if (scrollTop > 0) {
        if (this.readSetting.flowDirection == 'horizontal') {
          var that = this;
          setTimeout(function () {
            that.changeFlowVertical();
            that.refs.box.scrollTop = scrollTop;
            that.changeFlowHorizontal();
          }, 50);
        } else {
          this.refs.box.scrollTop = 0;
        }
      } else {
        this.refs.box.scrollTop = 0;
      }
      this.flag = false;
    }
    else if(prevState.loading !== this.state.loading){
      this.refs.box.scrollTop = 0;
    }
    let list =  document.querySelector('.chapterList .ant-modal-body');
    if (list !== null) {
      list.scrollTop = 45 * (this.index - 3);
    }
    this.clock();
  }

  render() {
    return (
      <Spin className='loading' style={{'background-color': this.state.readSetting.backgroundColor}} spinning={this.state.loading} delay={500} tip="章节内容加载中">
        <Layout >
          <Modal
            className="chapterList"
            title="Vertically centered modal dialog"
            visible={this.state.chapterListShow}
            onOk={() => this.showChapterList(false)}
            onCancel={() => this.showChapterList(false)}
          >
            {
              this.chapterList.map((item,index) => (<p id={index} className={parseInt(this.index, 10) == index ?  'choosed' : ''} onClick={this.targetChapter} key={index}>{item.title}</p>))
            }
          </Modal>
          {
            this.state.show ? (() => {
              return (
                <Header className={styles.header}>
                  <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
                  <Link to={`/changeOrigin/${this.pos}`}><span className={styles.origin}>换源</span></Link>
                </Header>
              )
            })() : ''
          }
          <div className={styles.navi}>
            <span className={styles.up} onClick={this.prevPage}></span>
            <span className={styles.uppad}></span>
            <span className={styles.down} onClick={this.nextPage}></span>
            <span className={styles.downpad}></span>
            <span className={styles.left} onClick={this.prevPage}></span>
            <span className={styles.leftpad}></span>
            <span className={styles.right} onClick={this.nextPage}></span>
            <span className={styles.rightpad}></span>
            { this.state.fullScreen ? <meter low="0.2" value={this.state.battery} className={styles.battery}></meter> : null }
            { this.state.showPagination ? <span className={styles.title} style={{'color': this.state.readSetting.color}}>{this.state.chapter.title}</span> : null }
            { this.state.showPagination ? <span className={styles.pagination} style={{'color': this.state.readSetting.color}}>{this.state.currentPage}/{this.state.totalPage}</span> : null }
            { this.state.fullScreen ? <span className={styles.clock} style={{'color': this.state.readSetting.color}}>{this.state.clock}</span> : null }
          </div>
          <div ref='box' className={styles.box} style={this.state.readSetting} onClick={this.showSetting} onScroll={this.readScroll}>
          {this.state.loading ? '' : (()=>{
            return (
              <div>
                <h1>{this.state.chapter.title}</h1>
                <div>{this.state.chapter.cpContent}</div>
                <h1 ref='navi' className={styles.control}>
                  <span onClick={this.prevChapter}>上一章</span>
                  <span onClick={this.nextChapter}>下一章</span>
                </h1>
              </div>
            )
          })()}
          </div>
          {
            this.state.show ? (() => {
              this.exitFullscreen();
              return (
                <Footer className={styles.footer}>
                  <div
                    className={styles.setting}
                    tabIndex="100"
                    onClick={this.readSettingShowControl}
                    onBlur={this.readSettingShowControl}>
                    <Icon type="setting" /><br/>设置
                    {
                      this.state.readSettingShow ?
                      [
                        (this.state.readMoreSettingShow ?
                            <div className={styles.moreSetting}>
                              <Row>
                                <Col span={12}>
                                  <div onClick={this.changeFont} style={{fontFamily: 'XHei-Believe'}}>兰亭细黑</div>
                                  <div onClick={this.changeFont} style={{fontFamily: 'XHei-Classical'}}>明　兰　</div>
                                  <div onClick={this.changeFont} style={{fontFamily: 'initial'}}>默　认　</div>
                                </Col>
                                <Col span={12}>
                                  <div onClick={this.changeFont} style={{fontFamily: 'XSung-Clear'}}>兰亭刊宋</div>
                                  <div onClick={this.changeFont} style={{fontFamily: 'XSung-Classical'}}>不　明　</div>
                                </Col>
                              </Row>
                            </div>
                          : ''),
                        <div onClick={(e) => e.stopPropagation()}>
                          <Row>
                            <Col span={12}>
                              <div className={styles.font}>
                                <span onClick={this.fontDown}>Aa -</span>
                                <span onClick={this.fontUp}>Aa +</span>
                                <span onClick={this.readMoreSettingShowControl}>
                                  <Icon type="ellipsis" style={{fontSize: '0.8rem'}}>More</Icon>
                                </span>
                              </div>
                              <div className={styles.color}>
                                <i onClick={this.changeBackgroundColor} style={{backgroundColor: 'rgb(196, 196 ,196)'}}></i>
                                <i onClick={this.changeBackgroundColor} style={{backgroundColor: 'rgb(0, 0, 0)'}}></i>
                                <i onClick={this.changeBackgroundColor} style={{backgroundColor: 'rgb(255, 255, 255)'}}></i>
                                <span className={styles.flowDirection}>
                                  <svg onClick={this.changeFlowVertical} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/></svg>
                                  <svg onClick={this.changeFlowHorizontal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
                                </span>
                              </div>
                            </Col>
                            <Col span={12}>
                               <div className={styles.lineHeight}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 15h9v-2H9v2zM9 3v2h9V3H9zM7.5 5L4 1.5.5 5H3v8H.5L4 16.5 7.5 13H5V5h2.5zM9 10h9V8H9v2z"/></svg>
                                <span onClick={this.changeLineHeight} style={{lineHeight: '1.15'}}>窄</span>
                                <span onClick={this.changeLineHeight} style={{lineHeight: '1.5'}}>并</span>
                                <span onClick={this.changeLineHeight} style={{lineHeight: '2'}}>宽</span>
                              </div>
                              <div className={styles.fontWeight}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M11.63 7.82C12.46 7.24 13 6.38 13 5.5 13 3.57 11.43 2 9.5 2H4v12h6.25c1.79 0 3.25-1.46 3.25-3.25 0-1.3-.77-2.41-1.87-2.93zM6.5 4h2.75c.83 0 1.5.67 1.5 1.5S10.08 7 9.25 7H6.5V4zm3.25 8H6.5V9h3.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                                <span onClick={this.changeFontWeight} style={{fontWeight: 'lighter'}}>细</span>
                                <span onClick={this.changeFontWeight} style={{fontWeight: 'normal'}}>中</span>
                                <span onClick={this.changeFontWeight} style={{fontWeight: 'bold'}}>粗</span>
                                <span onClick={this.changeFontWeight} style={{fontWeight: 'bolder'}}>厚</span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ] : ''
                    }
                  </div>
                  <div><Icon type="download" onClick={this.downloadBook}/><br/>下载</div>
                  <div onClick={() => this.showChapterList(true)}><Icon type="bars" /><br/>目录</div>
                </Footer>
              )
            })() : this.requestFullscreen(document.documentElement)
          }
          
        </Layout>
      </Spin>
    )
  }
}

export default template(Read);
