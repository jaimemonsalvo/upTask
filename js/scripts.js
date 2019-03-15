evenlisteners();

/**lista proyectos */

var listaProyectos=document.querySelector('ul#proyectos');

function evenlisteners() {

    /**PROYECTO AGREGAR BARRA DE PROGRESO */

    /**DOCUMENT READY */
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });




    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
 /**boton para una nueva tarea */
 document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
/**BOTONES PARA LAS ACCIONES DE TAREAS */

document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}


function nuevoProyecto(e) {
    e.preventDefault();
                /**crea un input para el nombre del nuevo proyecto */

            var nuevoProyecto=document.createElement('li');
            nuevoProyecto.innerHTML='<input type="text" id="nuevo-proyecto"  >';
            listaProyectos.appendChild(nuevoProyecto);

            /**seleccionar el ID con el nuevoProyecto */
            var inputNuevoProyecto=document.querySelector('#nuevo-proyecto');
          /**al presionar enter se crea un nuevo proyecto */
          inputNuevoProyecto.addEventListener('keypress', function(e){
                var tecla= e.witch || e.keyCode;

                if (tecla===13){
                    guardaProyectoDB(inputNuevoProyecto.value);
                    listaProyectos.removeChild(nuevoProyecto);
                }

          });


            function guardaProyectoDB(nombreProyecto){        
            

            /**llamado ajax para enviar los datos a php  */
              //crear la variable
            let xhr= new XMLHttpRequest();

            //enviar datos por fromData, con esto es mas facil

            let datos= new FormData();
            datos.append('proyecto', nombreProyecto);
            datos.append('accion', 'crear');
            //abrir la conexion
            xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

            xhr.onload=function() {
                    if (this.status===200) {
                        /**obtener datos de la respuesta */
                        let respuesta=JSON.parse(xhr.responseText);
                        let proyecto=respuesta.nombre_proyecto,
                        id_proyecto=respuesta.id_insertado,
                        tipo=respuesta.tipo,
                        resultado=respuesta.respuesta;

                        /**comporbar la insercion*/

                        if (resultado==='correcto') {

                            /**Fue exitoso */

                            if (tipo==='crear') {
                                /**Se creo un nuevo proyecto, 
                                 * Inyectar el HTML*/
                                 var nuevoProyecto=document.createElement('li');
                                    nuevoProyecto.innerHTML=`
                                    <a href="index.php?id_proyecto={id_proyecto}" id="proyecto:${id_proyecto}">
                                    ${proyecto}
                                    </a>
                                    
                                    `;
                                    /**agregar al html */
                                        listaProyectos.appendChild(nuevoProyecto);

                                    /** enviar alerta */

                                    Swal.fire({
                                        type: 'success',
                                        title: 'Proyecto Creado!',
                                        text: 'El proyecto: ' + proyecto +' se creó correctamente!'
                                      })
                                       .then(resultado=>{
                                        if (resultado.value) {
                                            window.location.href='index.php?id_respuesta=' + id_proyecto;
                                        }
                                     });
            


                                
                            } else {
                                /**se actualizo o se elimino */
                                
                            }

                            
                        }else{
                            /**Hubo un Error */
                            Swal.fire({
                                type: 'error',
                                title: 'Error!',
                                text: 'Hubo un error!'
                              })


                        }
                            
                        
                    }
                }


                xhr.send(datos);



                }

        }

        /**AGREGAR NUEVA TAREA AL PROYECTO ACTUAL */


        function agregarTarea(e) {
            e.preventDefault();
            let nombreTarea=document.querySelector(".nombre-tarea").value;

            /**validar que el campo tenga algo escrito */

            if (nombreTarea === '') {

                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Una tarea no puede ir vacia!',
                    
                  })
                
            }else{
                /**la tarea tiene algo insertar en php */

                const xhr = new XMLHttpRequest();
                 let datos =new FormData();

                 datos.append('tarea', nombreTarea);
                 datos.append('accion', 'crear');
                 datos.append('id_proyecto', document.querySelector('#id_proyecto').value);


                xhr.open('POST','inc/modelos/modelo-tareas.php', true);

                xhr.onload=function () {
                    if (this.status===200) {
                        //todo correcto
                        let respuesta=JSON.parse(xhr.responseText);     
                        //asignar valores
                        var resultado=respuesta.respuesta,
                            tarea=respuesta.tarea,
                            id_insertado=respuesta.id_insertado,
                            tipo=respuesta.tipo;
                            
                            if (resultado=== 'correcto') {
                                /**SE AGREGO CORRECTAMENTE */
                                if (tipo==='crear') {
                                    //LANZAR ALERTA
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Tarea Creada!',
                                        text: 'La Tarea: ' + tarea +' se creó correctamente!'
                                      })

                                      /** SELECCIONAR PARRAFO CON LISTA VACIA */

                                      let parrafoListaVacia=document.querySelectorAll('.lista-vacia');

                                      if (parrafoListaVacia.length>0) {
                                        document.querySelector('.lista-vacia').remove();
                                      } 

                                        /**CONSTRUIR EL TEMPLATE */

                                        let nuevaTarea=document.createElement('li');
                                        /**AGREGAMOS EL ID */

                                        nuevaTarea.id='tarea:'+id_insertado;
                                        /**agregar la clase tarea */

                                        nuevaTarea.classList.add('tarea');
                                        /**CONSTRUIR EN HTML */
                                        nuevaTarea.innerHTML=`
                                        <p>${tarea}</p>
                                        <div class="acciones">
                                        <i class="far fa-check-circle"></i>
                                        <i class="fas fa-trash"></i>
                                        </div>
                                        
                                        `;

                                        /**AGREGARLO AL HTML */

                                        var listado=document.querySelector('.listado-pendientes ul');
                                        listado.appendChild(nuevaTarea);

                                        /**LIMPIAR EL FORMULARIO */
                                        document.querySelector('.agregar-tarea').reset();


                                         /**ACTUALIZAR EL PROGRESO */
                                          actualizarProgreso();

                                    
                                } 



                            }else{
                                /**HUBO UN ERROR */

                                Swal.fire({
                                    type: 'error',
                                    title: 'Error!',
                                    text: 'Hubo un error!'
                                  })
                            }


                    }
                    
                }


                xhr.send(datos);

            }
         
            
        }

