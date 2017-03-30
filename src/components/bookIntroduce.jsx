import React from 'react';
import {Layout, Icon, Input, Spin, Button, Tag} from 'antd';
import { Link } from 'react-router-dom';
import template from './template';
import styles from '../styles/bookIntroduce.less';
import randomcolor from 'randomcolor';

const { Header, Content } = Layout


class BookIntroduce extends React.Component{
  constructor(props) {
    super(props);
    this.data = {}
    this.state = {
      loading: true
    }
    this.props.getBokkIntroduce(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.data = nextProps.fetchBookItem
    this.setState({loading: false})
    console.log(this.state.loading)
  }

  handleImageErrored(e){
    e.target.src = '../images/error.jpg'
  }

  render() {
    return (
      <div>
        <Layout >
          <Header className={styles.header}>
            <Link to="/search"><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>书籍详情</span>
            <span className={styles.share}>分享</span>
            <span className={styles.download}>缓存全部</span>
          </Header>
          <Spin className={styles.loading} spinning={this.state.loading} tip="书籍详情加载中...">
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
                      <Button icon="plus" size="large">追更新</Button>
                      <Button icon="search" size="large">开始阅读</Button>
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