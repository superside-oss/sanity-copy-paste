import React from 'react'
import {Box, Spinner} from '@sanity/ui'

export const SpinnerFixed: React.FC = () => {
  return (
    <Box marginTop={1}>
      <Spinner muted />
    </Box>
  )
}