/** CAMBIA EL ESTADO DE LAS TAREAS O LAS ELIMINA*/
        function accionesTareas(e){
         e.preventDefault();
            /**DELEGATION */

            if (e.target.classList.contains('fa-check-circle')) {

                if (e.target.classList.contains('completo')){
                    e.target.classList.remove('completo');
                    cambiarEstadoTarea(e.target,0);
                }else{
                    e.target.classList.add('completo');
                    cambiarEstadoTarea(e.target,1);
                }
                

            } 

            if (e.target.classList.contains('fa-trash')) {
                Swal.fire({
                    title: 'Seguro (a)?',
                    text: "Esta acción no se puede deshacer!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar !',
                    cancelButtonText: 'Cancelar'
                  }).then((result) => {
                    if (result.value) {
                        let tareaEliminar=e.target.parentElement.parentElement;
                        /**BORRAR DE LA BASE DE DATOS */
                        eliminarTareaBD(tareaEliminar);
                        /**BORRAR DEL HTML */
                        tareaEliminar.remove();
                      Swal.fire(
                        'Eliminado!',
                        'La tarea fue eliminada.',
                        'success'
                      )
                    }
                  })

                

            } 
        }

        /**COMPLETA O DESCOMPLETA UNA TAREA */

        function cambiarEstadoTarea(tarea,estado) {
            /**utilizo split para separar (tarea:1), tarea de 1 */
            let idTarea= tarea.parentElement.parentElement.id.split(':');
            
            /**CREAR LLAMADO A AJAX */

            const xhr=new XMLHttpRequest();

            /**crear el fromdata, para formatear mejor los datos a enviar */

            var datos =new FormData();
            datos.append('id', idTarea[1]);
            datos.append('accion', 'actualizar');
            datos.append('estado', estado);
            
            /**abrir la conexion */

            xhr.open('POST','inc/modelos/modelo-tareas.php', true);

            /**ejecutar la accion */
            
                xhr.onload=function() {
                    if(xhr.status===200){
                        console.log(JSON.parse(xhr.responseText));
                         /**ACTUALIZAR EL PROGRESO */
                        actualizarProgreso();
                    }
                }
                /**enviar */

                xhr.send(datos);
        }


        /**ELIMINA LA TAREA DE LA BASE DE DATOS */


        function eliminarTareaBD(tarea){

            let idTarea= tarea.id.split(':');
            
            /**CREAR LLAMADO A AJAX */

            const xhr=new XMLHttpRequest();

            /**crear el fromdata, para formatear mejor los datos a enviar */

            var datos =new FormData();
            datos.append('id', idTarea[1]);
            datos.append('accion', 'eliminar');
           
            
            /**abrir la conexion */

            xhr.open('POST','inc/modelos/modelo-tareas.php', true);

            /**ejecutar la accion */
            
                xhr.onload=function() {
                    if(xhr.status===200){
                        console.log(JSON.parse(xhr.responseText));

                        /**COMPROBAR QUE HAYA TAREAS RESTANTES */

                        var listaTareasRestantes=document.querySelectorAll('li.tarea');

                        if( listaTareasRestantes.length==0){
                            document.querySelector('.listado-pendientes ul').innerHTML="<p class='lista-vacia'> no hay Tareas en este proyecto</p>";

                        }

                        /**ACTUALIZAR EL PROGRESO */

                        actualizarProgreso();
                    }
                }
                /**enviar */

                xhr.send(datos);
        }

        /**ACTUALIZA EL AVANCE DEL PROYECTO */

        function actualizarProgreso() {
            /**obtener todas las tareas */
            const tareas =document.querySelectorAll('li.tarea');

           

            /**obtener las tareas completadas */

            const tareasCompletadas=document.querySelectorAll('i.completo');
          

            /**DETERMINAR EL AVANCE */

           const avance =Math.round( (tareasCompletadas.length/tareas.length)*100);
          console.log(avance);

          /**ASIGNAR EL AVANCE A LA BARRA */
            const porcentaje=document.querySelector('#porcentaje');
            porcentaje.style.width=avance+'%';

            if(avance===100){
                Swal.fire({
                    type: 'success',
                    title: 'Proyecto Terminado!',
                    text: 'Ya no tienes tareas pendientes!'
                  })
            }

        }