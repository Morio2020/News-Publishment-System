import React,{useEffect, useRef, useState} from 'react'
import { Avatar,Card, Col, Row, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setAllList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const [barChart, setBarChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  
  useEffect(()=>{
      axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res=>{
          // console.log(res.data)
          setviewList(res.data)
      })
  },[])

  useEffect(()=>{
      axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res=>{
          // console.log(res.data)
          setstarList(res.data)
      })
  },[])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res=>{
        // console.log(res.data)
        // console.log()
        renderBarView(_.groupBy(res.data,item=>item.category.title))
        setAllList(res.data)
    })
    return ()=>{
      window.onresize=null
    }
}, [])

const renderBarView = (obj)=>{
    var myChart;
    if(!barChart){
      myChart = echarts.init(barRef.current);
      setBarChart(myChart)
    }else{
      myChart = barChart
    }

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
            data: ['数量']
        },
        xAxis: {
            data: Object.keys(obj),
            axisLabel:{
              rotate:"60",
              interval:0
            }
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
            name: '数量',
            type: 'bar',
            data: Object.values(obj).map(item=>item.length)
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize=()=>{ myChart.resize()}
    
}
const renderPieView = (obj)=>{
  var currentList = allList.filter(item=>item.author===username)
  var groupObj = _.groupBy(currentList,item=>item.category.title)
  var list = []
  for(var i in groupObj){
    list.push({
      name:i,
      value:groupObj[i].length
    })
  }
  var myChart
  if(!pieChart){
    myChart = echarts.init(pieRef.current);
    setPieChart(myChart)
  }else{
    myChart = pieChart
  }
// echarts.getInstanceByDom判断即可


  var option = {
    title: {
      text: 'Your News Nategories Chart',
      // subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Numbers of Publishments',
        type: 'pie',
        radius: '50%',
        data: list,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  option && myChart.setOption(option);
  
}

  const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"))
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Most frequently viewed" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Users like most" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            // style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={()=>{
                setTimeout(()=>{
                  setVisible(true)
                  renderPieView()
                },0)
              }}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                    <b>{region?region:"全球"}</b>
                    <span style={{
                        paddingLeft:"30px"
                    }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width="500px" title="Your news categories" placement="right" onClose={()=>{setVisible(false)}} visible={visible}>
        <div ref={pieRef} style={{width:"100%",height:"400px",marginTop:"30px"}}></div>
      </Drawer>
      <div ref={barRef} style={{width:"100%",height:"400px",marginTop:"30px"}}></div>
    </div>
  )
}
