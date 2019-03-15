
evenlisteners();

function evenlisteners(){
document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
 e.preventDefault();
   
 let usuario = document.querySelector('#usuario').value,
     password = document.querySelector('#password').value,
         tipo = document.querySelector('#tipo').value;

 if (usuario == '' ||  password == '') {
     /**LA validacion fallo */
    Swal.fire({
        type: 'error',
        title: 'Error!',
        text: 'Ambos campos son obligatorios!'
      })
 }else{
    /**AMbos campos son correctos,
     *  mandar llamar ajax,
     * formData nos permite estruturar nuestro llamdo a ajax, darle una llave y un valor */
/**Datos que se envian al servidor (PHP) */
    let datos=new FormData();
    datos.append('usuario', usuario);
    datos.append('password', password);
    datos.append('accion', tipo);

   /** console.log(datos.get('usuario'));*/

        /**crear la variable */
        const xhr =new XMLHttpRequest();
        /**abrir la conexion */
        xhr.open('POST','inc/modelos/modelo-admin.php',true);
        /**retorno de  los datos */
        xhr.onload= function() {
            if(this.status===200){
                let respuesta=JSON.parse(xhr.responseText);
                console.log(respuesta);
                /**SI la respuesta es correcta */
                if (respuesta.respuesta==='correcto') {
                     /**Si es un nuevo usuario */
                     if (respuesta.tipo==='crear') {
                         swal({
                            title:'Usuario Creado',
                            text:'El usuario se creo correctamente',
                            type:'success'
                         });

                     }else if(respuesta.tipo==='login'){
                        swal({
                            title:'Login Correcto',
                            text:'Presiona Ok para abrir el Dashboard',
                            type:'success'
                         })
                         .then(resultado=>{
                            if (resultado.value) {
                                window.location.href='index.php';
                            }
                         });

                     }
                    
                }else{
                    /**Hubo un error */

                    swal({
                        title:'Error',
                        text:'Hubo un error',
                        type:'error'
                     });
                }


            }
        }
        /**enviar */
        xhr.send(datos);


    
 }

}