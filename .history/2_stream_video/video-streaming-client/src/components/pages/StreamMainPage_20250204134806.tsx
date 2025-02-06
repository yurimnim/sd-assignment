import React from 'react'
import VideoPlayer from '../organisms/VideoPlayer'
import './StreamMainPage.css'

const StreamMainPage = () => {
  return (
    <div className="page-stream-main">
      <VideoPlayer src="https://test-yurim.s3.ap-northeast-2.amazonaws.com/dodamso_demo_230428..mp4" />
    </div>
  )
}

export default StreamMainPage