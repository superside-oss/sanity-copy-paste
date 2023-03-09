/* eslint-disable react/jsx-no-bind */

import {useEffect, useRef} from 'react'
import {Flex, Card, Box, Text, Checkbox, studioTheme, ThemeProvider} from '@sanity/ui'

export const SelectedPage = (props: {
  page: any
  checkedPages: any
  setCheckedPages: any
  isDeselect: any
}) => {
  const {page, checkedPages, setCheckedPages, isDeselect} = props
  const pageRef = useRef<HTMLInputElement>(null)
  const {title, _id} = page

  useEffect(() => {
    if (isDeselect && pageRef && pageRef.current && pageRef?.current?.checked) {
      pageRef.current.checked = false
    }
  }, [isDeselect])

  return (
    <ThemeProvider theme={studioTheme}>
      <Card padding={4}>
        <Flex align="center">
          <Checkbox
            id={page._id}
            style={{display: 'block'}}
            ref={pageRef}
            onChange={(e) =>
              setCheckedPages({...checkedPages, [page._id]: (e.target as HTMLInputElement).checked})
            }
          />
          <label htmlFor={page._id}>
            <Box flex={1} paddingLeft={3}>
              <Flex style={{gap: '.5em'}} direction="column">
                <Text>{title}</Text>
                <Text size={1} style={{color: '#6e7683'}}>
                  {_id}
                </Text>
              </Flex>
            </Box>
          </label>
        </Flex>
      </Card>
    </ThemeProvider>
  )
}

export default SelectedPage
