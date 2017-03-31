import React from 'react'
import {Layout, Menu, Dropdown, Icon} from 'antd'
import { Link } from 'react-router-dom'
import BookItem from './bookItem'
import styles from '../styles/main.less'
import template from './template'



const { Header, Content } = Layout

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
    this.bookList = []
    this.state = {
      boolList: []
    }
    this.menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="http://www.alipay.com/">向日葵与薄荷草</a>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/setting"><Icon type="setting"/>设置</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/about"><Icon type="question-circle-o"/>关于</Link>
        </Menu.Item>
      </Menu>
    )
  }
 
  componentWillMount() {

    this.bookList.push(<BookItem key='1'/>)
  }

  componentDidMount() {
    console.log(typeof this.props.bookList);
    // this.props.search('一念')
    // this.refs.main.setAttribute('class','animated bounceInLeft')
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.bookList + '1111')
    this.setState({bookList: nextProps.bookList})
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
              <img src="../images/menu.png" className={styles.dropdown}/>
            </Dropdown>
            <Link to="/search"><Icon type="search" className={styles.search}/></Link>
          </Header>
          <Content className={styles.content}>
            {this.bookList}
          </Content>
        </Layout>
      </div>
    )
  }
}

AppComponent.defaultProps = {
}

export default template(AppComponent)
