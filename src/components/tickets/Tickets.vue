<template>
  <section class="hero is-info">
    <div class="container is-fluid">
    <div class="notification">
      This container is <strong>fluid</strong>: it will have a 32px gap on either side, on any
      viewport size.
    </div>
  </div>
  </section>
</template>

<script>
import ticket from './Ticket.vue'

export default {
    name: 'tickets',
    data () {
        return {
	tickets:[
		{
			'_id': 'aeijazoiejazoiej',
			'title': 'Salut jai un probleme',
			'content': 'Lascenceur est cassé',
			'author_id': 'ezaoijeeeaezazo',
			 'created_at': {
        		'$date': '2018-08-13T10:09:26.236Z'
    		},
    		'updated_at': {
        		'$date': '2018-08-13T10:12:47.414Z'
    		},
			'comment': [
				{
					'_id': 'aeoizjezaojiaez',
					'author_id': 'eazoijeizaoj',
					'content': 'Ouais cest un vrai probleme',
					'created_at': {
		        		'$date': '2018-08-13T10:09:26.236Z'
		    		},
		    		'updated_at': {
		        		'$date': '2018-08-13T10:12:47.414Z'
		    		},
				},
				{
					'_id': 'aaezojiaez',
					'author_id': 'eaeazejeizaoj',
					'content': 'Ouais',
					'created_at': {
		        		'$date': '2018-08-13T10:09:26.236Z'
		    		},
		    		'updated_at': {
		        		'$date': '2018-08-13T10:12:47.414Z'
		    		},
				}
			],
			'votes': [
					'aeoizjezaojiaez',
					'aaezojiaez'
			],
			'status': 'open'
		},
		{
			'_id': 'aeijazaezoiejazoiej',
			'title': 'Salut jai un deuxieme probleme',
			'content': 'La porte est cassée',
			'author_id': 'ezaoijeeeaaezezazo',
			 'created_at': {
        		'$date': '2018-08-13T10:09:26.236Z'
    		},
    	'updated_at': {
        		'$date': '2018-08-13T10:12:47.414Z'
    		},
			'comment': [
				{
					'_id': 'aeoizjeqxczaojiaez',
					'author_id': 'eazoijeizaoj',
					'content': 'Ouais je suis daccord',
					'created_at': {
		        		'$date': '2018-08-13T10:09:26.236Z'
		    		},
		    		'updated_at': {
		        		'$date': '2018-08-13T10:12:47.414Z'
		    		},
				}
			],
			'votes': [
					'aeoizjezaojiaez',
					'aaezojiaez',
					'oezaijoezaezaioezaiojoijeaz'
			],
			'status': 'closed'
		}
	]

}
    },
    components: {
        'ticket': ticket
    }
}
</script>

<style lang="scss">

</style>
