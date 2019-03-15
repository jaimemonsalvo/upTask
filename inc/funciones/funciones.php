<?php
/**obtiene la pagina actual que se ejecuta */
function obtenerPaginaActual(){
 $archivo = basename($_SERVER['PHP_SELF']);
 $pagina = str_replace(".php", "", $archivo);
 return $pagina;
}

/**consultas */
 
 /* OBTENER TODOS LOS PROYECTOS*/

 function obtenerProyectos(){
 include 'conexion.php';
  try {
        return $conn->query('SELECT id, nombre FROM proyectos');
        } catch (Exceptiom $e) {
        echo  'Error!! : ' . $e->getMessage();
        return false;

    }
 }

/* OBTENER EL NOMBRE DEL PROYECTO*/

function obtenernombreProyecto($id=null){

    include 'conexion.php';
    try {
    return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}" );
          } catch (Exceptiom $e) {
          echo  'Error!! : ' . $e->getMessage();
          return false;
  
      }

}

/**OBTENER LAS CLASES DEL PROYECTO */

function obtenerTareasProyecto($id=null){

    include 'conexion.php';
    try {
    return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}" );
          } catch (Exceptiom $e) {
          echo  'Error!! : ' . $e->getMessage();
          return false;
  
      }

}