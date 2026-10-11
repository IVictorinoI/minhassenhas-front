import './auth.css'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Field from '../common/form/field'
import { login as loginAction, signup as signupAction } from './authActions'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import Messages from '../common/msg/messages'
import Input from '../common/form/inputAuth'

export default function Auth() {
    const [loginMode, setLoginMode] = useState(true)
    const { control, handleSubmit } = useForm({ defaultValues: { name: '', email: '', password: '', confirm_password: '' } })
    const dispatch = useDispatch()
    const login = values => dispatch(loginAction(values))
    const signup = values => dispatch(signupAction(values))
        return (
            <div className="login-box">
                <div className="login-logo"><b> Minhas</b> Senhas</div>
                <div className="login-box-body">
                    <p className="login-box-msg">Bem vindo!</p>
                    <form onSubmit={handleSubmit(values => loginMode ? login(values) : signup(values))}>
                        <Field control={control} component={Input} type="text" name="name"
                            placeholder="Nome" icon='user' hide={loginMode} />
                        <Field control={control} component={Input} type="email" name="email"
                            placeholder="E-mail" icon='envelope' />
                        <Field control={control} component={Input} type="password" name="password"
                            placeholder="Senha" icon='lock' />
                        <Field control={control} component={Input} type="password" name="confirm_password"
                            placeholder="Confirmar Senha" icon='lock' hide={loginMode} />
                        <Row>
                            <Grid cols="4">
                                <button type="submit"
                                    className="btn btn-primary w-100">
                                    {loginMode ? 'Entrar' : 'Registrar'}
                                </button>
                            </Grid>
                        </Row>
                    </form>
                    <br />
                    <a onClick={() => setLoginMode(mode => !mode)}>
                        {loginMode ? 'Novo usuário? Registrar aqui!' :
                            'Já é cadastrado? Entrar aqui!'}
                    </a>
                </div>
                <Messages />
            </div>
        )
}
