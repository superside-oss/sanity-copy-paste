/* eslint-disable react/jsx-no-bind */
import React, {useEffect, useCallback, useState} from 'react'
import {useFormValue, useClient} from 'sanity'
import {BiCopy, BiPaste, BiCopyAlt} from 'react-icons/bi'
import {
  Stack,
  Button,
  Flex,
  Card,
  Dialog,
  Box,
  useToast,
  Text,
  Spinner,
  studioTheme,
  ThemeProvider,
} from '@sanity/ui'
import SelectedPage from './SelectedPage'
import {deepSearchReplace, writeObjectToLs, getObjectFromLs, pagesQuery} from '../utils'
import {CopyPasteInputType} from '../types'
import {SpinnerFixed} from './SpinnerFixed'

export const CopyPasteInput: React.FC<CopyPasteInputType> = ({id}) => {
  const client = useClient({apiVersion: '2021-10-21'})
  const toast = useToast()

  const [open, setOpen] = useState(false)
  const [isDeselect, setDeselect] = useState(false)
  const [pagesForMultipleCopy, setPagesForMultipleCopy] = useState([])
  const [checkedPages, setCheckedPages] = useState({})
  const [isLoadingPaste, setLoadingPaste] = useState(false)
  const [allowedToPaste, setAllowedToPaste] = useState(false)

  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  const match = RegExp(/_key=="(\w+)"/).exec(id) ?? []
  const extractedString = match[1]
  const blocksName = id.split('[')[0]

  const blocks = useFormValue([blocksName]) as {_key: string}[]
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string

  const parent = blocks?.find((block) => block?._key === extractedString) as {
    _type: string
    _key: string
  }
  const parentIndex = blocks?.findIndex((block) => block?._key === extractedString)

  useEffect(() => {
    async function retrievePages() {
      const pages = await client.fetch(pagesQuery, {documentType})

      return pages
    }

    retrievePages()
      .then((pages) => setPagesForMultipleCopy(pages))
      .catch((error) => console.error(error))

    setAllowedToPaste(true)
  }, [client, documentType])

  const onPaste = async () => {
    setLoadingPaste(true)

    const objCopy = deepSearchReplace(getObjectFromLs(parent?._type))
    const nestedPath = `${blocksName}[${parentIndex}]`
    const published = documentId.replace(/^drafts\./, '')
    const draftsVersionExist = await client.fetch(`!(count(*[_id == 'drafts.${published}'])==0)`)

    const updateDocument = async () => {
      await client
        .patch(`drafts.${published}`)
        .set({[nestedPath]: objCopy})
        .commit()
        .then(() => {
          setLoadingPaste(false)

          toast.push({
            status: 'success',
            title: 'Pasted successfully',
          })
        })
        .catch((err) => {
          setLoadingPaste(false)

          console.error(err)
          toast.push({
            status: 'error',
            title: `Something went wrong: ${
              err.details?.items
                ? err?.details?.items.map((item: any) => item?.error?.description).join('; ')
                : err?.details?.description
            }`,
          })
        })
    }

    if (draftsVersionExist) {
      await updateDocument()
    } else {
      await client.fetch(`*[_id == '${published}'][0]`).then(async (result) => {
        result._id = `drafts.${published}`
        result._updatedAt = `${new Date().toISOString().slice(0, -5)}Z`

        await client.createIfNotExists(result).then(async () => {
          await updateDocument()
        })
      })
    }
  }

  const onCopy = (isToast = true) => {
    writeObjectToLs({...parent})

    if (isToast) {
      toast.push({
        status: 'success',
        title: 'Copied successfully',
      })
    }

    setAllowedToPaste(true)
  }

  const onSubmit = () => {
    const objCopy = getObjectFromLs(parent?._type)
    const pagesForPatch = Object.entries(checkedPages).filter((page) => page[1])
    let i = 0
    const patchPages = new Promise<void>((resolve) => {
      pagesForPatch?.forEach(async (page) => {
        const _id = page[0]
        const published = _id.replace(/^drafts\./, '')
        const draftsVersionExist = await client.fetch(
          `!(count(*[_id == 'drafts.${published}']) == 0)`
        )

        const updateDocument = async () => {
          const copiedBlock = deepSearchReplace(objCopy)

          await client
            .patch(`drafts.${published}`)
            .setIfMissing({[blocksName]: []})
            .insert('after', `${blocksName}[-1]`, [copiedBlock])
            .commit({
              autoGenerateArrayKeys: true,
            })
            .then(() => {
              i++
              if (i === pagesForPatch?.length - 1) {
                resolve()
              }
            })
            .catch(async (err) => {
              console.error(err)
              toast.push({
                status: 'error',
                title: `Something went wrong: ${
                  err?.details?.items?.map((item: any) => item?.error?.description)?.join('; ') ||
                  err?.description ||
                  JSON.stringify(err)
                }`,
              })
              if (i === pagesForPatch?.length - 1) {
                resolve()
              }
            })
        }

        if (draftsVersionExist) {
          await updateDocument()
        } else {
          await client.fetch(`*[_id == '${published}'][0]`).then(async (result) => {
            result._id = `drafts.${published}`
            result._updatedAt = `${new Date().toISOString().slice(0, -5)}Z`

            await client.createIfNotExists(result).then(async () => {
              await updateDocument()
            })
          })
        }
      })
    })

    patchPages.then(() => {
      onClose()
      if (i > 0) {
        setTimeout(() => {
          toast.push({
            status: 'success',
            title: `Duplicated to ${i} pages successfully`,
          })
        }, 1000)
      } else {
        toast.push({
          status: 'warning',
          title: `Duplicated to ${i} pages with some warnings`,
        })
      }
    })
  }

  const multipleDuplicate = () => {
    onCopy(false)
    onOpen()
  }

  const deselectAll = () => {
    setCheckedPages({})
    setDeselect(true)
    setTimeout(() => {
      setDeselect(false)
    }, 100)
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <Stack space={1}>
        {open && (
          <Dialog
            header="Duplicate to multiple pages"
            id="dialog"
            onClose={onClose}
            zOffset={1000}
            width={600}
          >
            {pagesForMultipleCopy.length > 0 ? (
              <form onSubmit={onSubmit}>
                <Box style={{position: 'relative', overflow: 'visible', height: '500px'}}>
                  <Box padding={4} style={{maxHeight: '100%', overflowY: 'scroll'}}>
                    <Text size={1} style={{color: '#6e7683'}}>
                      Ordered by update date
                    </Text>
                    {pagesForMultipleCopy.map((page: any) => (
                      <SelectedPage
                        page={page}
                        setCheckedPages={setCheckedPages}
                        checkedPages={checkedPages}
                        key={page._id}
                        isDeselect={isDeselect}
                      />
                    ))}
                  </Box>
                  <Flex
                    style={{
                      position: 'sticky',
                      bottom: 0,
                      background: 'white',
                      borderTop: '1px solid rgba(134,144,160,0.4)',
                      paddingBottom: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingRight: '0.75rem',
                      paddingLeft: '0.75rem',
                    }}
                    justify="space-between"
                  >
                    <Button
                      text="Deselect all"
                      mode="ghost"
                      onClick={() => deselectAll()}
                      disabled={Object.values(checkedPages).length < 1}
                    />
                    <Button
                      text="Duplicate the block to selected pages"
                      tone="positive"
                      disabled={Object.values(checkedPages).length < 1}
                      icon={BiCopyAlt}
                      type="submit"
                    />
                  </Flex>
                </Box>
              </form>
            ) : (
              <Card padding={4}>
                <Flex align="center" direction="row" gap={3} height="fill" justify="center">
                  <Spinner muted />
                  <Text muted size={1}>
                    Loading some content…
                  </Text>
                </Flex>
              </Card>
            )}
          </Dialog>
        )}

        <Flex style={{gap: '0.5em'}} align="center">
          <Button
            mode="ghost"
            type="button"
            onClick={multipleDuplicate}
            text={'Duplicate to multiple pages'}
            icon={BiCopyAlt}
          />
          <Button mode="ghost" type="button" onClick={() => onCopy()} text={'Copy'} icon={BiCopy} />

          {allowedToPaste ? (
            <Button
              mode="ghost"
              type="button"
              onClick={() => onPaste()}
              text={isLoadingPaste ? 'Pasting...' : 'Paste'}
              icon={isLoadingPaste ? SpinnerFixed : BiPaste}
            />
          ) : null}
        </Flex>
      </Stack>
    </ThemeProvider>
  )
}

CopyPasteInput.displayName = 'CopyPasteInput'

export default CopyPasteInput
