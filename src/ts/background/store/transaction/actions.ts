import { LocalStore } from '../../../services/local-store'
import { AnyAction } from 'redux'

export type TransactionType = 'Sent' | 'Received' | 'Staked'
export type TransactionStatus = 'Pending' | 'Success' | 'Failure'

export interface ITransaction {
  txHash: string
  from: string
  to: string
  amount: string
  unit: string
  fee: string
  type: TransactionType
  status: TransactionStatus
  createTime: number
  updateTime?: number
}

export const ACTION_TYPES = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  SAVE_TRANSACTIONS: 'SAVE_TRANSACTIONS',
  UPSERT_TRANSACTION: 'UPSERT_TRANSACTION'
}

const PREFIX = 'transactions_'

export function getTransactions (address: string, chain: string): AnyAction {
  return {
    type: ACTION_TYPES.GET_TRANSACTIONS,
    payload: LocalStore.getValue(PREFIX + address + '_' + chain)
  }
}

export function upsertTransaction (address: string, chain: string,
                                   tran: ITransaction, list: ITransaction[]): AnyAction {
  if (list === null) { list = [] }
  const idx = list.findIndex(item => item.txHash === tran.txHash)
  let updated = [tran]
  if (idx < 0) {
    updated = updated.concat(list)
  } else {
    updated = [...list.slice(0, idx), tran, ...list.slice(idx + 1)]
  }
  return {
    type: ACTION_TYPES.UPSERT_TRANSACTION,
    payload: LocalStore.setValue(PREFIX + address + '_' + chain, updated)
  }
}

export function saveTransactions (address: string, chain: string,
    list: ITransaction[]): AnyAction {
  return {
    type: ACTION_TYPES.SAVE_TRANSACTIONS,
    payload: LocalStore.setValue(PREFIX + address + '_' + chain, list)
  }
}
