import React from 'react';
import {Layout, Icon, Spin, Button, Tag, message, Modal} from 'antd';
import { Link } from 'react-router-dom';
import template from './template';
import styles from '../styles/bookIntroduce.less';
import randomcolor from 'randomcolor';
import CopyToClipboard from 'react-copy-to-clipboard';


const { Header, Content } = Layout

let errorLoading = require('../images/error.jpg')
class BookIntroduce extends React.Component{
  constructor(props) {
    super(props);
    this.data = {};
    this.share = '';
    this.state = {
      loading: true,
      save: false
    };
    message.config({
      top: 500,
      duration: 2
    });

    this.flag = false; //是否进入阅读模式
    this.props.getBookItem(this.props.match.params.id);
    this.addBook = () => {
      this.props.addBook(this.data);
      message.info(`《${this.data.title}》加入书架`);
    }

    this.deleteBook = () => {
      this.props.deleteBook(this.data);
      message.info(`《${this.data.title}》从书架移除`);
    }

    this.beiginRead = () => {
      this.addBook();
      this.flag = true;
    }

    this.shareSuccess =  () => {
      Modal.success({
        title: '链接已复制到你的剪贴板',
        content: this.share
      });
    }
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.data = nextProps.fetchBookItem;
    this.share = `我在哦豁阅读器看《${this.data.title}》，绿色无广告，你也一起来呗！地址是${window.location.href}，移动端请手动复制这条信息。`;
    this.setState({loading: false, save: nextProps.bookList.id.has(nextProps.fetchBookItem._id)});
    if (this.flag) {
      let list = nextProps.bookList.list
      for (let index in list) {
        if (list[index]._id === nextProps.fetchBookItem._id) {
          let index = nextProps.bookList.list.length - 1;
          this.props.history.push({pathname: '/read/' + index});
          this.flag = false;
          break;
        }
      }
    }
  }

  handleImageErrored(e){
    e.target.src = errorLoading;
  }


  render() {
    return (
      <div>
        <Layout >
          <Header className={styles.header}>
            <Link to="/search"><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>书籍详情</span>
            <CopyToClipboard text={this.share}
              onCopy = {this.shareSuccess}>
              <span className={styles.share}>分享</span>
            </CopyToClipboard>
          </Header>
          <Spin className='loading' spinning={this.state.loading} tip='书籍详情加载中...'>
          <Content className={styles.content}>
            {
              this.state.loading ? '':
                (
                  <div>
                    <div className={styles.box}>
                      <img src={this.data.cover} onError={this.handleImageErrored}/>
                      <p>
                        <span className={styles.bookName}>{this.data.title}</span><br/>
                        <span className={styles.bookMsg}><em>{this.data.author}</em> | {this.data.minorCate} | {this.data.wordCount}</span>
                        <span className={styles.updated}>{this.data.updated}前更新</span>
                      </p>
                    </div>
                    <div className={styles.control}>
                      {
                        this.state.save ?
                        (<Button icon='minus' size='large' className={styles.cancel} onClick={this.deleteBook}>不追了</Button>) :
                        (<Button icon='plus' size='large' onClick={this.addBook}>追更新</Button>)
                      }
                      <Button icon='search' size='large' onClick={this.beiginRead}>开始阅读</Button>
                    </div>
                    <div className={styles.number}>
                      <p><span>追书人数</span><br/>{this.data.latelyFollower}</p>
                      <p><span>读者留存率</span><br/>{this.data.retentionRatio}%</p>
                      <p><span>日更新字数</span><br/>{this.data.serializeWordCount}</p>
                    </div>
                    <div className={styles.tags}>
                      {
                        this.data.tags.map((item, index) =>
                          <Tag className={styles.tag} color={randomcolor({luminosity: 'dark'})} key={index}>{item}</Tag>
                        )
                      }
                    </div>
                    <div className={styles.introduce}>
                      <pre>{this.data.longIntro}</pre>
                    </div>
                  </div>
                )
            }
          </Content>
          </Spin>
        </Layout>
      </div>
    )
  }
}

export default template(BookIntroduce);