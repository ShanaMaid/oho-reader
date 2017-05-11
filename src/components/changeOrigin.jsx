import React from 'react';
import {Layout, Icon, Spin, Tag} from 'antd';
import { Link } from 'react-router-dom';
import styles from '../styles/changeOrigin.less';
import storejs from 'store/dist/store.legacy';
import 'whatwg-fetch';
import {time2Str} from '../method/index';

const { Header, Content } = Layout;

class ChangeOrigin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }
    this.pos = this.props.match.params.id; //书籍在列表的序号
    this.bookList = storejs.get('bookList')[this.pos];
    this.currentOrigin = this.bookList.list.host;
    this.changeOrigin = (id) => {
      fetch(`/api/toc/${id}?view=chapters`)
      .then(res => res.json())
      .then(data => {
        let bookList = storejs.get('bookList');
        bookList[this.pos].list = data;
        bookList[this.pos].sourceId = id;
        storejs.set('bookList', bookList);
        this.props.history.push({pathname: `/read/${this.pos}`});
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  componentWillMount() {
    fetch(`/api/toc?view=summary&book=${this.bookList._id}`)
        .then(res => res.json())
        .then( data => {
          console.log(data)
          this.setState({loading: false, data});
        })
        .catch( error => console.log(error));
  }

  

  render() {
    return (
      <Spin className='loading' spinning={this.state.loading} tip="书源加载中">
        <Layout >
          <Header className={styles.header}>
            <Link to={`/read/${this.pos}`}><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>换源</span>
          </Header>
          <Content className={styles.content}>
            <ul>
              {
                this.state.data.map((item, index) => {
                    return  (
                      <li key={index} onClick={() => this.changeOrigin(item._id)}>
                        <h1>{item.name}{this.currentOrigin === item.host ? (<Tag  className={styles.originTag} color="#f50">当前书源</Tag>) : ''}</h1>
                        <p>{time2Str(item.updated)}前:{item.lastChapter}</p>
                      </li>
                      )
                  }
                )
              }
              
            </ul>
          </Content>
        </Layout>
      </Spin>
    )
  }
}

export default ChangeOrigin;