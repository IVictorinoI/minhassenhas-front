import React, { Component } from 'react'

import Grid from '../layout/grid'
import Select from 'react-select'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

export default class WithCallbacks extends Component {
    handleChange (selectedOption) {
        console.log(`Option selected:`, selectedOption);
    }
      
  render() {
    return (
        <Grid cols={this.props.cols}>
            <div className='form-group'>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <Select 
                        //value={selectedOption}
                        placeholder={this.props.placeholder}
                        readOnly={this.props.readOnly}
                        onChange={this.handleChange}
                        options={options}
                    />
            </div>
        </Grid>
    );
  }
}
