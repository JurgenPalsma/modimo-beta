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

function timeToString (time) {
    if (!time)
        return ""
    if (time.day) {
        return time.day + " jours"
    } else if (time.hour) {
        return time.hour + " heures"
    }
    return "< 1h";
}

function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

function formatTicketTime (avg, short, long) {
    /* Fix à l'arrache */
    let data = { 'avg_ticket_time': timeToString(avg),
    'shortest_ticket': short,
    'longest_ticket': long,
    }
    let s = new Date(short.resolution_time)
    let l = new Date(long.resolution_time)
    console.log(s.getTime())
    console.log(l.getTime())
    if (short && long) {
        data.shortest_ticket_time = timeToString(convertMS(s))
        data.longest_ticket_time = timeToString(convertMS(l))
    }
    return data
}
