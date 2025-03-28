import React from 'react'
import Container from '../components/common/Container'

const NotFound = () => {
  return (
    <Container>
        <div className='flex justify-center items-center min-h-svh '>
            <h1 className='text-2xl text-gray-400 sm:text-4xl font-bold'>404 page not found</h1>
        </div>
    </Container>
  )
}

export default NotFound