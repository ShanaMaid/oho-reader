import React from 'react'
import {Layout, Menu, Dropdown, Icon, Spin} from 'antd'
import { Link } from 'react-router-dom'
import BookItem from './bookItem'
import styles from '../styles/main.less'
import template from './template'
import ReactPullToRefresh from 'react-pull-to-refresh'
import 'whatwg-fetch';

let menuPng = require('../images/menu.png');

const { Header, Content } = Layout

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bookList: this.props.bookList.list,
      refresh: true
    }
    this.menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="#">哦豁阅读器</a>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/setting"><Icon type="setting"/>设置</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/about"><Icon type="question-circle-o"/>关于</Link>
        </Menu.Item>
      </Menu>
    )

    this.handleRefresh = (resolve, reject) => {
      resolve();
      this.setState({refresh: true});
      this.props.refreshBook();
    }

  }
 
  componentWillMount() {
    this.props.refreshBook();
  }

  componentWillReceiveProps(nextProps){
    this.setState({bookList: nextProps.bookList.list, refresh: false})
  }

  
  render() {
    return (
      <div className="page" ref="main">
        <Layout>
          <Header className={styles.header}>
            <span className={styles.title}>oho阅读</span>
            <Dropdown
              overlay={this.menu}
              placement="bottomRight"
              trigger={['click']}
              >
              <img src={menuPng} className={styles.dropdown}/>
            </Dropdown>
            <Link to="/search"><Icon type="search" className={styles.search}/></Link>
          </Header>
          
          <Content className={styles.content}>
          { this.state.refresh ? (<Spin/>) : ''}
          <ReactPullToRefresh
            onRefresh={this.handleRefresh}
          >
            {
              this.state.bookList.map((item, index) => <Link to={'/read/' + index} key={index}><BookItem data={item} deleteBook={this.props.deleteBook} key={index} /></Link>)
            }
          </ReactPullToRefresh>
          </Content>
        </Layout>
      </div>
    )
  }
}

AppComponent.defaultProps = {
}

export default template(AppComponent)
