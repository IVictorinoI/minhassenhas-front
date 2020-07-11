import React from 'react'
import Select from 'react-select'
import Grid from '../layout/grid'

export default props => {
    const { input, options } = props;
    return (
        <Grid cols={props.cols}>
            <div className='form-group'>
            <label htmlFor={props.name}>{props.label}</label>
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
            </div>            
        </Grid>
    )
  }