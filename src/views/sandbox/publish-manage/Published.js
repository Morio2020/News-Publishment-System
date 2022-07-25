import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish.js'
import usePublish from '../../../components/publish-manage/usePublish.js'
export default function Published() {

  const {dataSource, handleSunset} = usePublish(2)
  return (
    <div><NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleSunset(id)}>
      Sunset
    </Button>} /></div>
  )
}