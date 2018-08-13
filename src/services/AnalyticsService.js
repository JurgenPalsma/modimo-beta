import Api from '@/services/Api'
import UserService from '@/services/UserService'

export default {
    async getStats (token, daterange) {
        let res = await Api().get('/api/reporting/stats', {
            headers: {
                'x-access-token': token,
                'from': '',
                'to': ''
            }
        })
        console.log(res.data.caretaker_numbers.tickets)
        res.data.chart_tickets = await addTicketCloserToTickets(token, res.data.caretaker_numbers.tickets)
        return res
    }
}

async function addTicketCloserToTickets (token, tickets) {
    let tArray = []
    for (let i = 0; i < tickets.length; i++) {
        let res = await UserService.getUser(token, tickets[i]._id)
        if (res.data.success) {
            tArray.push([res.data.user.name, tickets[i].tickets_closed])
        }
    }
    return tArray
}
