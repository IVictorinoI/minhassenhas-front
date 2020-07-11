import React from 'react'

export default props => (
    <input {...props.input}
        readOnly={props.readOnly}
        type={props.type} />
)