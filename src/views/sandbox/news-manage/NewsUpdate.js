import React, { useEffect, useState, useRef } from 'react'
import {useNavigate, useParams }from 'react-router-dom'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification, } from 'antd';
import style from'./News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor.js'

const { Step } = Steps;
const { Option } = Select;



export default function NewsUpdate(props) {
  const [current,setCurrent] = useState(0)
  const [categoryList,setCategoryList] = useState([])
  const [formInfo,setFormInfo] = useState({})
  const [content,setContent] = useState({})
  const { id } = useParams();
//   const [newsInfo, setNewsInfo]= useState(null)
  const handleNext= ()=>{
    if(current===0){
      NewsForm.current.validateFields().then(res=>{
        // console.log(res)
        setFormInfo(res)
        setCurrent(current+1)
      }).catch(error=>{
        // console.log(error)
      })
      // setCurrent(current+1)
    }else{
      // if(JSON.stringify(content) === "{}"||content===''||content.trim()==='<p></p>' || content===undefined){
      if(JSON.stringify(content) === "{}"||content===''|| content===undefined){
        message.error("The news content should not be empty")
      }else{
        // console.log(formInfo,content)
        setCurrent(current+1)
      }      
    }
  }
  const handlePrevious= ()=>{
    setCurrent(current-1)
  }
  const NewsForm = useRef(null)

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
    let {title, categoryId, content} =res.data
    NewsForm.current.setFieldsValue({
        title,
        categoryId,
    })
    // console.log(content)
    setContent(content)
})},[id])
  const navigate = useNavigate()
  const handleSave=(auditState)=>{
    axios.patch(`/news/${id}`,{
      ...formInfo,
      "content": content,
      "auditState": auditState,
    }).then(res=>{
      navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `Notification`,
        description:
          `You may view your news at ${auditState===0?'draftbox':'auditlist'}`,
        placement:"bottomRight",
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={()=>navigate('/news-manage/draft')}
        title="rewriting News"
      />
      <Steps current={current}>
        <Step title="Basic Information" description="Title & category" />
        <Step title="News Content" description="Body of news content" />
        <Step title="News Submit" description="Save draft or submit to audit" />
      </Steps>
      <div style={{marginTop:"50px"}}>
        <div className={current===0?'':style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            ref={NewsForm}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Select>
                {
                  categoryList.map(item=>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>


        <div className={current===1?'':style.active}>
          <NewsEditor getContent={(value)=>{
            // console.log(value)
            setContent(value)
          }} content={content}/>
        </div>

        
        <div className={current===2?'':style.active}></div>
      </div>

      <div style={{marginTop:"50px",}}>
        {
          current===2 &&<span>
            <Button type="primary" onClick={()=>handleSave(0)}>Save at draftbox</Button>
            <Button type="danger"onClick={()=>handleSave(1)}>Submit to audit</Button>
            </span>
        }
        {
          current<2 && <Button type="primary" onClick={handleNext}>Next</Button>
        }
        {
          current>0 && <Button onClick={handlePrevious}>Previous</Button>
        }       
      </div>
    </div>
  )
}
