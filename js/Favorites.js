
import { GithubUser } from "./GithubUser.js"




//classe que vai conter a lógica dos dados
//- como os dados serão estruturados
export class Favorites{ //root será no "app"
    constructor(root){
        this.root = document.querySelector(root)
        this.load()


      GithubUser.search('ThaAmoedo').then(user => console.log(user))
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

       
    }


save(){  // transorma o this.entries (que ele é um arrey cheio de objts) em uma stringi em um formato de json para salvar nesse localStorage(@github-favorites:)
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))//stringify() vai trasformar um objeto que está em JS para um objeto do tipo Json em texto/stringi
}

    //value
   async add(username){//função assíncrona
    try{ //tente

        const userExists = this.entries.find(entrada => entrada.login.toLowerCase() === username.toLowerCase());

        
        if(userExists) {
            throw new Error('Usuário já cadastrado!')
        }


        // await - aguardar, esperar...para usar isso eu tenho q add o async na função
    const user = await GithubUser.search(username)//ele vai aguardar a promessa 
  
  //capturando o erro e mostrando na mensagem
    if(user.login === undefined){
    throw new Error('Usuário não encontrado :(')
   }

//criando um novo arrey colocando o usuario(user) e trazendo de volta(...this) antes de terminar de criar esse novo arrey, tras de volta todos os outros elemnetos que eu tinha no outro arrey e espalha aqui dentro 
   this.entries = [user,...this.entries]
   this.update() //vai reescrever td
   this.save()


} catch(error)/*capture*/{
    alert(error.message) // mostrando na mensagem
   }

    }


    delete(user){

        //Higher-order functions = funções de alta ordem  Exemplo: map, filter, find, reduce
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
    
}



//classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites{
    constructor(root){ //esse root é o #app
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
                //dentro do input eu sei q tem o value, ent quero tirar só ele
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }
    }
    
    update(){
        this.removeALLTr()

     this.entries.forEach( user => {
     const row = this.createRow()

     row.querySelector('.user img').src = `https://github.com/${user.login}.png`
     row.querySelector('.user a').href = `https://github.com/${user.login}` 

     row.querySelector('.user img').alt = `Imagem de ${user.name}` 
     row.querySelector('.user p').textContent = user.name
     row.querySelector('.user span').textContent = user.login
     row.querySelector('.repositorios').textContent = user.public_repos
     row.querySelector('.followers').textContent = user.followers
     

//.onclik é usando quando eu só coloco UM evento e não vou mais colocar outro evento na minha aplicação
     row.querySelector('.remove').onclick = () => {
        
        const isOK = confirm('Tem certeza que deseja deletar essa linha?'); 
        
        if(isOK){
            this.delete(user)
        }
     }
     
     // console.log(row)

     this.tbody.append(row)
    })

    }
    


    createRow(){

        const tr = document.createElement('tr')

        //aqui eu já fiz direto (fica mais curto kkk)
        tr.innerHTML = ` 
        <td class="user">
           <img src="https://github.com/ThaAmoedo.png" alt="Imagem">
  
           <a href="https://github.com/ThaAmoedo" target="_blank">
              <p>Thaís Amoedo</p>
               <span>thaamoedo</span>
           </a>
       </td> 
  
       <td class="repositorios">24</td>
       <td class="followers">1</td>
  
           <td>
               <button class="remove">&times;</button>
           </td>
 
    `

     return tr

    //tr.innerHTML = content //coloca o conteudo usando o .innerHTML (e deixaria const content)
    }
   
    removeALLTr(){
        //const tbody = this.root.querySelector('table tbody')//poderia ser só tbody 

        this.tbody.querySelectorAll('tr')//.querySelectorAll - to pegando todas as linhas 
        .forEach((tr) => {//.forEach - para cada

            tr.remove()

        })  //(tr) => {}  - ele vai receber o tr
    } 


   
}