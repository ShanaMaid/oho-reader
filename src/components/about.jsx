import React from 'react';
import {Layout, Icon} from 'antd';
import { Link } from 'react-router-dom';
import styles from '../styles/about.less';

const { Header, Content } = Layout;

class Read extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Layout >
          <Header className={styles.header}>
            <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>关于</span>
          </Header>
          <Content className={styles.content}>
            <img src="https://avatars0.githubusercontent.com/u/20333903?v=3&s=460"/>
            <h1>ShanaMaid</h1>
            <h2><a href="http://blog.shanamaid.top/">个人博客地址</a></h2>
            <h2>哦豁阅读器！绿色无广告，永久免费！</h2>
            <h2>项目开源！请勿用于商业用途！谢谢合作！</h2><br/>
            <pre>
              BUG提交请发送邮箱: uestczeng@gmail.com<br/>
              项目开源地址: <a href="https://github.com/ShanaMaid/oho-reader">oho-reader 点击访问</a><br/>
              关于支持: star or follow or pr！<a href="http://blog.shanamaid.top/sponsor/">打赏地址</a><br/>
            </pre>
            <br/>
            <h2>你的支持将有助于<br/>项目维护以及提高用户体验<br/>感谢各位的支持！</h2>
          </Content>
        </Layout>
      </div>
    )
  }
}

export default Read;