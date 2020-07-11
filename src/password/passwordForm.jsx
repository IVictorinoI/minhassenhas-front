import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init, seePassword, changePassword, copyPasswordToClipboard } from './passwordActions'
import LabelAndInput from '../common/form/labelAndInput'
import Input from '../common/form/input'

import If from '../common/operator/if'

class PasswordForm extends Component {
    render() {
        const { handleSubmit, readOnly, editing, _id, currentPassword, isChangingPassword } = this.props
        return (
            <form onSubmit={handleSubmit} autoComplete="off">
                <Field name='_id' component={Input} readOnly={readOnly}
                    label='Id' cols='12 4' placeholder='Id' type="hidden" />
                <div className='box-body'>
                    <Field name='description' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Descrição' cols='12 4' placeholder='Informe a descrição' />
                </div>
                <div className='box-body'>
                    <Field name='login' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Login' cols='12 4' placeholder='Informe o login/e-mail' />
                </div>
                <div className='box-body'>
                    <Field name='url' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Url' cols='12 4' placeholder='Informe a URL' />
                </div>
                
                <If test={editing} >
                    <div>
                        <div className='box-body'>
                            <button type='button' className='btn btn-danger'
                                onClick={() => { this.props.seePassword(_id) }}> Ver senha </button>
                            <button type='button' className='btn btn-warning'
                                onClick={() => { this.props.changePassword(true) }}> Alterar senha </button>
                            <button type='button' className='btn btn-success'
                                onClick={() => { this.props.copyPasswordToClipboard(_id) }}> Copiar senha </button>
                            
                            
                        </div>
                    </div>
                </If>
                <If test={!editing || isChangingPassword} >
                    <div className='box-body'>
                        <Field name='password' autoComplete="false" component={LabelAndInput} readOnly={readOnly}
                            label='Senha' cols='12 4' placeholder='Informe a senha' />
                    </div>
                </If>
                <If test={currentPassword} >
                    <div className='box-body'>
                        <span>{currentPassword.password}</span>
                    </div>
                </If>
                <div className='box-footer'>
                    <button type='submit' className={`btn btn-${this.props.submitClass}`}>
                        {this.props.submitLabel}
                    </button>
                    <button type='button' className='btn btn-default'
                        onClick={this.props.init}>Cancelar</button>
                </div>
            </form>
        )
    }
}

PasswordForm = reduxForm({form: 'passwordForm', destroyOnUnmount: false})(PasswordForm)
const selector = formValueSelector('passwordForm')
const mapStateToProps = state => ({
    currentPassword: state.password.currentPassword,
    isChangingPassword: state.password.isChangingPassword,
    _id: selector(state, '_id')
})
const mapDispatchToProps = dispatch => bindActionCreators({init, seePassword, changePassword, copyPasswordToClipboard}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(PasswordForm)