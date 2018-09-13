module.exports = [
    {
        'title': 'Bienvenue dans la démo Modimo',
        'content': 'Ce ticket est un ticket de test, ici, vous pourrez exposer un problème au sein de votre résidence',
        'status': 'open',
     'created_at': {
         '$date': '2018-08-14T10:09:26.236Z'
     },
     'comments': [
            {
                '_id': '123133',
                'author_id': 'oji23oijzea3',
                'content': 'Le gardien va s\'en occuper',
                'created_at': {
                    '$date': '2018-08-14T10:20:26.236Z'
                },
                'updated_at': {
                    '$date': '2018-08-14T10:20:26.236Z'
                }
            }
        ]
    },
    {
            'title': 'Ascenseur en panne',
            'content': 'L\'ascenseur du bâtiment A ne marche plus. Il est arrêté entre le deuxième et troisième étage. Merci de contacter OTIS afin qu\'ils interviennent',
            'status': 'pending',
            'created_at': {
                '$date': '2018-07-05T08:01:28.327Z'
            },
            'updated_at': {
                '$date': '2018-07-07T08:13:01.457Z'
            },
            'comments': [
                {
                    '_id': '123133',
                    'author_id': 'oji23oijzea3',
                    'content': 'Je suis très embêté, j\'ai une jambe dans le plâtre et j\'habite au 5ème étage. Il faut résoudre ce problème au plus vite !',
                    'created_at': {
                        '$date': '2018-07-06T08:07:01.457Z'
                    },
                    'updated_at': {
                        '$date': '2018-07-06T08:07:01.457Z'
                    }
                }
            ]
    },
    {
            'title': 'Fenêtre premier étage cassée',
            'content': 'Fenêtre dans la cage d\'escalier du 1er étage ne ferme plus. Pour éviter tout cambriolage, il faudrait que le gardien intervienne dans les plus brefs délais',
            'status': 'closed',
            'created_at': {
                '$date': '2018-06-25T06:34:28.337Z'
            },
            'updated_at': {
                '$date': '2018-06-26T08:22:02.257Z'
            },
            'comments': [
                {
                    '_id': '123133',
                    'author_id': 'oji23oijzea3',
                    'content': 'J\'ai pu voir les dégâts ce matin en partant au travail et habitant au premier étage, je suis la première cible des cambrioleurs, j\'espère que ce ticket sera vite résolu',
                    'created_at': {
                        '$date': '2018-06-25T07:38:02.257Z'
                    },
                    'updated_at': {
                        '$date': '2018-06-25T07:38:02.257Z'
                    }
                }
            ]
    },
    {
        'title': 'Dégradation parking',
        'content': 'Le parking sous terrain à été victime de tagueur la nuit dernière, il faudrait effacer ces graffitis qui sont, pour certains violents',
        'status': 'open',
        'created_at': {
            '$date': '2018-07-15T09:42:42.427Z'
        },
        'comments': [
            {
                '_id': '123133',
                'author_id': 'oji23oijzea3',
                'content': 'J\'ai rencontré le gardien ce matin qui m\'a dit qu\'il allait s\'en occuper au plus vite.',
                'created_at': {
                    '$date': '2018-07-15T10:17:57.447Z'
                },
                'updated_at': {
                    '$date': '2018-07-15T10:17:57.447Z'
                }
            }
        ]
    }
];