import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Field from '../common/form/field'
import { init, seePassword, changePassword, copyPasswordToClipboard } from './passwordActions'
import LabelAndInput from '../common/form/labelAndInput'
import Input from '../common/form/input'
import If from '../common/operator/if'

function PasswordForm(props) {
    const { readOnly, editing, currentPassword, isChangingPassword, selectedPassword, formRevision } = props
    const { control, handleSubmit, reset, watch } = useForm({ defaultValues: { _id: '', description: '', login: '', url: '', password: '' } })
    useEffect(() => { reset({ _id: '', description: '', login: '', url: '', password: '', ...selectedPassword }) }, [selectedPassword, formRevision, reset])
    const _id = watch('_id')
    const submit = values => {
        const data = { ...values }
        if (editing && !isChangingPassword) delete data.password
        return props.onSubmit(data)
    }
        return (
            <form onSubmit={handleSubmit(submit)} autoComplete="off">
                <Field control={control} name='_id' component={Input} readOnly={readOnly}
                    label='Id' cols='12 4' placeholder='Id' type="hidden" />
                <div className='box-body'>
                    <Field control={control} name='description' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Descrição' cols='12 4' placeholder='Informe a descrição' />
                </div>
                <div className='box-body'>
                    <Field control={control} name='login' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Login' cols='12 4' placeholder='Informe o login/e-mail' />
                </div>
                <div className='box-body'>
                    <Field control={control} name='url' autoComplete="off" component={LabelAndInput} readOnly={readOnly}
                        label='Url' cols='12 4' placeholder='Informe a URL' />
                </div>

                <If test={editing} >
                    <div>
                        <div className='box-body'>
                            <button type='button' className='btn btn-danger'
                                onClick={() => { props.seePassword(_id) }}> Ver senha </button>
                            <button type='button' className='btn btn-warning'
                                onClick={() => { props.changePassword(true) }}> Alterar senha </button>
                            <button type='button' className='btn btn-success'
                                onClick={() => { props.copyPasswordToClipboard(_id) }}> Copiar senha </button>


                        </div>
                    </div>
                </If>
                <If test={!editing || isChangingPassword} >
                    <div className='box-body'>
                        <Field control={control} name='password' autoComplete="false" component={LabelAndInput} readOnly={readOnly}
                            label='Senha' cols='12 4' placeholder='Informe a senha' />
                    </div>
                </If>
                <If test={currentPassword} >
                    <div className='box-body'>
                        <span>{currentPassword.password}</span>
                    </div>
                </If>
                <div className='box-footer'>
                    <button type='submit' className={`btn btn-${props.submitClass}`}>
                        {props.submitLabel}
                    </button>
                    <button type='button' className='btn btn-default'
                        onClick={props.init}>Cancelar</button>
                </div>
            </form>
        )
}
const mapStateToProps = state => ({ ...state.password })
const mapDispatchToProps = dispatch => bindActionCreators({ init, seePassword, changePassword, copyPasswordToClipboard }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(PasswordForm)
