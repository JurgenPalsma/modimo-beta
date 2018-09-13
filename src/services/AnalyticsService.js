import Api from '@/services/Api'
import UserService from '@/services/UserService'

export default {
    async getStats (token, daterange) {
        let to = ''
        let from = ''
        if (daterange[0] && daterange[1]) {
            from = daterange[0].toISOString()
            to = daterange[1].toISOString()
        }
        let res = await Api().get('/api/reporting/stats', {
            headers: {
                'x-access-token': token,
                'from': from,
                'to': to
            }
        })
        if (res.data.success) {
            res.data.chart_tickets = await addTicketCloserToTicketList(token, res.data.caretaker_numbers.tickets)
            res.data.tickets_created_per_day = addDatetoTicketList(res.data.ticket_numbers.tickets_created_per_day)
            res.data.ticket_times = formatTicketTime(res.data.ticket_numbers.avg_resolution_time, res.data.ticket_numbers.shortest_ticket, res.data.ticket_numbers.longest_ticket)
        }
        return res
    }
}

async function addTicketCloserToTicketList (token, tickets) {
    let tArray = []
    for (let i = 0; i < tickets.length; i++) {
        let res = await UserService.getUser(token, tickets[i]._id)
        if (res.data.success) {
            tArray.push([res.data.user.name, tickets[i].tickets_closed])
        }
    }
    return tArray
}

function addDatetoTicketList (tickets) {
    let tArray = []
    for (let i = 0; i < tickets.length; i++) {
        tArray.push([tickets[i].date, tickets[i].amount])
    }
    return tArray
}

function formatTimeHours (avg) {
    // TODO: format string so we dont get weird floats for time avg but get "jour, mois, etc"
    if (avg && avg.toFixed(1) !== 0) {
        return avg.toFixed(1) + 'h'
    } else {
        return '<1h'
    }
}

function formatTicketTime (avg, short, long) {
    return { 'avg_ticket_time': formatTimeHours(avg),
        'shortest_ticket': short,
        'longest_ticket': long,
        'shortest_ticket_time': formatTimeHours(short.resolution_time),
        'longest_ticket_time': formatTimeHours(long.resolution_time)
    }
}
