import React from 'react'
import If from '../operator/if'
export default props => (
    <If test={!props.hide}>
        <div className="form-group has-feedback">
            <input id={props.name} {...props.input}
                className='form-control'
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                type={props.type} />
            <span aria-hidden="true" className={`fa fa-${props.icon}`}></span>
        </div>
    </If>
)
