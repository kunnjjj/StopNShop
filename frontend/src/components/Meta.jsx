import React from 'react'
import {Helmet} from 'react-helmet'
const Meta = ({title,description,keywords}) => {
  return (
    <Helmet>
      <title>Welcome to ShopNStop | {title}</title>
      <meta name='description' content={description}/>
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps={
    title:'',
    description:'Buy best products at cheap prices',
    keywords:'Best products'
}

export default Meta
