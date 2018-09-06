function createdAtDiff(a, b) {
    return a.updated_at - b.updated_at;
}

function votesDiff(a, b) {
    return a.votes.length - b.votes.length
}

function commentsDiff(a, b) {
    return a.comments.length - b.comments.length
}

module.exports.sortTickets = function(orderlist, tickets) {
    /*
        Sorting Priority:
            - Number of votes
            - Number of comments
            - Date updated
    */
    tickets.sort(function(a,b) {

        if (orderlist.includes('vote_asc')) {
            if (votesDiff(a, b) != 0)
                return votesDiff(a,b)
        }

        if (orderlist.includes('vote_desc')) {
            if (votesDiff(b, a) != 0) {
                return votesDiff(b, a)
            }
        }

        if (orderlist.includes('comments_asc')) {
            if (commentsDiff(a, b) != 0)
                return commentsDiff(a,b)
        }

        if (orderlist.includes('comments_desc')) {
            if (commentsDiff(b, a) != 0) {
                return commentsDiff(b, a)
            }
        }

        if (orderlist.includes('date_asc')) {
            return createdAtDiff(b,a);
        }

        if (orderlist.includes('date_desc')) {
            return createdAtDiff(a,b);
        }
    })
    return tickets
}