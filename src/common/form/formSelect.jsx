import React from 'react'
import Select from 'react-select'

export default props => {
    const { input, options } = props;
    return (
        <Select 
            {...input} 
            placeholder={props.placeholder}
            readOnly={props.readOnly} 
            getOptionLabel={(option)=> props.displayProperty ? option[props.displayProperty] : option.value }
            getOptionValue={(option)=> option._id ? option._id : option.value }                   
            onChange={value => input.onChange(value)} 
            onBlur={() => input.onBlur(input.value)} 
            options={options}
        />
    )
  }