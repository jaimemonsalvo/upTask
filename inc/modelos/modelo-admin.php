<?php

$accion = $_POST['accion'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];

        if ($accion === 'crear') {
            /** codigo para los administradores
             * hashear password */
            $opciones= array(
                'cost'=> 12
            );
            $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

        /**Importar la conexion */
        include '../funciones/conexion.php';
        
            try {
                /**Realizar consulta a la base de datos */

                        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES(?,?)");
                        $stmt->bind_param("ss", $usuario, $hash_password);
                        $stmt->execute();
                        if ($stmt->affected_rows==1) {
                        $respuesta = array(
                            'respuesta' => 'correcto',
                            'id_insertado' => $stmt->insert_id,
                            'tipo' =>$accion

                        );
                    }else{
                        $respuesta= array(
                            'respuesta'=>'error'
                        );
                    }
                         $stmt->close();
                        $conn->close();
                    } catch (Exception $e) {
                        $respuesta = array(
                            'pass' => $e->getMessage()
                        );
                    }
                
                    
                    echo json_encode($respuesta);
                }
            


if ($accion==='login') {
    /** codigo para que se pueda loguear  los administradores*/ 
    include '../funciones/conexion.php';
    /**seleccinar el administrador de la base de datos */
            try{
                $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
                $stmt->bind_param("s", $usuario);
                $stmt->execute();
                /**loguear el usuario */
                $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
                $stmt->fetch();
             if($nombre_usuario){

                /**el usuario existe verificar password */
                if (password_verify($password, $pass_usuario)){
                    /**iniciar la sesion */
                    session_start();
                    $_SESSION['nombre']=$usuario;
                    $_SESSION['id']=$id_usuario;
                    $_SESSION['login']=true;

                    /**login correcto */
                $respuesta = array(
                    'respuesta' =>   'correcto',
                    'nombre'    =>   $nombre_usuario,
                    'tipo'    =>   $accion
                );
                } else{
                        /**Login incorrecto enviar error */
                    $respuesta = array(
                        'resultado' => 'Password Incorrecto'
                    );
                
                }
             }else{
                  $respuesta= array(
                 'Error'=>'Usuario no existe'

                        );
                    }
                $stmt->close();
                $conn->close();
            } catch (Exception $e) {
                $respuesta = array(
                    'pass' => $e->getMessage()
            );
    }
    echo json_encode($respuesta);
}
