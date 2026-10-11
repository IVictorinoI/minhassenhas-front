import React, { Component, createRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import { init, create, update, remove, showCreate, closeDialog } from './passwordActions'
import List from './passwordList'
import Form from './passwordForm'

class Password extends Component {
    dialog = createRef()
    componentDidMount() { this.props.init() }
    componentDidUpdate() {
        const dialog = this.dialog.current
        if (this.props.dialogMode && !dialog.open) dialog.showModal()
        if (!this.props.dialogMode && dialog.open) dialog.close()
    }
    render() {
        const mode = this.props.dialogMode
        const editing = mode === 'update'
        const deleting = mode === 'delete'
        const title = deleting ? 'Excluir senha' : editing ? 'Editar senha' : 'Nova senha'
        return (
            <div>
                <ContentHeader title='Senhas' small='Cadastro' />
                <Content>
                    <div className='card'>
                        <div className='card-header'>
                            <button type='button' className='btn btn-primary' onClick={this.props.showCreate}>
                                <i className='fa fa-plus me-2' aria-hidden='true' />Novo
                            </button>
                        </div>
                        <div className='card-body'><List /></div>
                    </div>
                    <dialog ref={this.dialog} aria-labelledby='password-dialog-title'
                        className='rounded border-0 p-0 shadow'
                        style={{ width: 'min(600px, calc(100% - 2rem))', maxHeight: 'calc(100% - 2rem)' }}
                        onCancel={event => { event.preventDefault(); this.props.closeDialog() }}>
                        <div className='modal-header p-3 border-bottom'>
                            <h2 id='password-dialog-title' className='modal-title fs-5'>{title}</h2>
                            <button type='button' className='btn-close' aria-label='Fechar' onClick={this.props.closeDialog} />
                        </div>
                        <div className='p-3'>
                            {mode && <Form key={mode} onSubmit={deleting ? this.props.remove : editing ? this.props.update : this.props.create}
                                editing={editing} readOnly={deleting}
                                submitLabel={deleting ? 'Excluir' : editing ? 'Alterar' : 'Incluir'}
                                submitClass={deleting ? 'danger' : 'primary'} />}
                        </div>
                    </dialog>
                </Content>
            </div>
        )
    }
}
const mapStateToProps = state => ({ dialogMode: state.password.dialogMode })
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update, remove, showCreate, closeDialog }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Password)
