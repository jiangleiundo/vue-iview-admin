import {hasAccess} from '../../libs/util'

const tips = {
    edit: '编辑',
    view: '查看',
    delete: '删除',
    frozen: '禁用',
    thaw: '解除禁用',
    relfunc: '关联菜单',
    role: '关联角色',
    reset: '重置密码',
    start: '启用',
    stop: '停用',
    approve: '审核',
    release: '解除',
    draw: '领取任务',
    cancel: '取消领取',
    rollback: '收回',
    invite: '邀请',
    limitchange: '额度调整',
    alter: '变更',
    stoppay: '止付',
    startpay: '解除',
    upper: '上架',
    lower: '下架',
    reluser: '关联用户',
    statuschange: '状态变更',
    known: '已知'
}

const buildNormalBtn = (h, params, vm, type, color, size) => {
    return h('Tooltip', {
        style: {
            width: '35px'
        },
        props: {
            transfer: true,
            content: tips[type],
            placement: 'top'
        }
    }, [
        h('Button', {
            style: {
                border: 'none',
                backgroundColor: 'inherit',
                width: '35px',
                textAlign: 'center'
            },
            props: {
                type: 'text',
                ghost: false,
                'html-type': 'button'
            },
            on: {
                'click': () => {
                    vm.$emit('on-' + type, params)
                    event.stopPropagation()
                    event.preventDefault()
                }
            }
        }, [
            h('Icon', {
                style: {
                    // marginLeft: '-7px',
                },
                props: {
                    custom: 'iconfont icon-' + type,
                    size: size || 18,
                    color: color || '#000000'
                }
            })
        ])
    ])
}

const buildConfirmBtn = (h, params, vm, type, color, size) => {
    return h('Tooltip', {
        style: {
            width: '35px'
        },
        props: {
            transfer: true,
            content: tips[type],
            placement: 'top'
        }
    }, [
        h('Poptip', {
            style: {
                width: '35px'
            },
            props: {
                transfer: true,
                confirm: true,
                title: '是否确定' + tips[type] + '？'
            },
            on: {
                'on-ok': () => {
                    vm.$emit('on-' + type, params)
                }
            }
        }, [
            // h('Button', {
            //     style: {
            //         border: 'none',
            //         backgroundColor: 'inherit',
            //         width: '35px',
            //         textAlign: 'center'
            //     },
            //     props: {
            //         type: 'text',
            //         ghost: true,
            //         'html-type': 'button'
            //     },
            //     on: {
            //         'click': () => {
            //             event.initEvent('click', true, true)
            //             event.stopPropagation()
            //             event.preventDefault()
            //         }
            //     }
            // }, [
                h('Icon', {
                    style: {
                        'margin-left': '-7px'
                    },
                    props: {
                        custom: 'iconfont icon-' + type,
                        size: size || 18,
                        color: color || '#000000'
                    }
                })
            // ])
        ])
    ])
}

export const handleBtns = {
    edit: {
        auth: code => {
            // return hasAccess(code + '_UPT')
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'edit')
        }
    },
    view: {
        auth: code => {
            // return hasAccess(code + '_DTL')
            return true // 默认均可以查看
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'view')
        }
    },
    del: {
        auth: code => {
            return hasAccess(code + '_DEL')
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'delete')
        }
    },
    delete: {
        auth: code => {
            return hasAccess(code + '_DEL')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'delete')
        }
    },
    frozen: {
        auth: code => {
            return hasAccess(code + '_FRZ')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'frozen')
        }
    },
    thaw: {
        auth: code => {
            return hasAccess(code + '_THW')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'thaw')
        }
    },
    relfunc: {
        auth: code => {
            return hasAccess(code + '_REL')
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'relfunc')
        }
    },
    role: {
        auth: code => {
            return hasAccess(code + '_ROL')
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'role')
        }
    },
    reset: {
        auth: code => {
            return true
            // return hasAccess(code + '_RES')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'reset')
        }
    },
    start: {
        auth: code => {
            return hasAccess(code + '_STA')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'start')
        }
    },
    stop: {
        auth: code => {
            return hasAccess(code + '_STP')
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'stop')
        }
    },
    approve: {
        auth: code => {
            return hasAccess(code + '_APO')
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'approve')
        }
    },
    release: {
        auth: code => {
            return hasAccess(code + '_APO')
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'release')
        }
    },
    draw: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'draw')
        }
    },
    cancel: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'cancel')
        }
    },
    rollback: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'rollback')
        }
    },
    invite: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'invite')
        }
    },
    limitchange: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'limitchange')
        }
    },
    alter: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'alter')
        }
    },
    stoppay: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'stoppay')
        }
    },
    startpay: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'startpay')
        }
    },
    upper: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'upper')
        }
    },
    lower: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'lower')
        }
    },
    reluser: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'reluser')
        }
    },
    statuschange: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildNormalBtn(h, params, vm, 'statuschange')
        }
    },
    known: {
        auth: code => {
            return true
        },
        btn: (h, params, vm) => {
            return buildConfirmBtn(h, params, vm, 'known')
        }
    },
}

export default handleBtns
