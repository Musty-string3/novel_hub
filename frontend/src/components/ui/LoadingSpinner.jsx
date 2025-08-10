import React from 'react'
import { Spinner } from '@chakra-ui/react'

function LoadingSpinner() {

    return (
        <div className=''>
            <Spinner
                thickness='4px'
                speed='1s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        </div>
    )
}

export default LoadingSpinner