


export class GithubUser{

    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint) //fetch vai buscar o endpoint...o .the é uma promessa então quando finalizar a promessa eu vou pegar meu dado(data) e transformar em json
        .then(data => data.json())//eu podia transformar em texto..mais em json é o tipo de dado que eu já espero desse endpoint 
                    // desestruturando aqui
        .then(({ login, name, public_repos ,followers}) => ({ 
            login, 
            name,
            public_repos,
            followers
        }))
        
    }
}


