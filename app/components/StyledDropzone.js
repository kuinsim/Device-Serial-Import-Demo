import React, {useMemo} from 'react'
import {useDropzone} from 'react-dropzone'

const baseStyle = {
  display: 'inline-block',
  textAlign: 'center',
  width: '100%',
  height: 'auto',
  borderWidth: '2px',
  borderColor: '#666',
  borderStyle: 'dashed',
  borderRadius: '5px',
  backgroundColor: '#eeeeee',
  verticalAlign: 'middle',
  padding: '40px',
}

const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#78C5EF',
  backgroundColor: '#eeeeee'
}

const acceptStyle = {
  borderStyle: 'solid',
  borderColor: '#00e676',
  backgroundColor: '#eeeeee'
}

const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#ff1744',
  backgroundColor: '#eeeeee'
}

const StyledDropzone = (props) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: props.accept,
    onDropAccepted: props.onDropAccepted,
    onDropRejected: props.onDropRejected,
    minSize: props.minSize,
    maxSize: props.maxSize,
    multiple: props.multiple,
    isFileUploaded: props.isFileUploaded
  })

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    acceptedFiles,
    isDragActive,
    isDragReject,
    isDragAccept
  ])

  const uploadedFileInfo = acceptedFiles.map(file => (
    <div key={file.path}>
      <br></br>
      <div>
        Uploaded File:
      </div>
      <div>
        {file.path} - {file.size} bytes
      </div>
    </div>
  ));

  return (
    <div {...getRootProps({style})}>
      <input {...getInputProps()}/>
      <i className="far fa-file-excel"></i>
      <div>
        {!isDragActive && 'Click Here or Drop a .xlsx File'}
        {isDragActive && isDragAccept && 'Drop .xlsx File Here'}
        {isDragActive && isDragReject && 'File(s) Not Accepted'}
      </div>
      {(props.isFileUploaded === true) && !isDragActive && uploadedFileInfo}
    </div>
  )
}

export default StyledDropzone;