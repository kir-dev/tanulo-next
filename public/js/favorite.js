// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deleteFavorite(room) {
  fetch(`/favorites/${room}`, { method: 'DELETE' })
    .then(async res => {
		switch(res.status) {
		  case 201:
			location.reload()
        	break
		  case 401:
        	displayMessage('danger', UNAUTHORIZED_MESSAGE)
        	break
		  case 403:
        	displayMessage('danger', FORBIDDEN_MESSAGE)
        	break
		  case 404:
        	data = await res.json()
        	displayMessage('danger', data.message)
        break
		  }
    })
    .catch(err => displayMessage('danger', err))
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addFavorite(room) {
	if (!room) {
		displayMessage('danger', err)
  	} else {
		fetch('/favorites', { 
			method: 'POST',  
			headers: {
      			'Content-Type': 'application/json'
    		},
			body: JSON.stringify({ room }), 
		})
    .then(async (res) => {
		  switch (res.status) {
		  	case 201:
			    location.reload()
          break
		  	case 401:
          displayMessage('danger', UNAUTHORIZED_MESSAGE)
					break
				case 403:
        	displayMessage('danger', FORBIDDEN_MESSAGE)
        	break
		  	case 404:
        	data = await res.json()
        	displayMessage('danger', data.message)
        	break
		  }
      })
      .catch((err) => displayMessage('danger', err))
  }
}
