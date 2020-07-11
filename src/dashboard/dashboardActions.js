import axios from 'axios'

export function getSummary() {
    const request = axios.get(`${window.Params.URL_API}/billingCycles/summary`)
    return {
        type: 'BILLING_SUMMARY_FETCHED',
        payload: request
    }
}