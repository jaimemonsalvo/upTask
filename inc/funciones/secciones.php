<?php
/**el usuario debera estar autenticado sino lo redirecciaremos a login para q ingrese */
function usuario_autenticado(){
    if (!revisar_usuario()){
        header('Location:login.php');
        exit();
    }
}
/**Revisar seccion iniciada */
function revisar_usuario(){
    return isset($_SESSION['nombre']);

}

/**seccion es informacion guardada dentro del servidor,
 *  esta seccion contiene informacion de usuario  y una vez
 *  despues de iniciada permite al usuario ir de una pagina a otra*/
session_start();
usuario_autenticado();